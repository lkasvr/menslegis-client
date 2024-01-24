'use server'
import { cache } from 'react'
import { Deed } from '@/components/actions/get-deeds';
import { generatedURL } from '../../../../utils/tools';
import { getSession } from '@/nextAuth/serverSession';

export type AuthorWithDeedsFilters = {
    limit?: string;
    initialDate?: string;
    finalDate?: string;
    deedTypeId?: string;
    deedSubtypeId?: string;
    authorsIds?: string;
};

export interface AuthorWithDeeds {
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
    deeds: Deed[]
}

export const preload = () => {
  void getAuthorsWithDeeds({ deedTypeId: 'PROPOSICAO' })
}

export const getAuthorsWithDeeds = cache(async (filters: AuthorWithDeedsFilters): Promise<AuthorWithDeeds[]> => {
    const session = await getSession();
    if (!session) throw new Error('Session not available');

    const { accessToken } = session.user;
    const res = await fetch(
        generatedURL(`${process.env.MENSLEGIS_API_URL}/author`, { ...filters, withDeeds: 'true' }),
        { headers: { authorization: `Bearer ${accessToken}` } }
    )
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
});
