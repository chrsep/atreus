import hydrate from "preact-iso/hydrate"
import { LocationProvider, Router } from "preact-iso/router"
import lazy from "preact-iso/lazy"
// @ts-ignore
import files from "ls:./pages"
import { Layout } from "./components/layout"
import { NotFound } from "./pages/_404"

// Generate a Route component and URL for each "page" module:
const routes = files.map((name) => ({
  Route: lazy(() => import(`./pages/${name}`)),
  url: "/" + name.replace(/(index)?\.\w+$/, ""), // strip file extension and "index"
}))

export function App() {
  return (
    <LocationProvider>
      <Layout>
        <Router>
          {routes.map(({ Route, url }) => (
            <Route path={url} />
          ))}
          <NotFound default />
        </Router>
      </Layout>
    </LocationProvider>
  )
}

hydrate(<App />)

export async function prerender(data) {
  const { default: prerender } = await import("preact-iso/prerender")
  return await prerender(<App {...data} />)
}
