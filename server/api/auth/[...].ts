import GithubProvider from '@auth/core/providers/github'
import { NuxtAuthHandler } from '#auth'
import { prisma } from '~/lib/prisma'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    GithubProvider({
      clientId: useRuntimeConfig().githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        try {
          // search or create the user
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: user.email! },
                { 
                  provider: 'github', 
                  providerId: account.providerAccountId 
                }
              ]
            }
          })

          if (!existingUser) {
            // Créer un nouvel utilisateur
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name?.split(' ')[0] || 'User',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                avatarUrl: user.image,
                provider: 'github',
                providerId: account.providerAccountId,
              }
            })
          } else if (!existingUser.providerId) {
            // Lier le compte GitHub à un utilisateur existant
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                provider: 'github',
                providerId: account.providerAccountId,
                avatarUrl: user.image || existingUser.avatarUrl,
              }
            })
          }
          
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },

    async session({ session, token }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            avatarUrl: true
          }
        })
        
        if (dbUser) {
          session.user = {
            ...session.user,
            ...dbUser
          }
        }
      }
      return session
    }
  }
})