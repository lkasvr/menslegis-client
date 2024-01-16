'use client'

import Dropdown from '@/components/dropdown'
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots'
import { IRootState } from '@/store'
import React from 'react'
import { useSelector } from 'react-redux'

interface DropDownProps {
    options: {
        icon: React.ReactNode;
        text: string;
        onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
    }[];
}

const DropdownMenu = ({ options }: DropDownProps) => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    return (
        <div className="dropdown">
            <Dropdown
                offset={[0, 5]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="hover:text-primary"
                button={<IconHorizontalDots className="text-black/70 hover:!text-primary dark:text-white/70" />}
            >
                <ul>
                    {options.map(({ icon, text, onClick }) => (
                        <li key={text}>
                            <button type="button" onClick={onClick}>
                                {icon}
                                {text}
                            </button>
                        </li>
                    ))}
                </ul>
            </Dropdown>
        </div>
    )
}

export default DropdownMenu
