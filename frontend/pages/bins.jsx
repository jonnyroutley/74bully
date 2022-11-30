import { Button, Heading, Box, Spinner, Center, Text, Input } from "@chakra-ui/react"
import { CheckIcon, CloseIcon, SmallAddIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"
import styles from '../styles/Home.module.scss'


const Bins = () => {
    const [bins, setBins] = useState([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
  
    const fetchData = async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/bins/');
      let data = await res.json()
      setBins(data)
      setLoading(false)
    }

    const updateData = async () => {
      setIsRefreshing(true)
      try {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/bins/update/");
        if (res.status === 200) {
          fetchData()
        }
      } catch (err) {
        console.log(err);
      }
      setIsRefreshing(false)
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
      return new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(today)
    }
    
    return (
      <Layout metas={{title: "Bindicator"}}>
        <Box w='xl' maxW={'100%'} my={5} p={2}>
          <Heading>Bindicator</Heading>
          <Text my={2}>It's trash time</Text>
          {!loading &&
            <Text>Data last updated: {formatDateTime(bins.date_refreshed)}</Text>
          }
          <Button
            isLoading={isRefreshing}
            onClick={() => updateData()}
            bg={'pink.500'}
            color={'white'}
            borderRadius={6}
            py={2}
            px={4}
            display={'inline-block'}
            my={2}
          >Refresh</Button>
          {loading ?
          <>
          <Center>
            <Spinner m={6} size='lg'/>
          </Center>
          </>:
          <>
          <Box w={'600px'} maxW={'100%'} bg={'white'} boxShadow={'md'} borderRadius={'10px'} p={2} px={4}>
            {bins.bins.map((bin) => (
              <Box key={bin.color} display={'flex'} flexDir={'column'} py={2} borderBottom={'1px solid'} borderColor={'gray.400'}>
                <Heading size={'md'}>{bin.color}</Heading>
                <Heading size={'sm'} fontWeight={400} mb={3} as={'i'}>{bin.description}</Heading>
                <Text>Collection Date: {formatTime(bin.collection_date)}</Text>
              </Box>
            ))}
          </Box>
          </>
        }
        </Box>
      </Layout>
    )
  }
  
  export default Bins;