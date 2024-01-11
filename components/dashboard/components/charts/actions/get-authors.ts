'use server'
import { cache } from 'react'

export interface Author {
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

// export async function getAuthors(): Promise<Author> {}

export const getAuthors = cache(async ():Promise<Author[]> => {
    const res = await fetch('http://localhost:3000/author')
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
})
