import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dashboardLegisConfig, { DashboardComponent, DashboardLegisConfig } from './preset/dashboardLegis.config';
import { v4 as uuidv4 } from 'uuid';
import { DashboardElementNames } from '@/components/dashboard/dashboard-legis';

const initialState: DashboardLegisConfig = {
    dashboard: {
        components: dashboardLegisConfig.dashboard.components,
    },
};

const dashboardLegisConfigSlice = createSlice({
    name: 'dashboardLegis',
    initialState: initialState,
    reducers: {
        duplicateDashboardComponent(state, { payload }: PayloadAction<DashboardComponent>) {
            console.log('payload', payload);
            const { id, name, props } = payload;
            state.dashboard.components.push({ id, name, props });
        },
        deleteDashboardComponent(state, { payload }: PayloadAction<{ id: string }>) {
            const { id } = payload;
            state.dashboard.components = state.dashboard.components.filter((component) => component.id !== id);
        }
    },
});

export const { duplicateDashboardComponent, deleteDashboardComponent } = dashboardLegisConfigSlice.actions;

export default dashboardLegisConfigSlice.reducer;
