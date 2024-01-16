'use server'

export type Type = {
    id: string;
    name: string;
    displayName: string;
}

export async function getTypes(): Promise<Type[]> {
    const res = await fetch('http://localhost:3000/deed-type')
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
}
