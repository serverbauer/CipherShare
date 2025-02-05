"use client"

import { useState } from "react"
import { LockIcon, KeyIcon, CalendarIcon, HashIcon, CopyIcon, CheckIcon, InfinityIcon } from "lucide-react"
import type React from "react"
import { DatePicker } from "@/app/components/date-picker"
import { encrypt } from "@/lib/crypto"

export default function Home() {
  const defaultExpirationDate = () => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    return date.toISOString().slice(0, 16);
  };

  const [password, setPassword] = useState("")
  const [expirationDate, setExpirationDate] = useState(defaultExpirationDate());
  const [usageLimit, setUsageLimit] = useState("")
  const [accessPassword, setAccessPassword] = useState("")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const encryptedPassword = await encrypt(password)

    const response = await fetch("/api/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: encryptedPassword,
        expirationDate: new Date(expirationDate).toISOString(),
        usageLimit: Number.parseInt(usageLimit) || 0,
        accessPassword, // Send plain accessPassword
      }),
    })
    const data = await response.json()
    setGeneratedUrl(data.url)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="tech-card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 neon-glow text-[hsl(var(--neon-primary))]">CipherShare</h1>
            <p className="text-[hsl(var(--text-secondary))]">Secure Password Sharing in the Deep Web</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-[hsl(var(--text-secondary))]">Password to Share</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password to share"
                    className="tech-input pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[hsl(var(--text-secondary))]">Expiration Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                <DatePicker value={expirationDate} onChange={(value) => setExpirationDate(value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[hsl(var(--text-secondary))]">Usage Limit</label>
              <div className="relative">
                {Number.parseInt(usageLimit) === 0 ? (
                    <InfinityIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                ) : (
                    <HashIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                )}
                <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    required
                    placeholder="Enter usage limit (0 for unlimited)"
                    className="tech-input pl-12"
                />
                {Number.parseInt(usageLimit) === 0 && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-400">
                  Unlimited until expiration
                </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[hsl(var(--text-secondary))]">Access Password</label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                <input
                    type="password"
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    placeholder="Enter access password (optional)"
                    className="tech-input pl-12"
                />
              </div>
            </div>

            <button type="submit" className="gradient-button w-full">
              Create Shared Password
            </button>
          </form>

          {generatedUrl && (
              <div className="mt-6 p-4 rounded-lg border border-white/10 bg-black/20">
                <label className="text-sm text-[hsl(var(--text-secondary))]">Generated URL</label>
                <div className="flex mt-2 gap-2">
                  <input value={generatedUrl} readOnly className="tech-input" />
                  <button
                      onClick={handleCopy}
                      className="gradient-button px-3 flex items-center justify-center min-w-[44px]"
                      title="Copy to clipboard"
                  >
                    {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                  </button>
                </div>
              </div>
          )}
        </div>
      </main>
  )
}