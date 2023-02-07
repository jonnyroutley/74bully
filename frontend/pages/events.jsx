import { Heading, Box, Text, SkeletonText, Flex, Divider, Avatar, Input } from "@chakra-ui/react"
import { ChatIcon, AddIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"

const AddComment = ({event_id, fetchData}) => {
  const [comment, setComment] = useState("")

  const SubmitComment = async () => {
    if (comment == "") return
    try {
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/events/comment/create/" + event_id, {
        method: "POST",
        body: JSON.stringify({
          content: comment,
          person: ""
        }),
      });
      if (res.status === 200) {
        setComment("");
        fetchData()
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Flex gap={3} alignItems={'center'} mt={2}>
      <Input type="text" placeholder={'New Comment'} value={comment} onChange={(e) => setComment(e.target.value)}/>
      <AddIcon onClick={() => SubmitComment()} cursor={'pointer'}/>
    </Flex>
  )
}

const Comments = ({comments}) => {
  if (comments.length < 1)  return
  return (
    <Box bg={'gray.100'} p={3} borderRadius={'md'} mt={2}>
      {comments.map((comment) => (
        <Flex alignItems={'center'} py={1} key={comment.id}>
          <Avatar name={comment.person}  width={25} height={25} mr={2}/>
          <Text bg={'gray.300'} px={2} py={0.5} borderRadius={'xl'} pb={1}>{comment.content}</Text>
        </Flex>
      ))}
    </Box>
  )
}

const MetaSection = ({comments}) => {
  const [showComments, setShowComments] = useState(false)

  return (
    <>
    <Divider my={2}/>
    <Flex alignItems={'center'} direction={'row'} gap={2} onClick={() => setShowComments(!showComments)} cursor={'pointer'}>
      <ChatIcon />
      <Text>
        {comments.length}
      </Text>
    </Flex>
    {showComments && <Comments comments={comments}/>}
    </>
  )
}

const Event = ({event, fetchData}) => {
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
          <MetaSection comments={event.comments} />
          <AddComment event_id={event.id} fetchData={fetchData}/>
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
        <MetaSection comments={event.comments} />
        <AddComment event_id={event.id} fetchData={fetchData}/>
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
              fetchData={fetchData}
            />
          ))}
          <Heading mb={2} mt={3} size={'md'}>Past</Heading>
          {events.past.map((event) => (
            <Event
              key={event.id}
              event={event}
              fetchData={fetchData}
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
