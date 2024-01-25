import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import dashboardLegisConfigSlice from './dashboardLegisConfigSlice';
import appConfigSlice from './appConfigSlice';

const rootReducer = combineReducers({
    appConfig: appConfigSlice,
    themeConfig: themeConfigSlice,
    dashboardLegisConfig: dashboardLegisConfigSlice,
});

export default configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
