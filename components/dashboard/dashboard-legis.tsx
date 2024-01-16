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
import { deleteDashboardComponent, duplicateDashboardComponent } from '@/store/dashboardLegisConfigSlice';
import { v4 as uuidv4 } from 'uuid';
import DeedReachCard from './components/deed-reach-card';

export type DashboardElement = {
    id: string;
    content: ReactElement<any, string | JSXElementConstructor<any>>;
};

export type DashboardComponentProps = {
    id: string;
    duplicateComponent: (name: DashboardElementNames, props?: any) => void;
    deleteComponent: (id: string) => void;
    filters?: any;
}

export type DashboardElementNames = 'DeedAuthorsRanking' | 'DeedReachCard' | 'DeedResumeTable' | 'PropositionsBarChart';

const DashboardLegis = () => {
    const { components } = useSelector((state: IRootState) => state.dashboardLegisConfig.dashboard);
    const dispatch = useDispatch();

    const componentsMap = useMemo(() => {
        return {
            DeedAuthorsRanking: ({ id, duplicateComponent, deleteComponent }: DashboardComponentProps) => (
                <DeedAuthorsRanking id={id} duplicateComponent={duplicateComponent} deleteComponent={deleteComponent} />
            ),
            DeedReachCard: ({ id, duplicateComponent, deleteComponent }: DashboardComponentProps) => (
                <DeedReachCard id={id} duplicateComponent={duplicateComponent} deleteComponent={deleteComponent} />
            ),
            DeedResumeTable: ({ id, duplicateComponent, deleteComponent }: DashboardComponentProps) => (
                <DeedResumeTable id={id} duplicateComponent={duplicateComponent} deleteComponent={deleteComponent} />
            ),
            PropositionsBarChart: ({ id, duplicateComponent, deleteComponent }: DashboardComponentProps) => (
                <PropositionsBarChart id={id} duplicateComponent={duplicateComponent} deleteComponent={deleteComponent} />
            ),
        };
    }, []);

    const createComponentByName = useCallback(
        (componentName: DashboardElementNames, props: any) => React.createElement(componentsMap[componentName], props),
        [componentsMap]
    );

    function duplicateComponent(name: DashboardElementNames, props?: any) {
        dispatch(duplicateDashboardComponent({ id: uuidv4(), name, props }));
    }

    function deleteComponent(id: string) {
        dispatch(deleteDashboardComponent({ id }))
    }

    return (
        <React.Fragment>
            <BasicBreadcrumb pathName='Legis' />
            <div className='pt-5'>
                <Banner title='Legis Panel' />
                <DragndropGrid elements={components.map(
                    ({ id, name, props }) => ({
                        id,
                        content: createComponentByName(name, { id, duplicateComponent, deleteComponent, ...props })
                    })
                )} />
            </div>
        </React.Fragment>
    )
}

export default DashboardLegis;
