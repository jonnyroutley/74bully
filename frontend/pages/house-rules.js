import { Heading, ListItem, UnorderedList, Box } from "@chakra-ui/react";
import Layout from "../layout/layout"

const HouseRules = () => {
  return (
    <Layout metas={{title: "House Rules"}}>
      <Box w='xl' maxW={'100%'} my={5} p={2}>
        <Heading>House Rules</Heading>
        <UnorderedList>
          <ListItem>No Eating Fig Rolls in the Bathroom</ListItem>
          <ListItem>No Exclusionary Coding Chat</ListItem>
          <ListItem>The Beanie Stays On</ListItem>
        </UnorderedList>
      </Box>
    </Layout>
  )
}

export default HouseRules;
