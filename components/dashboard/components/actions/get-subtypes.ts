'use server'

import { generatedURL } from "../../../utils/tools";

export type subtypeFilters = {
    deedType?: string;
    deedTypeId?: string;
};

export type Subtype = {
    id: string;
    name: string;
    displayName: string;
}

export async function getSubtypes(filters?: subtypeFilters): Promise<Subtype[]> {
    const res = await fetch(generatedURL('http://localhost:3000/deed-subtype', filters))
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
}
