'use client';
import React, { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

const items4 = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 9, name: 'Item 9' },
    { id: 10, name: 'Item 10' },
    { id: 11, name: 'Item 11' },
    { id: 12, name: 'Item 12' },
];

interface DragndropGridProps {
    title?: string;
    elements: {
        id: number | string;
        content?: React.ReactNode;
    }[]
}

const DragndropGrid = ({ title, elements }: DragndropGridProps) => {
    const [gridDrag, setGridDrag] = useState(elements);

    useEffect(() => {
        setGridDrag(elements);
    }, [elements]);

    return (
        <div className="dragndrop space-y-8">
            <div className="panel">
                <div className="mb-5 text-lg font-semibold dark:text-white">{title ?? ''}</div>
                <ReactSortable
                    list={gridDrag}
                    setList={setGridDrag}
                    animation={200}
                    className="xs grid grid-cols-2 place-items-center gap-4">
                    {gridDrag.map((item) => {
                        return (
                            <div key={item.id} className='w-full h-full'>
                                {item.content ?? 'no content'}
                            </div>
                        );
                    })}
                </ReactSortable>
            </div>
        </div>
    );
};

export default DragndropGrid;
