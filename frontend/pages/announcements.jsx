import { Button, Heading, Box, Spinner, Center, Text, Input, Select} from "@chakra-ui/react"
import { CheckIcon, CloseIcon, SmallAddIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"
import styles from '../styles/Home.module.scss'


const Announcements = () => {
  const [senders, setSenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [sender, setSender] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  const fetchSenders = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/announcements/senders');
    let data = await res.json()
    setSenders(data.senders)
    setLoading(false)
  }

  useEffect(() => {
  
    // call the function
    fetchSenders()
      // make sure to catch any error
      .catch(console.error);
  }, [])

  const makeAnnouncement = async (e) => {
    e.preventDefault()
    try {
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/announcements", {
        method: "POST",
        body: JSON.stringify({
          sender: sender,
          title: title,
          message: message
        }),
      });
      if (res.status === 200) {
        // clear inputs

        setSender("");
        setTitle("");
        setMessage("");

      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Layout metas={{title: "Announcements"}}>
        <Heading>Announcements</Heading>
        <Text my={2}>🔔 Notification Time 🔔</Text>
        <form onSubmit={makeAnnouncement} method="POST">
          <Box display={'flex'} mb={2} flexDir={'column'}>
            <Select
              name="sender"
              id="sender"
              bg={'white'}
              onChange={(e) => setSender(e.target.value)}
              value={sender}
              placeholder={"Set Sender"}
              my={1}
              required
            >
              {senders.map((sender) => (
                <option key={sender} value={sender}>{sender}</option>
              ))}
            </Select>
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
            <Input
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
            <Button type="submit" colorScheme={'teal'} my={1}>Send</Button>
          </Box>
        </form>
    </Layout>
  )
}

export default Announcements;
