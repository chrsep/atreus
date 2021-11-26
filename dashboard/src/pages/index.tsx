import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { SSRPage } from "@lib/next"

const Home: SSRPage<typeof getServerSideProps> = () => {
  return <div />
}

export default Home

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async () => {
    return {
      props: {},
    }
  },
})
