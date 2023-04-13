import { Layout } from "@/layouts/layout";


const Reviews = () => {

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <h1 className="text-4xl text-bold">House Review</h1>
          <p>From our lovely visitors</p>
        </div>
      </div>
    </Layout>
  )
}

export default Reviews;