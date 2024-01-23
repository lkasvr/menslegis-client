'use server'
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

export const getAuthors = cache(async ():Promise<Author[]> => {
    const res = await fetch(`${process.env.MENSLEGIS_API_URL}/author`)
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
})
