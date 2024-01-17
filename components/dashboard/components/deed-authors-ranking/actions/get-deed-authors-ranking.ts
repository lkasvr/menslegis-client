'use server'

import { format, parse, subMonths } from "date-fns";
import { AuthorWithDeeds, AuthorWithDeedsFilters, getAuthorsWithDeeds } from "./get-authors-with-deeds";

export const getAuthorsRankingByDeed = async (filters?: AuthorWithDeedsFilters): Promise<{
    filters: AuthorWithDeedsFilters,
    data: AuthorWithDeeds[],
    period: string
}> => {
    filters = {
        deedTypeId: '54884db0-2303-4764-8dc8-2b227d7e7a85',
        deedSubtypeId: '75b9b41b-8bc6-4912-8ef0-bbd14b7abc35',
        initialDate: format(subMonths(new Date(), 12), 'yyyy-MM-dd'),
        finalDate: format(new Date(), 'yyyy-MM-dd'),
        ...filters,
    };

    let authors: AuthorWithDeeds[];
    try { authors = await getAuthorsWithDeeds(filters) } catch (error) {
        console.error('Error fetching deeds:', error);
        throw error;
    }

    const initialDate = parse(`${filters.initialDate}`, 'yyyy-MM-dd', new Date());
    const finalDate = parse(`${filters.finalDate}`, 'yyyy-MM-dd', new Date());

    const data = authors.toSorted((authorA, authorB) =>  authorB.deeds.length - authorA.deeds.length);

    return {
        filters,
        data,
        period: (initialDate && finalDate) ? `${format(initialDate, 'dd/MM/yyyy')} - ${format(finalDate, 'dd/MM/yyyy')}` : ''
    }
}
