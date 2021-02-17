import { FC } from "preact/compat"
import { ErrorBoundary } from "preact-iso/lazy"

const Header: FC = () => (
  <header>
    <nav>
      <a href="/">Home</a>
    </nav>
  </header>
)

export const Layout: FC = ({ children }) => (
  <ErrorBoundary>
    <div class="h-full">
      <Header />
      {children}
    </div>
  </ErrorBoundary>
)
