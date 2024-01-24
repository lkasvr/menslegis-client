'use server'

import { generatedURL } from '@/components/utils/tools';
import { Author } from '@/components/actions/get-authors';
import { getSession } from "@/nextAuth/serverSession";

export type DeedFilters = {
    limit?: string;
    isMostRecent?: 'true';
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
    const session = await getSession();
    if (!session) throw new Error('Session not available');

    const { accessToken } = session.user;
    const res = await fetch(generatedURL(`${process.env.MENSLEGIS_API_URL}/deed`, filters), {
        headers: { authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
}
