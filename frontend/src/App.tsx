import { type FormEvent, useState } from "react"

export default function App() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const params = new URLSearchParams({ name: name || "World" })
      const res = await fetch(`/api/hello?${params}`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data: { message: string } = await res.json()
      setMessage(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <main>
      <h1>FastAPI + React</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <button type="submit">Say hello</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className="error">{error}</p>}
    </main>
  )
}
