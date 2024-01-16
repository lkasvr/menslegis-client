'use server'
import { addMonths, differenceInMonths, format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DeedFilters, Deed, getDeeds } from "@/components/actions/get-deeds";

export type Serie = {
    name: string;
    data: number[];
}

export type ChartData = {
    period: string;
    filters?: DeedFilters,
    deeds: Deed[],
    series: Serie[],
    categories: string[];
};

export const getChartData = async (filters?: DeedFilters): Promise<ChartData> => {
    filters = {
        type: 'PROPOSICAO',
        subtype:  'MOCAO',
        initialDate: '2023-01-01',
        finalDate: '2023-12-31',
        ...filters,
    };

    if (filters.date) {
        delete filters.initialDate;
        delete filters.finalDate;
    }

    let deeds: Deed[];
    try { deeds = await getDeeds(filters) } catch (error) {
        console.error('Error fetching deeds:', error);
        throw error;
    }

    try {
        const date = parse(`${filters.date}`, 'yyyy-MM-dd', new Date());
        const initialDate = parse(`${filters.initialDate}`, 'yyyy-MM-dd', new Date());
        const finalDate = parse(`${filters.finalDate}`, 'yyyy-MM-dd', new Date());

        const chartData: ChartData = {
            period: date ? date.getFullYear().toString() : '',
            filters,
            deeds: [],
            series: [],
            categories: Array.from({ length: 12 },
                (_, i) => format(addMonths(isValid(initialDate) ? initialDate : parse('2023-01-01', 'yyyy-MM-dd', new Date()), i), 'MMM', { locale: ptBR }))
        };

        if (initialDate && finalDate && differenceInMonths(finalDate, initialDate) === 11)
            chartData.period = `${format(initialDate, 'dd/MM/yyyy')} - ${format(finalDate, 'dd/MM/yyyy')}`;

    deeds.forEach((deed) => {
        chartData.deeds?.push(deed);
        deed.authors.forEach((author) => {
            const docDate = new Date(deed.docDate);
            const authorName = author.name;
            const authorSerieIndex = chartData.series.findIndex((serie) => serie.name === authorName);
            let monthDiffPos = isValid(initialDate) ? differenceInMonths(docDate, initialDate) : docDate.getMonth();

            if (authorSerieIndex >= 0) {
                chartData.series[authorSerieIndex].data[monthDiffPos] += 1;
            } else {
                const serie: Serie = { name: authorName, data: Array(12).fill(0) };
                serie.data[monthDiffPos] += 1;
                chartData.series.push(serie);
            }
        });
    });

    return chartData;
    } catch (error) { throw new Error('Assembling chart failed') }
};
