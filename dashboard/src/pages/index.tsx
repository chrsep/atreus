import { withPageAuthRequired } from "@auth0/nextjs-auth0"

const Home = () => {
  return <div />
}

export default Home

export const getServerSideProps = withPageAuthRequired()
