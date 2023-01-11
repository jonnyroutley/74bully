import { Heading, Box, Spinner, Center, Text, Image, Badge, Link } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"


const Ratings = () => {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/ratings/');
    let data = await res.json()
    // Filter out any archived ratings
    // This should be done server side
    var new_ratings = data.ratings.filter(function(rating) {
      return rating.archive != true;
    });
    setRatings(new_ratings)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
      .catch(console.error);
  }, [])

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
      <Box w='xl' maxW={'100%'} my={5} p={2}>
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
                {[...Array(rating.stars)].map((e,i) => <Image key={i} src={'cat-icon.png'} w={10} p={1}/>)}
                {[...Array(5 - rating.stars)].map((e,i) => <Image key={i} src={'cat-icon-gray.png'} w={10} p={1}/>)}
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
      </Box>
    </Layout>
  )
}

export default Ratings;
