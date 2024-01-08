'use server'
import { DeedFilters, Deed, getDeeds } from "./get-deeds";

export type Serie = {
    name: string;
    data: number[];
}

export type ChartData = { deeds: Deed[], series: Serie[] };

export const getChartData = async (filters?: DeedFilters) => {
    const deeds = filters ? await getDeeds(filters) : await getDeeds();
    const chartData: ChartData = { deeds: [], series: [] };

    deeds.forEach((deed) => {
        chartData.deeds?.push(deed);
        const authors = deed.authors;

        authors.forEach((author) => {
            const authorName = author.name;
            const monthNumber = new Date(deed.docDate).getMonth();
            const authorSerieIndex = chartData.series.findIndex((serie) => serie.name === authorName);

            if (authorSerieIndex >= 0) {
                chartData.series[authorSerieIndex].data[monthNumber] += 1;
            } else {
                const serie: Serie = { name: authorName, data: Array(12).fill(0) };
                serie.data[monthNumber] += 1;
                chartData.series.push(serie);
            }
        });
    });

    return chartData;
};
