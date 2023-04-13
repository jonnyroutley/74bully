import { useRouter } from "next/router";
import Link from "next/link";

const Heading = () => {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center justify-between w-full p-6">
      <h1 className="text-4xl font-bold">74 Bully Household</h1>
      <div className="flex flex-row items-center justify-between gap-4">
        <p className={router.pathname == "/" ? "underline" : "hover:text-slate-700"}>
          <Link href="/">Home</Link>
        </p>
        <p className={router.pathname == "/lost-property" ? "underline" : "hover:text-slate-700"}>
          <Link href="/lost-property">Lost Property</Link>
        </p>
        <p className={router.pathname == "/shopping-list" ? "underline" : "hover:text-slate-700"}>
          <Link href="/shopping-list">Shopping List</Link>
        </p>
        <p className={router.pathname == "/reviews" ? "underline" : "hover:text-slate-700"}>
          <Link href="/reviews">Reviews</Link>
        </p>
      </div>
    </div>
  )
}

export {
  Heading
}