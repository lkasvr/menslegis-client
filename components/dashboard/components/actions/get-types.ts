'use server'

export type Type = {
    id: string;
    name: string;
    displayName: string;
}

export async function getTypes(): Promise<Type[]> {
    const res = await fetch(`${process.env.MENSLEGIS_API_URL}/deed-type`)
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
}
