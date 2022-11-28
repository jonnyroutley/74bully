import { Heading, Box, Spinner, Center, Text, Image, Badge, Link } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"

const Libraries = () => {
  const [libraries, setLibraries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/libraries/');
    let data = await res.json()
    setLibraries(data.libraries)
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
      <Box w='xxxl' maxW={'100%'} my={5} p={2}>
        <Heading>Libraries</Heading>
        <Text my={2}>Go work.</Text>
        {loading ?
        <>
        <Center>
          <Spinner m={6} size='lg'/>
        </Center>
        </>:
        <>
        <Box w={'1200px'} maxW={'100%'} display={'flex'} flexDir={'row'} flexWrap={'wrap'}>
          {libraries.map((library) => (
            <Box key={library.id} display={'flex'} bg={'white'} m={1} p={2} borderRadius={10} boxShadow={'lg'} flexDir={'column'} w={'200px'} py={2} borderBottom={'1px solid'} borderColor={'gray.400'}>
              <Heading size={'md'}>{library.name}</Heading>
              <Box display={'flex'} flexDirection={'row'}>
                <Box pr={3}>
                  <Text>Mon:</Text>
                  <Text>Tues:</Text>
                  <Text>Wed:</Text>
                  <Text>Thurs:</Text>
                  <Text>Fri:</Text>
                  <Text>Sat:</Text>
                  <Text>Sun:</Text>
                </Box>
                <Box>
                  <Text>{library.times.Mon}</Text>
                  <Text>{library.times.Tues}</Text>
                  <Text>{library.times.Wed}</Text>
                  <Text>{library.times.Thurs}</Text>
                  <Text>{library.times.Fri}</Text>
                  <Text>{library.times.Sat}</Text>
                  <Text>{library.times.Sun}</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        </>
      }
      </Box>
    </Layout>
  )
}

export default Libraries;
