import { Box } from "@chakra-ui/react";


export default function Layout({ children }) {
  return (
    <>
      <Box>
        <h1>hi</h1>
        <main>{children}</main>
      </Box>
    </>
  )
}