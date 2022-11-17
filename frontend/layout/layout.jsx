import { Box, Heading, Center } from "@chakra-ui/react";


export default function Layout({ children }) {
  return (
    <>
      <Box h={"100vh"} bg={"gray.200"}>
        <Box p={5} bg={'rgb(128,255,51)'}>
          <Heading>74 Bully Household</Heading>
        </Box>
        <Center w={'100%'}>
          <Box w='xl' maxW={'100%'} my={5} p={2}>
            {children}
          </Box>
        </Center>
      </Box>
    </>
  )
}