import { Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import Layout from "../layout/layout"

const HouseRules = () => {
  return (
    <Layout metas={{title: "House Rules"}}>
      <Box w='xl' maxW={'100%'} my={5} p={2}>
        <Heading>House Rules</Heading>
        <UnorderedList>
          <ListItem>No Pooping</ListItem>
        </UnorderedList>
      </Box>
    </Layout>
  )
}

export default HouseRules;
