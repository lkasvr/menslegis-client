export type Alert = {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'question',
    color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info',
    title: any,
    text?: any,
    duration?: number
    status: 'display' | 'displayed';
};

export interface AppConfig {
    alerts: Alert[];
}

const appConfigPreset: AppConfig = {
    alerts: []
};

export default appConfigPreset;
