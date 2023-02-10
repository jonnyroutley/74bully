import { 
  Box, Heading, Center, Link, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, 
  DrawerContent, DrawerCloseButton, useDisclosure, Button
} from "@chakra-ui/react";
import {useState} from "react";
import Head from "next/head";


export default function Layout({ metas, children }) {

  const { isOpen, onOpen, onClose } = useDisclosure()

  const links = [
    {name: "Announcement", link: "/announcements"},
    {name: "Shopping List", link: "/shopping-list"},
    // {name: "Health", link: "/health"},
    {name: "Reviews", link: "/ratings"},
    {name: "Bins", link: "/bins"},
    {name: "Libraries", link: "/libraries"},
    {name: "Events", link: "/events"},
    {name: "Cozymeter", link: "/temperature"},
  ]

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
          <Box display={{ base: "none", lg: "flex"}}>
            {links.map((link) => (
              <Link key={link.link} p={2} href={link.link}>{link.name}</Link>
            ))}
          </Box>
          <Button colorScheme='purple' onClick={onOpen} bg={"rgb(227,28,121)"} display={{ base: "block", lg: "none"}}>
            Menu
          </Button>
        </Box>

        <Drawer placement={'right'} onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent color={'white'} bg={"rgb(227,28,121)"}>
            <DrawerHeader borderBottomWidth='1px'>Cool Drawer</DrawerHeader>
            <DrawerBody>
              {links.map((link) => (
                <Link key={link.link} p={2} href={link.link} display={"block"}>{link.name}</Link>
              ))}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Center w={'100%'}bg={"rgb(128,255,51)"}>
          {children}
        </Center>
      </Box>
    </>
  )
}