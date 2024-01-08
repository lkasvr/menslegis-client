import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import QueryClientProvider from './providers/query-client-provider';

export const metadata: Metadata = {
    title: {
        template: '%s | MENSLEGIS - O real espírito das leis',
        default: 'MENSLEGIS - O real espírito das leis',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={nunito.variable}>
                <QueryClientProvider>
                    <ProviderComponent>{children}</ProviderComponent>
                </QueryClientProvider>
            </body>
        </html>
    );
}
