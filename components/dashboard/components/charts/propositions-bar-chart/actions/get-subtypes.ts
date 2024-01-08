'use server'

export type Subtype = {
    id: string;
    name: string;
    displayName: string;
}

export async function getSubtypes(): Promise<Subtype[]> {
    const res = await fetch('http://localhost:3000/deed-subtype')
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
}
