import type { ReactNode } from "react"
import { Heading } from "@/components/Heading"

const Layout = ({ children } : { children: ReactNode}) => {
  return (
    <div className="bg-bully min-h-screen">
      <Heading/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="py-10">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  Layout
}