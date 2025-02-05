import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import CryptoJS from "crypto-js"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key"

export async function POST(request: Request) {
  const { password, expirationDate, usageLimit, accessPassword } = await request.json()

  const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString()

  // Only hash access password if it exists
  const hashedAccessPassword = accessPassword ? await bcrypt.hash(accessPassword, 10) : ""

  const sharedPassword = await prisma.sharedPassword.create({
    data: {
      password: encryptedPassword,
      expirationDate: new Date(expirationDate),
      usageLimit,
      accessPassword: hashedAccessPassword,
    },
  })

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${sharedPassword.id}`

  return NextResponse.json({
    url,
  })
}