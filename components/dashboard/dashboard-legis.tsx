import React from 'react'
import BasicBreadcrumb from '../elements/Breadcrumbs/BasicBreadcrumb';
import DragndropGrid from '../dragndrop/dragndrop-grid';
import Banner from './components/Banner';
import PropositionsBarChart from './components/charts/propositions-bar-chart';
import ResumePropositionsTable from './components/resume-propositions-table';

const DashboardLegis = () => {

    return (
        <React.Fragment>
            <BasicBreadcrumb pathName='Legis' />
            <div className='pt-5'>
                <Banner title='Legis Panel' />
                <DragndropGrid elements={[
                    {
                        id: 1,
                        content: <PropositionsBarChart />
                    },
                    {
                        id: 2,
                        content: <ResumePropositionsTable />
                    }
                ]} />
            </div>
        </React.Fragment>
    )
}

export default DashboardLegis;
