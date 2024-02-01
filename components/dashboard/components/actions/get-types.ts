'use server'

import { getSession } from "@/nextAuth/serverSession";

export type Type = {
    id: string;
    name: string;
    displayName: string;
}

export async function getTypes(): Promise<Type[]> {
    const session = await getSession();
    if (!session) throw new Error('Session not available');

    const { accessToken } = session.user;
    const res = await fetch(`${process.env.MENSLEGIS_API_URL}/deed-type`, { headers: { authorization: `Bearer ${accessToken}` } })
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json();
}
