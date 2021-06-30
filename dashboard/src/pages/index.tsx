import { withPageAuthRequired } from "@auth0/nextjs-auth0"

const Home = () => <div>Nothing to see here yet</div>

export default Home

export const getServerSideProps = withPageAuthRequired()
