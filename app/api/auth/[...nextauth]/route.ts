import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import admin from "firebase-admin";
import { auth } from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { add, getTime } from "date-fns";

if (admin.apps.length < 1)
    admin.initializeApp({ credential: admin.credential.cert(process.env.FIREBASE_GOOGLE_APPLICATION_CREDENTIALS!) });

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    debug: false, //process.env.ENVIRONMENT !== 'production',
    session: {
        strategy: 'jwt',
        maxAge: 3 * 60 * 60,
    },
    pages: {
        signIn: '/auth/login',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.FIREBASE_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.FIREBASE_GOOGLE_CLIENT_SECRET_KEY!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'E-mail*', type: 'email' },
                password: { label: 'Senha*', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, credentials?.identifier!, credentials?.password!);
                    const user = userCredential.user;
                    const email = user.email;
                    const name = (!user.displayName && email) ? email.slice(0, email.indexOf('@')) : user.displayName;
                    return {
                        id: user.uid,
                        picture: user.photoURL,
                        name,
                        email,
                        emailVerified: user.emailVerified,
                        phoneNumber: user.phoneNumber,
                    };
                } catch (error) {
                    console.error('Error during authorization:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ account, user }) {
            // TODO: implementar tratamento de erros
            if (account?.provider === 'credentials') return true;

            if (account?.provider === 'google') {
                const userRecord = await admin.auth().getUserByEmail(user.email!);
                return !userRecord?.disabled;
            }
            return false;
        },
        async jwt({ trigger, user, account, token }) {
            // TODO: implementar tratamento de erros

            if (trigger === 'signIn' && user) {
                const tokenExpirationTimestamp = getTime(add(new Date(), { hours: 3 }));


                if (account?.provider === "credentials") token = { ...user } as any;

                if (account?.provider === "google") {
                    const userRecord = await admin.auth().getUserByEmail(user.email!);
                    token.id = userRecord.uid;
                    token.phoneNumber = userRecord.phoneNumber;
                    token.emailVerified = userRecord.emailVerified
                }
                token.provider = account?.provider;
                token.expiration = tokenExpirationTimestamp;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        }
    }
})

export { handler as GET, handler as POST }
