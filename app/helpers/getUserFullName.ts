// helpers/getUserFullName.ts
export function getUserFullName(users: User[], userId: string): string {
  const user = users.find(u => u.id === userId);
  if (!user) return '';
  return `${user.name?.toLowerCase()}.${user.lastName?.toLowerCase()}`;
}
