import { DashboardElementNames } from '@/components/dashboard/dashboard-legis';
import { v4 as uuidv4 } from 'uuid';

export type DashboardComponent = {
    id: string;
    name: DashboardElementNames;
    props?: any
};

export type DashboardAlerts = {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'question',
    color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info',
    title: any,
    text?: any,
    duration?: number
    status: 'display' | 'displayed';
};

export interface DashboardLegisConfig {
    dashboard: {
        alerts: DashboardAlerts[];
        name: 'dashboard-legis',
        maxComponents: number;
        components: DashboardComponent[];
    }
}

const dashboardLegisConfig: DashboardLegisConfig = {
    dashboard: {
        alerts: [],
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
