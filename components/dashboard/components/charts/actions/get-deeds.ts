'use server'

import { Author } from "./get-authors";

export type DeedFilters = {
    limit?: string;
    isMostRecent?: string;
    year?: string;
    date?: string;
    initialDate?: string;
    finalDate?: string;
    type?: string;
    subtype?: string;
    authorsIds?: string;
};

export type Deed = {
    id: string;
    name: string;
    description?: string;
    status?: string;
    pageDocLink?: string;
    docLink?: string;
    docDate: string;
    created_at: string;
    updated_at: string;
    authors: Author[];
    deedType: { id: string; name: string; displayName: string; };
    deedSubtype: { id: string; name: string; displayName: string; };
}

export async function getDeeds(filters?: DeedFilters): Promise<Deed[]> {
    const res = await fetch(generatedURL('http://localhost:3000/deed', filters));
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
}

function generatedURL(baseUrl: string, filters?: DeedFilters) {
    let path: string = '?';
    if (!filters) return baseUrl;
    const params = Object.entries(filters);
    params.forEach(([key, value], i) => value && (path += `${i === 0 ? '' : '&'}${key}=${value}`));
    return baseUrl + path;
}
