import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import CryptoJS from "crypto-js"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key"

export async function GET(request: Request, { params }: { params: { uuid: string } }) {
  const { uuid } = params

  const sharedPassword = await prisma.sharedPassword.findUnique({
    where: { id: uuid },
  })

  if (!sharedPassword) {
    return NextResponse.json({ message: "Password not found" }, { status: 404 })
  }

  if (
      new Date() > sharedPassword.expirationDate ||
      (sharedPassword.usageLimit !== 0 && sharedPassword.usageCount >= sharedPassword.usageLimit)
  ) {
    return NextResponse.json({ message: "Link expired" }, { status: 410 })
  }

  return NextResponse.json({ valid: true })
}

export async function POST(request: Request, { params }: { params: { uuid: string } }) {
  const body = await request.json()
  console.log('Request body:', body)
  const { accessPassword } = body
  console.log('Access password:', accessPassword)
  const { uuid } = params

  const sharedPassword = await prisma.sharedPassword.findUnique({
    where: { id: uuid },
  })
  console.log('Stored access password:', sharedPassword?.accessPassword)

  if (!sharedPassword) {
    return NextResponse.json({ message: "Password not found" }, { status: 404 })
  }

  // Check if access password is required
  if (sharedPassword.accessPassword && !accessPassword) {
    return NextResponse.json({ message: "Access password required" }, { status: 401 })
  }

  // Only verify password if one was set
  if (sharedPassword.accessPassword) {
    const passwordMatch = await bcrypt.compare(accessPassword, sharedPassword.accessPassword)
    console.log('Password match:', passwordMatch)
    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid access password" }, { status: 401 })
    }
  }

  if (new Date() > sharedPassword.expirationDate) {
    await prisma.sharedPassword.delete({ where: { id: uuid } })
    return NextResponse.json({ message: "Link expired" }, { status: 410 })
  }

  if (sharedPassword.usageLimit !== 0 && sharedPassword.usageCount >= sharedPassword.usageLimit) {
    await prisma.sharedPassword.delete({ where: { id: uuid } })
    return NextResponse.json({ message: "Usage limit reached" }, { status: 410 })
  }

  const decryptedPassword = CryptoJS.AES.decrypt(sharedPassword.password, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)

  await prisma.sharedPassword.update({
    where: { id: uuid },
    data: { usageCount: { increment: 1 } },
  })

  if (sharedPassword.usageLimit !== 0 && sharedPassword.usageCount + 1 >= sharedPassword.usageLimit) {
    await prisma.sharedPassword.delete({ where: { id: uuid } })
  }

  return NextResponse.json({ password: decryptedPassword })
}