import PropositionList from '@/components/apps/propositions';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Propositions',
};

const Notes = () => {
    return <PropositionList />;
};

export default Notes;
