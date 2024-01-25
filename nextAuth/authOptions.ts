import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import admin from "firebase-admin";
import { auth } from "@/services/firebase/service";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { add, getTime } from "date-fns";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_GOOGLE_APPLICATION_CREDENTIALS as string
);

if (admin.apps.length < 1)
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.ENVIRONMENT !== 'production',
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

            try {
                if (account?.provider === 'google') {
                const userRecord = await admin.auth().getUserByEmail(user.email!);
                    return !userRecord?.disabled;
                }
            } catch (error) {
                return false;
            }
            return false;
        },
        async jwt({ trigger, user, account, token }) {
            // TODO: implementar tratamento de erros
            if (trigger === 'signIn' && user) {
                try {
                    const tokenExpirationTimestamp = getTime(add(new Date(), { hours: 2 }));
                    let authTokenId;

                    if (account?.provider === "credentials") {
                        token = { ...user } as any;
                        authTokenId = await auth.currentUser?.getIdToken();
                    }

                    if (account?.provider === "google") {
                        const { user: userRecord } = await signInWithCredential(
                            auth,
                            GoogleAuthProvider.credential(
                                account.id_token,
                                account.access_token
                            )
                        );
                        authTokenId = await userRecord.getIdToken();
                        token.id = userRecord.uid;
                        token.phoneNumber = userRecord.phoneNumber;
                        token.emailVerified = userRecord.emailVerified
                    }
                    const response = await fetch(`${process.env.MENSLEGIS_API_URL}/auth/api-service`, {
                        method: 'POST',
                        headers: { authorization: `Bearer ${authTokenId}` },
                        cache: 'no-cache'
                    });
                    const { access_token }: { access_token: string } = await response.json();

                    token.accessToken = access_token;
                    token.provider = account?.provider;
                    token.expiration = tokenExpirationTimestamp;
                    return token;
                } catch (error) {
                    signOut(auth);
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        }
    }
};

export default authOptions;
