import hydrate from "preact-iso/hydrate"
import { LocationProvider, Router } from "preact-iso/router"
import { ErrorBoundary } from "preact-iso/lazy"
import Home from "./pages/home"
import NotFound from "./pages/_404"
import Header from "./header"

export function App() {
  return (
    <LocationProvider>
      <div class="h-full">
        <Header />
        <ErrorBoundary>
          <Router>
            <Home path="/" />
            <NotFound default />
          </Router>
        </ErrorBoundary>
      </div>
    </LocationProvider>
  )
}

hydrate(<App />)

export async function prerender(data) {
  const { default: prerender } = await import("preact-iso/prerender")
  return await prerender(<App {...data} />)
}
