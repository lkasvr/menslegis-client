'use client';
import React, { JSXElementConstructor, ReactElement, useCallback, useEffect, useMemo } from 'react';
import BasicBreadcrumb from '../elements/Breadcrumbs/BasicBreadcrumb';
import DragndropGrid from '../dragndrop/dragndrop-grid';
import Banner from './components/Banner';
import PropositionsBarChart from './components/charts/propositions-bar-chart';
import DeedAuthorsRanking from './components/deed-authors-ranking';
import DeedResumeTable from './components/deed-resume-table';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { saveDashboardComponentsOnLocalStorage, setDisplayedDashboardAlert } from '@/store/dashboardLegisConfigSlice';
import DeedReachCard from './components/deed-reach-card';
import IconSave from '@/components/icon/icon-save';
import Swal from 'sweetalert2';

export type DashboardElement = {
    id: string;
    content: ReactElement<any, string | JSXElementConstructor<any>>;
};

type toastParams = {
    type: 'success' | 'error' | 'warning' | 'info' | 'question',
    color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info',
    title: any,
    text?: any,
    duration?: number
};

export interface DashboardComponentProps {
    componentId: string;
    triggerToast: (params: toastParams) => void;
    filters?: any;
}

export type DashboardElementNames = 'DeedAuthorsRanking' | 'DeedReachCard' | 'DeedResumeTable' | 'PropositionsBarChart';

const DashboardLegis = () => {
    const dispatch = useDispatch();
    const { components, alerts } = useSelector((state: IRootState) => state.dashboardLegisConfig.dashboard);

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

    const componentsMap = useMemo(() => {
        return {
            DeedAuthorsRanking: (props: DashboardComponentProps) => (<DeedAuthorsRanking {...props} />),
            DeedReachCard: (props: DashboardComponentProps) => (<DeedReachCard {...props} />),
            DeedResumeTable: (props: DashboardComponentProps) => (<DeedResumeTable {...props} />),
            PropositionsBarChart: (props: DashboardComponentProps) => (<PropositionsBarChart {...props} />),
        };
    }, []);

    const createComponentByName = useCallback(
        (componentName: DashboardElementNames, props: any) => React.createElement(componentsMap[componentName], { ...props }),
        [componentsMap]
    );

    const showAlerts = useCallback(() => {
        alerts.forEach(alert => {
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
                dispatch(setDisplayedDashboardAlert({ id: alert.id }));
            }
        })
    }, [alerts, dispatch, triggerToast])
    useEffect(() => showAlerts(), [showAlerts]);

    return (
        <React.Fragment>
            <BasicBreadcrumb pathName='Legis' />
            <div className='pt-5'>
                <Banner title='Legis Panel' />
                <div className="mb-3 ml-3 flex flex-row justify-start">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            dispatch(saveDashboardComponentsOnLocalStorage(components));
                            triggerToast({ type: 'success', color: 'success', title: 'Dashboard saved successfully' })
                        }}
                    >
                        <IconSave className="h-4 w-4 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                        Save dashboard
                    </button>
                </div>
                <DragndropGrid
                    elements={components.map(
                        ({ id, name, props }) => ({
                            id,
                            content: createComponentByName(name, { componentId: id, triggerToast, ...props })
                        })
                    )} />
            </div>
        </React.Fragment>
    )
}

export default DashboardLegis;
