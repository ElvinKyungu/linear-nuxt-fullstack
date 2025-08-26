// server/api/auth/signup.post.ts
import { users } from '~/data/users'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

export default defineEventHandler(async (event) => {
  const { email, password, name, lastName } = await readBody(event)

  // Validation basique
  if (!email || !password || !name || !lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tous les champs sont requis',
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le mot de passe doit contenir au moins 6 caractères',
    })
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cet email est déjà utilisé',
    })
  }

  // Hasher le mot de passe (en production)
  // const hashedPassword = await bcrypt.hash(password, 12)

  // Créer le nouvel utilisateur
  const newUser = {
    id: crypto.randomUUID(),
    name,
    lastName,
    email,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name + ' ' + lastName)}&background=6366f1&color=ffffff`,
    createdAt: new Date(),
  }

  // Ajouter à notre "base de données" en mémoire
  users.push(newUser)

  // Créer le token JWT
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Définir le cookie
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  })

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
    },
  }
})
