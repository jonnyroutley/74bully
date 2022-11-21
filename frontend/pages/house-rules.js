import { Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import Layout from "../layout/layout"

const HouseRules = () => {
  return (
    <Layout metas={{title: "House Rules"}}>
        <Heading>House Rules</Heading>
        <UnorderedList>
          <ListItem>No Pooping</ListItem>
        </UnorderedList>
    </Layout>
  )
}

export default HouseRules;
