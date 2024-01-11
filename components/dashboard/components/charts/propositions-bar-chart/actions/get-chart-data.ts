'use server'
import { addMonths, differenceInMonths, format, isAfter, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DeedFilters, Deed, getDeeds } from "../../actions/get-deeds";

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
    console.log(filters);
    if (!filters || !filters?.type) {
        filters = {
            ...filters,
            initialDate: filters?.initialDate ?? '2023-01-01',
            finalDate: filters?.finalDate ?? '2023-12-31',
            type: 'PROPOSICAO',
            subtype: 'MOCAO',
        };
    }
    console.log(filters);

    const initialDate = parse(`${filters.initialDate}`, 'yyyy-MM-dd', new Date());
    const finalDate = parse(`${filters.finalDate}`, 'yyyy-MM-dd', new Date());



    const initialYear = initialDate.getFullYear();
    const deeds = filters ? await getDeeds(filters) : await getDeeds();
    const finalYear = finalDate.getFullYear();
    const initialMonth = initialDate.getMonth();
    const finalMonth = finalDate.getMonth();
    const chartData: ChartData = {
        period: filters.date ? new Date(filters?.date).getFullYear().toString() : '',
        filters,
        deeds: [],
        series: [],
        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    };

    if (initialDate && finalDate && differenceInMonths(finalDate, initialDate) === 11) {
        const monthsPeriod = [(initialMonth + 1), (finalMonth + 1)];
        chartData.period =
            `${initialMonth > 9
                ? monthsPeriod[0]
                : '0' + monthsPeriod[0]}/${initialYear} -
                ${finalMonth > 9
                ? monthsPeriod[1]
                : '0' + monthsPeriod[1]}/${finalYear}`;
        chartData.categories = [];
        let currentDate = initialDate;
        while (isAfter(finalDate, currentDate)) {
            const monthAbb = format(currentDate, 'MMM', { locale: ptBR });
            chartData.categories.push(monthAbb.charAt(0).toUpperCase() + monthAbb.slice(1));
            currentDate = addMonths(currentDate, 1);
        }
    };

    console.log(chartData.period);
    console.log(chartData.categories);

    console.log(initialYear, finalYear);
    console.log(initialMonth, finalMonth);
    deeds.forEach((deed) => {
        chartData.deeds?.push(deed);
        deed.authors.forEach((author) => {
            const docDate = new Date(deed.docDate);
            const authorName = author.name;
            const year = docDate.getFullYear();
            const monthNumber = docDate.getMonth();
            const authorSerieIndex = chartData.series.findIndex((serie) => serie.name === authorName);

                let monthDiffPos = monthNumber;

                if (initialYear === year) monthDiffPos = initialMonth - monthNumber;

                if (finalYear === year) monthDiffPos = initialMonth + monthNumber;

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
};
