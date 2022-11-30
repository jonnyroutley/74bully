import { Button, Heading, Box, Spinner, Center, Text, Input, Select, useRadio, useRadioGroup, useToast, Image, FormLabel, Textarea } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"

function CustomRadio(props) {
  const { image, ...radioProps } = props
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } = useRadio(radioProps)

  return (
    <FormLabel {...htmlProps} cursor='pointer'>
      <input {...getInputProps({})} hidden />
      <Box
        {...getCheckboxProps()}
        bg={state.isChecked ? 'blue.400' : 'transparent'}
        w={12}
        p={1}
        rounded='sm'
      >
        <Image src={image} rounded='sm' {...getLabelProps()} />
      </Box>
    </FormLabel>
  )
}

const Announcements = () => {
  const [senders, setSenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [sender, setSender] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [icon, setIcon] = useState("1")

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
      setIsSubmitting(true)
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/announcements", {
        method: "POST",
        body: JSON.stringify({
          sender,
          title,
          message,
          icon
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
    setIsSubmitting(false)

  }

  const toast = useToast()

  const avatars = [
    { name: '1', image: './icons/1.jpg' },
    { name: '5', image: './icons/5.jpg' },
    { name: '33', image: './icons/33.jpg' },
    { name: '95', image: './icons/95.jpg' },
    { name: '96', image: './icons/96.jpg' },
    { name: '120', image: './icons/120.jpg' },
  ]

  const handleChange = (value) => {
    setIcon(value)
  }

  const { value, getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: icon,
    onChange: handleChange,
  })

  return (
    <Layout metas={{title: "Announcements"}}>
      <Box w='xl' maxW={'100%'} my={5} p={2}>
      <Heading>Announcements</Heading>
      <Text my={2}>🔔 Notification Time 🔔</Text>
      {!loading &&
      <form onSubmit={makeAnnouncement} method="POST">
        <Box display={'flex'} mb={2} flexDir={'column'} {...getRootProps()}>
          <Box display={'flex'} flexDir={'row'} justifyContent={'space-between'}>
            {avatars.map((avatar) => {
              return (
                <CustomRadio
                key={avatar.name}
                  image={avatar.image}
                  {...getRadioProps({ value: avatar.name })}
                  />
                  )
                })}

          </Box>
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
          <Button type="submit" colorScheme={'teal'} my={1} isLoading={isSubmitting}>Send Message</Button>
        </Box>
      </form>
      }
    </Box>
    </Layout>
  )
}

export default Announcements;
