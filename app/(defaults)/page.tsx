import DashboardLegis from '@/components/dashboard/dashboard-legis';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Legis',
};

const Legis = () => {
    return <DashboardLegis />;
};

export default Legis;
