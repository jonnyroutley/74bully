import { Button, Heading, Box, Spinner, Center, Text, Input, SkeletonText, SkeletonCircle } from "@chakra-ui/react"
import { CheckIcon, CloseIcon, SmallAddIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"

const Events = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
  
    const fetchData = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/events/');
      let data = await res.json()
      setEvents(data.events)
      setLoading(false)
    }
  
    useEffect(() => {
      fetchData()
        .catch(console.error);
    }, [])
  
    const formatTime = (dt) => {
      const dc = new Date(dt)
      return new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(dc)
    }

    const formatDateTime = (dt) => {
      const today = new Date(dt)
      return new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: 'numeric', minute: 'numeric'}).format(today)
    }


    return (
        <Layout metas={{title: "Events at 74 Bully"}}>
        <Box w='xl' maxW={'100%'} my={5} p={2}>
          <Heading>Events at 74 Bully</Heading>
          <Text my={2}>Come hang out with us haha</Text>
          {loading ?
          <>
          {/* <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' startColor='blue.500' endColor='gray.500'/> */}
          <Box display={'flex'} bg={'white'} flexDir={'column'} p={6} borderRadius={'lg'} borderBottom={'1px solid'} borderColor={'gray.400'} mt={6}>
            {/* <SkeletonCircle size='10' /> */}
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
          </Box>
          </>:
          <>
          <Box w={'600px'} maxW={'100%'} boxShadow={'md'} mt={6}>
            {events.map((event) => (
              <Box key={event.id} display={'flex'} bg={'white'}flexDir={'column'} p={6} mb={2} borderRadius={'lg'} borderBottom={'1px solid'} borderColor={'gray.400'}>
                <Heading size={'md'}>{event.title}</Heading>
                <Heading size={'sm'} fontWeight={400} mb={3} as={'i'}>{event.desc}</Heading>
                <Text>Time and Date: {formatDateTime(event.time_and_date)}</Text>
                <Text>Location: {event.location}</Text>
              </Box>
            ))}
          </Box>
          </>
        }
        </Box>
      </Layout>

    )
}

export default Events
