import { Button, Heading, Box, Spinner, Center, Text, Input, Select, useRadio, useRadioGroup, useToast, Image, FormLabel, Textarea } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Layout from "../../layout/layout"
import Rating from "../ratings/Rating"

const CreateEvent = () => {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const toast = useToast()

  const createEvent = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/events/create", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          location,
          eventTime
        }),
      });
      if (res.status === 200) {
        // clear inputs
        setDesc("");
        setTitle("");
        setLocation("");
        setEventTime("");

        router.push("/events")
        // toast({
        //   title: "Review Submitted",
        //   description: "View your review on the reviews page.",
        //   status: 'success',
        //   duration: 5000,
        //   isCloseable: true
        // })
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Issue with Event",
        description: "Something went wrong when creating your eveent",
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
    setIsSubmitting(false)
  }


  return (
    <Layout metas={{title: "Create Event"}}>
      <Box w='xl' maxW={'100%'} my={5} p={2}>
      <Heading>Create an Event</Heading>
      <form onSubmit={createEvent} method="POST">
        <Box display={'flex'} mb={2} flexDir={'column'}>
          <Input
            type="text"
            name="title"
            id="title"
            bg={'white'}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder={"Title"}
            my={1}
            required
          />
          <Input
            type="text"
            name="location"
            id="location"
            bg={'white'}
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            placeholder={"Location"}
            my={1}
            required
          />
          <Input
            type="datetime-local"
            name="eventTime"
            id="eventTime"
            bg={'white'}
            onChange={(e)=> setEventTime(e.target.value)}
            value={eventTime}
            my={1}
            required
          />
          <Textarea
            type="text"
            name="desc"
            id="desc"
            bg={'white'}
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            placeholder={"Description"}
            my={1}
            required
            />
          <Button type="submit" colorScheme={'teal'} my={1} isLoading={isSubmitting}>Create Event</Button>
        </Box>
      </form>
      </Box>
    </Layout>
  )
}

export default CreateEvent;
