import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import appConfigPreset, { AppConfig } from "./preset/app.config";
import { v4 as uuidv4 } from 'uuid';

const initialState: AppConfig = {
    ...appConfigPreset
};

type DisplayAlert = {
    type: 'success' | 'error' | 'warning' | 'info' | 'question',
    color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info',
    title: any,
    text?: any,
    duration?: number
};

const appConfigSlice = createSlice({
    name: 'AppSlice',
    initialState: initialState,
    reducers: {
        displayAlert(state, { payload }: PayloadAction<DisplayAlert>) {
            state.alerts.push(
                {
                    id: uuidv4(),
                    status: 'display',
                    ...payload,
                    duration: payload.duration ?? 5000,
                }
            );
        },
        setDisplayedAppAlert(state, { payload }: PayloadAction<{ id: string }>) {
            state.alerts.forEach((alert) => {
                if (alert.id === payload.id) alert.status = 'displayed';
            });
        },
    },
});

export const {
    displayAlert,
    setDisplayedAppAlert
} = appConfigSlice.actions;

export default appConfigSlice.reducer;
