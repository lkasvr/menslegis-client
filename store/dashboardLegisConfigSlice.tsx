import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dashboardLegisConfig, { DashboardComponent, DashboardLegisConfig } from './preset/dashboardLegis.config';
import { loadDashboardComponentsFromLocalStorage } from './utils/index';
import { v4 as uuidv4 } from 'uuid';

const initialState: DashboardLegisConfig = {
    dashboard: {
        name: dashboardLegisConfig.dashboard.name,
        maxComponents: dashboardLegisConfig.dashboard.maxComponents,
        components: loadDashboardComponentsFromLocalStorage(dashboardLegisConfig.dashboard.name) ?? dashboardLegisConfig.dashboard.components,
    },
};

const dashboardLegisConfigSlice = createSlice({
    name: 'dashboardLegis',
    initialState: initialState,
    reducers: {
        saveDashboardComponentsState(state, { payload }: PayloadAction<{ id: string, props?: any }>) {
            const componentIndex = state.dashboard.components.findIndex(component => component.id === payload.id);
            if (componentIndex !== -1)
                state.dashboard.components[componentIndex].props = payload.props;
        },
        saveDashboardComponentsOnLocalStorage(state, { payload }: PayloadAction<DashboardComponent[]>) {
            if (payload.length > 0)
                localStorage.setItem(`${state.dashboard.name}-components`, JSON.stringify(payload));
        },
        duplicateDashboardComponent(state, { payload }: PayloadAction<Omit<DashboardComponent, 'id'>>) {
            const { dashboard } = state;
            if (dashboard.components.length >= dashboard.maxComponents) return;
            const { name, props } = payload;
            state.dashboard.components.push({ id: uuidv4(), name, props });
        },
        deleteDashboardComponent(state, { payload }: PayloadAction<{ id: string }>) {
            const { id } = payload;
            state.dashboard.components = state.dashboard.components.filter((component) => component.id !== id);
        }
    },
});

export const {
    duplicateDashboardComponent,
    deleteDashboardComponent,
    saveDashboardComponentsOnLocalStorage,
    saveDashboardComponentsState
} = dashboardLegisConfigSlice.actions;

export default dashboardLegisConfigSlice.reducer;
