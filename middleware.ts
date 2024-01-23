import { isAfter } from 'date-fns';
import { withAuth } from 'next-auth/middleware';

export function isSessionExpired(expiration: number): boolean {
  return isAfter(new Date(), expiration);
}

export default withAuth({
    secret: `${process.env.NEXTAUTH_SECRET}`,
    pages: {
        signIn: '/auth/login'
    },
    callbacks: {
        authorized({ token, req }) {
            if (!token || isSessionExpired(token.expiration)) return false;
            return !!token;
        },
    },
});

export const config = { matcher: ['/', '/apps', '/pages'] };
