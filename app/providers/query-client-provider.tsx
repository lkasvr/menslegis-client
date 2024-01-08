'use client'
import { QueryClient, QueryClientProvider as QueryClientWrapper } from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <QueryClientWrapper client={queryClient}>
            {children}
        </QueryClientWrapper>
    )
}

export default QueryClientProvider
