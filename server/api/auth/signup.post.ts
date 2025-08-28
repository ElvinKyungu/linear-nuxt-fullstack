// server/api/auth/signup.post.ts
import { users } from '@/data/users'
import { SignJWT } from 'jose'

const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

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

  // Créer le token JWT avec jose
  const token = await new SignJWT({ userId: newUser.id, email: newUser.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET))

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
