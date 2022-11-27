import { Box, Heading, Center, Link } from "@chakra-ui/react";
import Head from "next/head";


export default function Layout({ metas, children }) {
  return (
    <>
      <Head>
        <title>{metas.title}</title>
        <meta name="description" content="The 74 Bully House Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box h={"100vh"} bg={"rgb(128,255,51)"}>
        <Box p={5} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Heading>74 Bully Household</Heading>
          <Box>
            <Link p={1} href={'/announcements'}>Announcement</Link>
            <Link p={1} href={'/shopping-list'}>Shopping List</Link>
            <Link p={1} href={'/house-rules'}>Rules</Link>
            <Link p={1} href={'/ratings'}>Ratings</Link>
          </Box>
        </Box>
        <Center w={'100%'}bg={"rgb(128,255,51)"}>
          <Box w='xl' maxW={'100%'} my={5} p={2}>
            {children}
          </Box>
        </Center>
      </Box>
    </>
  )
}