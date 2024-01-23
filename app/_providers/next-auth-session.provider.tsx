'use client';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import React from 'react'

const NextAuthSessionProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default NextAuthSessionProvider
