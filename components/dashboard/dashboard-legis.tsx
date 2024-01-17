'use client';
import React, { JSXElementConstructor, ReactElement, useCallback, useMemo } from 'react';
import BasicBreadcrumb from '../elements/Breadcrumbs/BasicBreadcrumb';
import DragndropGrid from '../dragndrop/dragndrop-grid';
import Banner from './components/Banner';
import PropositionsBarChart from './components/charts/propositions-bar-chart';
import DeedAuthorsRanking from './components/deed-authors-ranking';
import DeedResumeTable from './components/deed-resume-table';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { saveDashboardComponentsOnLocalStorage } from '@/store/dashboardLegisConfigSlice';
import DeedReachCard from './components/deed-reach-card';
import IconSave from '@/components/icon/icon-save';

export type DashboardElement = {
    id: string;
    content: ReactElement<any, string | JSXElementConstructor<any>>;
};

export type DashboardComponentProps = {
    componentId: string;
    filters?: any;
}

export type DashboardElementNames = 'DeedAuthorsRanking' | 'DeedReachCard' | 'DeedResumeTable' | 'PropositionsBarChart';

const DashboardLegis = () => {
    const { components } = useSelector((state: IRootState) => state.dashboardLegisConfig.dashboard);
    const dispatch = useDispatch();

    const componentsMap = useMemo(() => {
        return {
            DeedAuthorsRanking: ({ componentId }: { componentId: string }) => (<DeedAuthorsRanking componentId={componentId} />),
            DeedReachCard: ({ componentId }: { componentId: string }) => (<DeedReachCard componentId={componentId} />),
            DeedResumeTable: ({ componentId }: { componentId: string }) => (<DeedResumeTable componentId={componentId} />),
            PropositionsBarChart: ({ componentId }: { componentId: string }) => (<PropositionsBarChart componentId={componentId} />),
        };
    }, []);

    const createComponentByName = useCallback(
        (componentName: DashboardElementNames, props: any) => React.createElement(componentsMap[componentName], { ...props }),
        [componentsMap]
    );

    return (
        <React.Fragment>
            <BasicBreadcrumb pathName='Legis' />
            <div className='pt-5'>
                <Banner title='Legis Panel' />
                <div className="mb-3 ml-3 flex flex-row justify-start">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => dispatch(saveDashboardComponentsOnLocalStorage(components))}
                    >
                        <IconSave className="h-4 w-4 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                        Save dashboard
                    </button>
                </div>
                <DragndropGrid elements={components.map(
                    ({ id, name, props }) => ({
                        id,
                        content: createComponentByName(name, { componentId: id, ...props })
                    })
                )} />
            </div>
        </React.Fragment>
    )
}

export default DashboardLegis;
