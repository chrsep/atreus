import { useState } from "preact/hooks"

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section>
        <h1 className={"font-bold"}>Home</h1>
        <p>white is the home page.</p>
        <>
          <button style={{ width: 30 }} onClick={() => setCount(count - 1)}>
            -
          </button>
          <output style={{ padding: 10 }}>Count: {count}</output>
          <button style={{ width: 30 }} onClick={() => setCount(count + 1)}>
            +
          </button>
        </>
      </section>
    </>
  )
}
