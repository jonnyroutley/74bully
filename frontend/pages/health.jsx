import { Button, Heading, Box, Text, Input, Select, useRadio, useRadioGroup, useToast, Flex, Textarea, Center } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"
import { setCookie, getCookie } from 'cookies-next';

const Health = () => {
  const [senders, setSenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [sender, setSender] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toast = useToast()

  const fetchSenders = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/dwellers');
    let data = await res.json()
    setSenders(data.dwellers)
    setLoading(false)
  }
  
  useEffect(() => {
    fetchSenders()
    .catch(console.error);
  }, [])
  
  const recordPee = async (name) => {
    setIsSubmitting(true)
    try {
      let peed = getCookie('peed')
      if (peed == "yes") {
        toast({
          title: 'You are peeing too much',
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
        setIsSubmitting(false)
        return
      }
    } catch {
      console.log("error reading cookie")
      setIsSubmitting(false)
      return
    }
    try {
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/urinations", {
        method: "POST",
        body: JSON.stringify({
          name,
          comment
        }),
      });
      if (res.status === 200) {
        toast({
          title: 'Recorded your pee ' + name + '!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        setCookie('peed', 'yes', { maxAge: 60 * 5 });
        setSender("");
        setComment("")
      }
    } catch (err) {
      toast({
        title: 'Failed to record your pee!',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      console.log(err);
    }
    setIsSubmitting(false)
  }

  return (
    <Layout metas={{title: "Health Dashboard"}}>
      <Box w='xl' maxW={'100%'} my={5} p={2}>
      <Heading>Health Dashboard</Heading>
      <Text my={2}>🔔 Pee Time 💦 🔔</Text>
      {!loading &&
        <Flex flexDir={'column'} gap={4}>
          <Input type="text" value={comment} onChange={(e) => setComment(e.target.value)} bg={'white'} placeholder={'Comment on your pee if you want'}/>
          {senders.map((sender) => (
            <Button key={sender} onClick={() => recordPee(sender)} bg={'blue.500'} borderRadius={'xl'} color={'white'} p={8} cursor={'pointer'} disabled={isSubmitting}>
              <Heading>{sender}</Heading>
            </Button>
          ))}
        </Flex>
      }
    </Box>
    </Layout>
  )
}

export default Health;
