import { Button, Heading, Box, Spinner, Center, Text, Input, Image, Badge, Link } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"


const ShoppingList = () => {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState("")

  const fetchData = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/ratings/');
    let data = await res.json()
    setRatings(data.ratings)
    setLoading(false)
  }

  useEffect(() => {
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [])

  const createTask = async (e) => {
    e.preventDefault()
    try {
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/tasklist/create", {
        method: "POST",
        body: JSON.stringify({
          content: newTask
        }),
      });
      if (res.status === 200) {
        setNewTask("");
        fetchData()
      }
    } catch (err) {
      console.log(err);
    }
  }

  const formatTime = (dt) => {
    const today = new Date(dt)
    return new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(today)
  }

  const BadgeRating = ({stars}) => {
    if (stars > 3) {
      return <Badge colorScheme={'green'}>Rated {stars} cats</Badge>
    } else if (stars > 1) {
      return <Badge colorScheme={'orange'}>Rated {stars} cats</Badge>
    } else {
      return <Badge colorScheme={'red'}>Rated {stars} cats</Badge>
    }
  }


  return (
    <Layout metas={{title: "House Ratings"}}>
        <Heading>House Ratings</Heading>
        <Text my={2}>From our lovely visitors</Text>
        <Link
          href={'/ratings/create'}
          bg={'pink.500'}
          color={'white'}
          borderRadius={6}
          py={2}
          px={4}
          display={'inline-block'}
          my={2}
        >Leave a review</Link>
        {loading ?
        <>
        <Center>
          <Spinner m={6} size='lg'/>
        </Center>
        </>:
        <>
        <Box w={'600px'} maxW={'100%'} bg={'white'} boxShadow={'md'} borderRadius={'10px'} p={2} px={4}>
          {ratings.map((rating) => (
            <Box key={rating.id} display={'flex'} flexDir={'column'} py={2} borderBottom={'1px solid'} borderColor={'gray.400'}>
              <Heading size={'md'}>{rating.title}</Heading>
              <Heading size={'sm'} fontWeight={400} mb={3}>{rating.name}</Heading>
              <Box display={'flex'} flexDir={'row'}>
                {[...Array(rating.stars)].map((e,i) => <Image src={'cat-icon.png'} w={10} p={1}/>)}
                {[...Array(5 - rating.stars)].map((e,i) => <Image src={'cat-icon-gray.png'} w={10} p={1}/>)}
              </Box>
              <Box>
              <BadgeRating stars={rating.stars}/>
              </Box>
              <Text py={5}>{rating.review}</Text>
              <Text color={'gray.400'}>Visited - {formatTime(rating.date_created)}</Text>
            </Box>
          ))}
        </Box>
        </>
      }
    </Layout>
  )
}

export default ShoppingList;
