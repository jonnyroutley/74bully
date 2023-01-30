import { Heading, Box, Text, SkeletonText } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"

const Event = ({event}) => {
  const formatDateTime = (dt) => {
    const today = new Date(dt)
    return new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: 'numeric', minute: 'numeric'}).format(today)
  }

  if (event.feature) {
    return (
      <Box display={'flex'} bg={'white'} flexDir={'column'} mb={2} borderRadius={'lg'} overflow={'hidden'} borderBottom={'1px solid'} borderColor={'gray.400'}>
        <img src={event.feature}/>
        <Box p={6}>
          <Heading size={'md'}>{event.title}</Heading>
          <Heading size={'sm'} fontWeight={400} mb={3} as={'i'}>{event.desc}</Heading>
          <Text>Time and Date: {formatDateTime(event.time_and_date)}</Text>
          <Text>Location: {event.location}</Text>
        </Box>
      </Box>
    )
  } else {
    return (
      <Box display={'flex'} bg={'white'} flexDir={'column'} p={6} mb={2} borderRadius={'lg'} borderBottom={'1px solid'} borderColor={'gray.400'}>
        <Heading size={'md'}>{event.title}</Heading>
        <Heading size={'sm'} fontWeight={400} mb={3} as={'i'}>{event.desc}</Heading>
        <Text>Time and Date: {formatDateTime(event.time_and_date)}</Text>
        <Text>Location: {event.location}</Text>
      </Box>
    )
  }

}

const Events = () => {
    const [events, setEvents] = useState({})
    const [loading, setLoading] = useState(true)
  
    const fetchData = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/events/');
      let data = await res.json()
      setEvents({future: data.future_events, past: data.past_events})
      setLoading(false)
    }
  
    useEffect(() => {
      fetchData()
        .catch(console.error);
    }, [])

    return (
        <Layout metas={{title: "Events at 74 Bully"}}>
        <Box w='xl' maxW={'100%'} my={5} p={2}>
          <Heading>Events at 74 Bully</Heading>
          <Text my={2}>Come hang out with us haha</Text>
          {loading ?
          <>
          <Box display={'flex'} bg={'white'} flexDir={'column'} p={6} borderRadius={'lg'} borderBottom={'1px solid'} borderColor={'gray.400'} mt={6}>
            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
          </Box>
          </>:
          <>
          <Box w={'600px'} maxW={'100%'}  mt={6}>
            <Heading mb={2} size={'md'}>Upcoming</Heading>
            {events.future.map((event) => (
              <Event
                key={event.id}
                event={event}
              />
            ))}
            <Heading mb={2} mt={3} size={'md'}>Past</Heading>
            {events.past.map((event) => (
              <Event
                key={event.id}
                event={event}
              />
            ))}
          </Box>
          </>
        }
        </Box>
      </Layout>

    )
}

export default Events
