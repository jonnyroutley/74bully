import Layout from "../layout/layout"
import Head from 'next/head'
import styles from '../styles/Home.module.scss'


const MyFunc2 = ({bin}) => {
  return (
    <>
      <p>{bin}</p>
    </>
  )
}

const HouseRules = () => {

  return (
    <Layout>
      <main className={styles.main}>
        <h1>fdasfd</h1>
        <MyFunc2 bin={1000}/>
      </main>
    </Layout>
  )
}

export default HouseRules;
