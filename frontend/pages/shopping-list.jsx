import { useEffect, useState } from "react"
import Layout from "../layout/layout"
import styles from '../styles/Home.module.scss'


const ShoppingList = () => {
  const [tasks, setTasks] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:5000/tasklist/');
      let data = await res.json()
      console.log(data)
      setTasks(data)
    }
  
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [])

  return (
    <Layout>
      <main className={styles.main}>
        <h1>Shopping List</h1>
        <h2>{tasks.hi}</h2>
        <p>{tasks.hi}</p>

      </main>
    </Layout>
  )
}

export default ShoppingList;
