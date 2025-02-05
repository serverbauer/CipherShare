import "./globals.css"
import { Space_Grotesk } from "next/font/google"
import type React from "react" // Import React

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata = {
    title: "CipherShare",
    description: "Secure password sharing tool",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${spaceGrotesk.className} text-foreground min-h-screen flex items-center justify-center p-4`}>
        {children}
        </body>
        </html>
    )
}

