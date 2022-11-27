import { Button, Heading, Box, Spinner, Center, Text, Input, Select, useRadio, useRadioGroup, useToast, Image, FormLabel, Textarea } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Layout from "../../layout/layout"
import Rating from "./Rating"

const Announcements = () => {
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const makeAnnouncement = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/ratings/create", {
        method: "POST",
        body: JSON.stringify({
          name,
          title,
          review: message,
          stars: rating
        }),
      });
      if (res.status === 200) {
        // clear inputs
        setName("");
        setTitle("");
        setMessage("");
        setRating(0)
      }
    } catch (err) {
      console.log(err);
    }
    setIsSubmitting(false)

  }

  const toast = useToast()

  return (
    <Layout metas={{title: "Announcements"}}>
      <Heading>Rate your visit</Heading>
      <Text my={2}>🔔 Review Time 🔔</Text>
      <form onSubmit={makeAnnouncement} method="POST">
        <Box display={'flex'} mb={2} flexDir={'column'}>
          <Input
            type="text"
            name="title"
            id="name"
            bg={'white'}
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder={"Name"}
            my={1}
            required
          />
          <Box bg={'white'} borderRadius={6} p={3} my={1}>
            <Rating
              size={7}
              scale={5}
              fillColor="gold"
              strokeColor="grey"
              rating={rating}
              setRating={setRating}
            />
          </Box>
          <Input
            type="text"
            name="title"
            id="title"
            bg={'white'}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder={"Add Title"}
            my={1}
            required
          />
          <Textarea
            type="text"
            name="message"
            id="message"
            bg={'white'}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder={"Add Message"}
            my={1}
            required
            />
          <Button type="submit" colorScheme={'teal'} my={1} isLoading={isSubmitting}>Submit Review</Button>
        </Box>
      </form>
    </Layout>
  )
}

export default Announcements;
