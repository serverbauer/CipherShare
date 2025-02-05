"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { KeyIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import type React from "react" // Added import for React

export default function ViewSharedPassword({ params }: { params: { uuid: string } }) {
  const [accessPassword, setAccessPassword] = useState("")
  const [sharedPassword, setSharedPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkLinkValidity()
  }, [])

  const checkLinkValidity = async () => {
    try {
      const response = await fetch(`/api/share/${params.uuid}`, { method: "GET" })
      if (!response.ok) {
        router.push("/expired")
      }
      setLoading(false)
    } catch (error) {
      router.push("/expired")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const response = await fetch(`/api/share/${params.uuid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessPassword }),
      })
      const data = await response.json()
      if (response.ok) {
        setSharedPassword(data.password)
      } else {
        setError(data.message)
        if (response.status === 410) {
          router.push("/expired")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-[hsl(var(--neon-glow))] neon-glow">Loading...</div>
        </div>
    )
  }

  return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="tech-card card-glow w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 neon-glow text-[hsl(var(--neon-glow))]">View Shared Password</h1>
            <p className="text-[hsl(var(--text-secondary))]">Enter the access password to view the shared secret</p>
          </div>

          {!sharedPassword ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-[hsl(var(--text-secondary))]">Access Password</label>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="password"
                        value={accessPassword}
                        onChange={(e) => setAccessPassword(e.target.value)}
                        required
                        placeholder="Enter access password"
                        className="tech-input pl-10"
                    />
                  </div>
                </div>

                <button type="submit" className="gradient-button w-full">
                  View Password
                </button>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </form>
          ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-[hsl(var(--text-secondary))]">Shared Password</label>
                  <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={sharedPassword}
                        readOnly
                        className="tech-input pr-10"
                    />
                  </div>
                </div>
                <p className="text-sm text-[hsl(var(--text-secondary))]">
                  This password has been revealed. It may no longer be accessible after closing this page.
                </p>
              </div>
          )}
        </div>
      </main>
  )
}

