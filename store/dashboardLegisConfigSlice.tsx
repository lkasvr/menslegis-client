import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dashboardLegisConfigPreset, { DashboardComponent, DashboardLegisConfig } from './preset/dashboardLegis.config';
import { loadDashboardComponentsFromLocalStorage } from './utils/index';
import { v4 as uuidv4 } from 'uuid';
import { DashboardElementNames } from '@/components/dashboard/dashboard-legis';

const initialState: DashboardLegisConfig = {
    dashboard: {
        alerts: [],
        name: dashboardLegisConfigPreset.dashboard.name,
        maxComponents: dashboardLegisConfigPreset.dashboard.maxComponents,
        components: loadDashboardComponentsFromLocalStorage(dashboardLegisConfigPreset.dashboard.name) ?? dashboardLegisConfigPreset.dashboard.components,
    },
};

const dashboardLegisConfigSlice = createSlice({
    name: 'DashboardLegisSlice',
    initialState: initialState,
    reducers: {
        saveDashboardComponentsState(state, { payload }: PayloadAction<{ id: string, props?: any }>) {
            const componentIndex = state.dashboard.components.findIndex(component => component.id === payload.id);
            if (componentIndex !== -1)
                state.dashboard.components[componentIndex].props = payload.props;
        },
        saveDashboardComponentsOnLocalStorage(state, { payload }: PayloadAction<DashboardComponent[]>) {
            if (payload.length > 0) {
                try {
                    localStorage.setItem(`${state.dashboard.name}-components`, JSON.stringify(payload));
                    state.dashboard.alerts.push({
                        id: uuidv4(),
                        type: 'success',
                        color: 'success',
                        title: 'Dashboard saved successfully',
                        status: 'display'
                    });
                } catch (error) {
                    if (error instanceof DOMException && error.QUOTA_EXCEEDED_ERR) {
                        state.dashboard.alerts.push(
                            {
                                id: uuidv4(),
                                type: 'error',
                                color: 'danger',
                                title: 'Dashboard cannot be saved:',
                                text: 'storage quota exceeded',
                                duration: 5000,
                                status: 'display'
                            }
                        );
                        return;
                    }
                    state.dashboard.alerts.push(
                        {
                            id: uuidv4(),
                            type: 'error',
                            color: 'danger',
                            title: 'Dashboard cannot be saved:',
                            text: 'unexpected error',
                            duration: 5000,
                            status: 'display'
                        }
                    );
                }
            }
        },
        duplicateDashboardComponent(state, { payload }: PayloadAction<Omit<DashboardComponent, 'id'>>) {
            const { dashboard } = state;
            const { name, props } = payload;
            if (dashboard.components.length >= dashboard.maxComponents) {
                state.dashboard.alerts.push(
                    {
                        id: uuidv4(),
                        type: 'error',
                        color: 'danger',
                        title: `Component cannot be duplicated, maximum components supported: ${dashboard.maxComponents}`,
                        duration: 5000,
                        status: 'display'
                    }
                );
                return;
            };
            state.dashboard.components.push({ id: uuidv4(), name, props });
            state.dashboard.alerts.push(
                {
                    id: uuidv4(),
                    type: 'success',
                    color: 'success',
                    title: 'Dashboard component duplicated successfully',
                    status: 'display'
                }
            );
        },
        deleteDashboardComponent(state, { payload }: PayloadAction<{ id: string; name: DashboardElementNames; }>) {
            const { id, name } = payload;
            const currentComponents = state.dashboard.components.filter((component) => component.name === name);
            if (currentComponents.length === 1) {
                state.dashboard.alerts.push(
                    {
                        id: uuidv4(),
                        type: 'error',
                        color: 'danger',
                        title: 'Cannot delete component. You must have at least one component of this type',
                        duration: 5000,
                        status: 'display'
                    }
                );
                return;
            }

            state.dashboard.components = state.dashboard.components.filter((component) => component.id !== id);
            state.dashboard.alerts.push({ id: uuidv4(), type: 'warning', color: 'warning', title: 'Dashboard component deleted', status: 'display' });
        },
        setDisplayedDashboardAlert(state, { payload }: { payload: { id: string } }) {
            state.dashboard.alerts.forEach((alert) => {
                if (alert.id === payload.id) alert.status = 'displayed';
            });
        },
    },
});

export const {
    duplicateDashboardComponent,
    deleteDashboardComponent,
    saveDashboardComponentsOnLocalStorage,
    saveDashboardComponentsState,
    setDisplayedDashboardAlert
} = dashboardLegisConfigSlice.actions;

export default dashboardLegisConfigSlice.reducer;
