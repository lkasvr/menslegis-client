import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import dashboardLegisConfigSlice from './dashboardLegisConfigSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    dashboardLegisConfig: dashboardLegisConfigSlice,
});

export default configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;
