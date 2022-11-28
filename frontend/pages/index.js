import { Image, Box, Heading } from '@chakra-ui/react'
import Layout from '../layout/layout'
import styles from '../styles/Home.module.scss'

const MyComponent = ({my_name}) => {

  return (
    <>
      <Heading textAlign={'center'}>Hi there, {my_name}</Heading>
    </>
  )
}


const Home = () => {
  return (
    <Layout metas={{title: "74 Bully Dashboard"}}>
      <Box w='xl' maxW={'100%'} my={5} p={2}>
        <MyComponent
          my_name="JFMD"
        />
        <Box>
          <Image src={'./animals.png'}/>
        </Box>
      </Box>
    </Layout>
  )
}

export default Home;
