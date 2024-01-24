'use server'
import { getSession } from "@/nextAuth/serverSession";
import { cache } from 'react'

export type Author = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    politicalBody: {
        id: string;
        name: string;
        created_at: string;
        updated_at: string;
    }
}

export const preload = () => {
  void getAuthors()
}

export const getAuthors = cache(async (): Promise<Author[]> => {
    const session = await getSession()
    if (!session) throw new Error('Session not available');

    const { accessToken } = session.user;
    const res = await fetch(`${process.env.MENSLEGIS_API_URL}/author`, { headers: { authorization: `Bearer ${accessToken}` } })
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
})
