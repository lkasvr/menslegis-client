import { User as NextAuthUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface IUser extends JWT {
    id: string;
    picture?: string | null;
    name: string;
    email: string;
    emailVerified?: boolean;
    phoneNumber?: string | null;
    provider?: string;
}

declare module 'next-auth' {

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user: IUser;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT  {
        id: string;
        picture?: string | null;
        name: string;
        email: string;
        emailVerified?: boolean;
        phoneNumber?: string | null;
        provider?: string;
        iat: number;
        exp: number,
        jti: string,
        expiration: number;
        accessToken: string;
  }
}

