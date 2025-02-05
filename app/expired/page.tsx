import { XCircleIcon } from "lucide-react"

export default function ExpiredPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="tech-card card-glow w-full max-w-md p-8">
                <div className="text-center">
                    <XCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
                    <h1 className="text-3xl font-bold mb-2 text-red-500 neon-glow">Link Expired</h1>
                    <p className="text-[hsl(var(--text-secondary))] mb-4">The shared password is no longer accessible</p>
                    <p className="text-[hsl(var(--text-secondary))]">
                        This link has expired or reached its usage limit. The shared password cannot be retrieved.
                    </p>
                </div>
            </div>
        </main>
    )
}

