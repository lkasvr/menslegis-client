'use server'
import { cache } from 'react'
import { Deed } from '../../actions/get-deeds';
import { generatedURL } from '../../../../utils/tools';

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
    const res = await fetch(generatedURL('http://localhost:3000/author', { ...filters, withDeeds: 'true' }))
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
})
