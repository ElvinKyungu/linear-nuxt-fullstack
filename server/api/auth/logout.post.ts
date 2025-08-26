// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-token')
  return { success: true }
})
