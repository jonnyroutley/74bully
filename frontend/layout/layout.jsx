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
          <Heading><Link href={'/'}>74 Bully Household</Link></Heading>
          <Box>
            <Link p={2} href={'/announcements'}>Announcement</Link>
            <Link p={2} href={'/shopping-list'}>Shopping List</Link>
            <Link p={2} href={'/house-rules'}>Rules</Link>
            <Link p={2} href={'/ratings'}>Ratings</Link>
            <Link p={2} href={'/bins'}>Bins</Link>
            <Link p={2} href={'/libraries'}>Libraries</Link>
          </Box>
        </Box>
        <Center w={'100%'}bg={"rgb(128,255,51)"}>
          {children}
        </Center>
      </Box>
    </>
  )
}