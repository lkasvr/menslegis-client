import Link from 'next/link';
import React from 'react'

const BasicBreadcrumb = ({ pathName }: { pathName?: string }) => {
    return (
        <ul className="flex space-x-2 rtl:space-x-reverse">
            <li>
                <Link href="/" className="text-primary hover:underline">
                    Dashboard
                </Link>
            </li>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>{pathName ?? ''}</span>
            </li>
        </ul>
    )
}

export default BasicBreadcrumb;
