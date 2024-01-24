import authOptions from './authOptions';
import { isSessionExpired } from '@/middleware';
import { getServerSession } from 'next-auth/next';

export async function getSession() {
    const session = await getServerSession(authOptions);
  if (!session || isSessionExpired(session.user.expiration)) return null;
  return session;
}
