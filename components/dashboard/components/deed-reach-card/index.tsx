import React, { useCallback, useEffect } from 'react';
import IconClock from '@/components/icon/icon-clock';
import IconSquareCheck from '@/components/icon/icon-square-check';
import { DashboardComponentProps, DashboardElementNames } from '../../dashboard-legis';
import DropdownMenu from '../elements/dropdown-menu';
import IconTrash from '@/components/icon/icon-trash';
import IconCopy from '@/components/icon/icon-copy';
import IconXCircle from '@/components/icon/icon-x-circle';
import IconSettings from '@/components/icon/icon-settings';
import { useDispatch } from 'react-redux';
import { deleteDashboardComponent, duplicateDashboardComponent, saveDashboardComponentsState } from '@/store/dashboardLegisConfigSlice';

interface DeedReachCardProps extends DashboardComponentProps { }

const DeedReachCard = ({ componentId, filters }: DeedReachCardProps) => {
    const componentName: DashboardElementNames = 'DeedReachCard';
    const dispatch = useDispatch();

    const saveDashboardComponent = useCallback(() => {
        dispatch(
            saveDashboardComponentsState({
                id: componentId,
                props: { filters }
            })
        );
    }, [dispatch, componentId, filters]);
    useEffect(() => saveDashboardComponent(), [saveDashboardComponent]);

    return (
        <div className="flex flex-row flex-nowrap w-full">
            <div className="panel h-full">
                <div className="-m-5 mb-5 flex items-center justify-between border-b border-white-light p-5 dark:border-[#1b2e4b]">
                    <button type="button" className="flex font-semibold">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-white ltr:mr-4 rtl:ml-4">
                            <span>FD</span>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h6>Figma Design</h6>
                            <p className="mt-1 text-xs text-white-dark">Design Reset</p>
                        </div>
                    </button>

                    <div className="dropdown">
                        <DropdownMenu
                            options={
                                [
                                    {
                                        icon: <IconTrash className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Delete',
                                        onClick: () => dispatch(deleteDashboardComponent({ id: componentId, name: componentName }))
                                    },
                                    {
                                        icon: <IconCopy className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Duplicate',
                                        onClick: () => dispatch(duplicateDashboardComponent({ name: componentName, props: { filters } }))
                                    },
                                    {
                                        icon: <IconXCircle className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Reset',
                                        onClick: () => { } // handleResetDeedResumeTable()
                                    },
                                    {
                                        icon: <IconSettings className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Settings',
                                        onClick: () => { } // setShowModal(true)
                                    }
                                ]
                            }
                        />
                    </div>
                </div>
                <div className="group">
                    <div className="mb-5 text-white-dark">Doloribus nisi vel suscipit modi, optio ex repudiandae voluptatibus officiis commodi. Nesciunt quas aut neque incidunt!</div>
                    <div className="mb-2 flex items-center justify-between font-semibold">
                        <div className="flex items-center">
                            <IconSquareCheck className="h-4 w-4 text-success" />
                            <div className="text-xs ltr:ml-2 rtl:mr-2">5 Tasks</div>
                        </div>
                        <p className="text-primary">65%</p>
                    </div>
                    <div className="mb-5 h-2.5 rounded-full bg-dark-light p-0.5 dark:bg-dark-light/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#1e9afe] to-[#60dfcd]" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex items-center rounded-full bg-danger/20 px-2 py-1 text-xs font-semibold text-danger">
                            <IconClock className="h-3 w-3 ltr:mr-1 rtl:ml-1" />3 Days Left
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel h-1/2">
                <div className="-m-5 mb-5 flex items-center justify-between border-b border-white-light p-5 dark:border-[#1b2e4b]">
                    <button type="button" className="flex font-semibold">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-white ltr:mr-4 rtl:ml-4">
                            <span>FD</span>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h6>Figma Design</h6>
                            <p className="mt-1 text-xs text-white-dark">Design Reset</p>
                        </div>
                    </button>

                    <div className="dropdown">
                        <DropdownMenu
                            options={
                                [
                                    {
                                        icon: <IconTrash className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Delete',
                                        onClick: () => dispatch(deleteDashboardComponent({ id: componentId, name: componentName }))
                                    },
                                    {
                                        icon: <IconCopy className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Duplicate',
                                        onClick: () => dispatch(duplicateDashboardComponent({ name: componentName, props: { filters } }))
                                    },
                                    {
                                        icon: <IconXCircle className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Reset',
                                        onClick: () => { } // handleResetDeedResumeTable()
                                    },
                                    {
                                        icon: <IconSettings className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Settings',
                                        onClick: () => { } // setShowModal(true)
                                    }
                                ]
                            }
                        />
                    </div>
                </div>
                <div className="group">
                    <div className="mb-5 text-white-dark">Doloribus nisi vel suscipit modi, optio ex repudiandae voluptatibus officiis commodi. Nesciunt quas aut neque incidunt!</div>
                    <div className="mb-2 flex items-center justify-between font-semibold">
                        <div className="flex items-center">
                            <IconSquareCheck className="h-4 w-4 text-success" />
                            <div className="text-xs ltr:ml-2 rtl:mr-2">5 Tasks</div>
                        </div>
                        <p className="text-primary">65%</p>
                    </div>
                    <div className="mb-5 h-2.5 rounded-full bg-dark-light p-0.5 dark:bg-dark-light/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#1e9afe] to-[#60dfcd]" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex items-center rounded-full bg-danger/20 px-2 py-1 text-xs font-semibold text-danger">
                            <IconClock className="h-3 w-3 ltr:mr-1 rtl:ml-1" />3 Days Left
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeedReachCard;
