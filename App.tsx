'use client';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { toggleRTL, toggleTheme, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from '@/store/themeConfigSlice';
import Loading from '@/components/layouts/loading';
import { getTranslation } from '@/i18n';
import Swal from 'sweetalert2';
import { setDisplayedAppAlert } from './store/appConfigSlice';

export type toastParams = {
    type: 'success' | 'error' | 'warning' | 'info' | 'question',
    color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info',
    title: any,
    text?: any,
    duration?: number
};

function App({ children }: PropsWithChildren) {
    const appconfig = useSelector((state: IRootState) => state.appConfig);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();
    const { initLocale } = getTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
        // locale
        initLocale(themeConfig.locale);

        setIsLoading(false);
    },
        [
            dispatch,
            initLocale,
            themeConfig.theme,
            themeConfig.menu,
            themeConfig.layout,
            themeConfig.rtlClass,
            themeConfig.animation,
            themeConfig.navbar,
            themeConfig.locale,
            themeConfig.semidark
        ]);

    const triggerToast = useCallback(({ type, color, title, text, duration }: toastParams) => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: duration ?? 3000,
            showCloseButton: true,
            customClass: {
                container: 'toast',
                popup: `color-${color}`,
            },
        });
        toast.fire({
            icon: type,
            title,
            text,
            padding: '10px 20px',
        });
    }, []);

    const showAlerts = useCallback(() => {
        appconfig.alerts.forEach(alert => {
            if (alert.status !== 'displayed') {
                triggerToast(
                    {
                        type: alert.type,
                        color: alert.color,
                        title: alert.title,
                        text: alert.text,
                        duration: alert.duration
                    }
                );
                dispatch(setDisplayedAppAlert({ id: alert.id }));
            }
        })
    }, [appconfig.alerts, dispatch, triggerToast])
    useEffect(() => showAlerts(), [showAlerts]);

    return (
        <div
            className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${themeConfig.rtlClass
                } main-section relative font-nunito text-sm font-normal antialiased`}
        >
            {isLoading ? <Loading /> : children}
        </div>
    );
}

export default App;
