import { DashboardElementNames } from '@/components/dashboard/dashboard-legis';
import { v4 as uuidv4 } from 'uuid';

export type DashboardComponent = {
    id: string;
    name: DashboardElementNames;
    props?: any
};

export interface DashboardLegisConfig {
    dashboard: {
        name: 'dashboard-legis',
        maxComponents: number;
        components: DashboardComponent[];
    }
}

const dashboardLegisConfig: DashboardLegisConfig = {
    dashboard: {
        name: 'dashboard-legis',
        maxComponents: 10,
        components: [
            {
                id: uuidv4(),
                name: 'DeedReachCard',
            },
            {
                id: uuidv4(),
                name: 'DeedReachCard',
            },
            {
                id: uuidv4(),
                name: 'DeedAuthorsRanking',
            },
            {
                id: uuidv4(),
                name: 'PropositionsBarChart',
            },
            {
                id: uuidv4(),
                name: 'DeedResumeTable',
                props: ''
            },
        ]
    }
};

export default dashboardLegisConfig;
