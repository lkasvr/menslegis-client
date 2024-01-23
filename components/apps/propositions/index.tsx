'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '@/components/dropdown';
import IconEye from '@/components/icon/icon-eye';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconMenu from '@/components/icon/icon-menu';
import IconNotes from '@/components/icon/icon-notes';
import IconNotesEdit from '@/components/icon/icon-notes-edit';
import IconSquareRotated from '@/components/icon/icon-square-rotated';
import IconStar from '@/components/icon/icon-star';
import IconFile from '@/components/icon/icon-txt-file';
import IconX from '@/components/icon/icon-x';
import { IRootState } from '@/store';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Deed, getDeeds } from '@/components/actions/get-deeds';
import { format } from 'date-fns';

interface IDeed extends Deed {
    isFav?: boolean;
}

const PropositionList = () => {
    const defaultParams = {
        id: null,
        description: '',
        status: ''
    };
    const [params, setParams] = useState<IDeed>(JSON.parse(JSON.stringify(defaultParams)));
    const [isShowDeedMenu, setIsShowDeedMenu] = useState<any>(false);
    const [isViewDeedModal, setIsViewDeedModal] = useState<any>(false);

    const [deeds, setDeeds] = useState<IDeed[]>([]);
    const [filteredDeedsList, setFilteredDeedsList] = useState<IDeed[]>([]);
    const [statusList, setStatusList] = useState<string[]>([]);
    const [selectedTab, setSelectedTab] = useState<any>('all');

    const searchDeeds = () => {
        if (selectedTab !== 'fav') {
            if (selectedTab !== 'all') {
                setFilteredDeedsList(deeds.filter((d) => d.status === selectedTab));
            } else {
                setFilteredDeedsList(deeds);
            }
        } else {
            setFilteredDeedsList(deeds.filter((d) => d.isFav));
        }
    };

    const tabChanged = (type: string) => {
        setSelectedTab(type);
        setIsShowDeedMenu(false);
        searchDeeds();
    };

    const setFav = (deed: IDeed) => {
        let list = filteredDeedsList;
        let item = list.find((d) => d.id === deed.id);
        if (item) item.isFav = !item.isFav;

        setFilteredDeedsList([...list]);
        if (selectedTab !== 'all') searchDeeds();
        showMessage('This is a on developement feature, just does not work as expected', 'warning', 5000)
    };

    const viewDeed = (deed: IDeed) => {
        setParams(deed);
        setIsViewDeedModal(true);
    };

    const showMessage = (msg = '', type = 'success', duration = 3000) => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: duration,
            customClass: { container: 'toast', popup: `color-${type}`, },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        searchDeeds();
    }, [deeds, selectedTab]);

    useEffect(() => {
        async function fetchDeeds() {
            const deeds = await getDeeds({ isMostRecent: 'true' });
            setDeeds(deeds.map(d => ({ ...d, isFav: false })));
            const statusList = deeds.filter(deed => deed.status).map(deed => deed.status!);
            setStatusList([...new Set(statusList)]);
        }
        fetchDeeds();
    }, []);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    return (
        <div>
            <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]">
                <div
                    className={`absolute z-10 hidden h-full w-full rounded-md bg-black/60 ${isShowDeedMenu ? '!block xl:!hidden' : ''}`}
                    onClick={() => setIsShowDeedMenu(!isShowDeedMenu)}>
                </div>
                <div
                    className={`panel
                    absolute
                    z-10
                    hidden
                    h-full
                    w-[240px]
                    flex-none
                    space-y-4
                    overflow-hidden
                    p-4
                    ltr:rounded-r-none
                    rtl:rounded-l-none
                    ltr:lg:rounded-r-md rtl:lg:rounded-l-md
                    xl:relative xl:block
                    xl:h-auto ${isShowDeedMenu ? '!block h-full ltr:left-0 rtl:right-0' : 'hidden shadow'}`}
                >
                    <div className="flex h-full flex-col pb-16">
                        <div className="flex items-center text-center">
                            <div className="shrink-0">
                                <IconNotes />
                            </div>
                            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Propositions</h3>
                        </div>

                        <div className="my-4 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                        <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'all' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                        }`}
                                    onClick={() => tabChanged('all')}
                                >
                                    <div className="flex items-center">
                                        <IconNotesEdit className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">All Propositions</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${selectedTab === 'fav' && 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary'
                                        }`}
                                    onClick={() => tabChanged('fav')}
                                >
                                    <div className="flex items-center">
                                        <IconStar className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">Favourites</div>
                                    </div>
                                </button>
                                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                                {/* STATUS LIST */}
                                <div className="px-1 py-3 text-white-dark">Status</div>
                                {statusList.map(status => {
                                    const fillColor =
                                        status === 'arquivado' ? 'fill-slate-500' : status === 'protocolado' ? 'fill-primary' : 'fill-secondary';
                                    const textColor =
                                        status === 'arquivado' ? 'text-slate-500' : status === 'protocolado' ? 'text-primary' : 'text-secondary';
                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            className={`flex h-10 w-full items-center rounded-md p-1 font-medium ${textColor} duration-300 hover:bg-white-dark/10 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${selectedTab === status && 'bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]'
                                                }`}
                                            onClick={() => tabChanged(status)}
                                        >
                                            <IconSquareRotated className={`shrink-0 ${fillColor}`}
                                            />
                                            <div className="ltr:ml-3 rtl:mr-3">{status}</div>
                                        </button>
                                    )
                                })}
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>

                <div className="panel h-full flex-1 overflow-auto">
                    <div className="pb-5">
                        <button type="button" className="hover:text-primary xl:hidden" onClick={() => setIsShowDeedMenu(!isShowDeedMenu)}>
                            <IconMenu />
                        </button>
                    </div>
                    {filteredDeedsList.length ? (
                        <div className="min-h-[400px] sm:min-h-[300px]">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                                {filteredDeedsList.map((deed) => (
                                    <div
                                        className={`panel pb-12 ${deed.status === 'protocolado'
                                            ? 'bg-primary-light shadow-primary'
                                            : deed.status === 'arquivado'
                                                ? 'bg-warning-light shadow-slate-500'
                                                : deed.status === 'important'
                                                    ? 'bg-danger-light shadow-danger'
                                                    : 'dark:shadow-dark'
                                            }`}
                                        key={deed.id}
                                    >
                                        <div className="min-h-[142px]">
                                            <div className="flex justify-between">
                                                <div className="flex w-max items-center">
                                                    <div className="flex-none">
                                                        <IconFile className={`h-8 w-8 ${deed.status === 'protocolado'
                                                            ? 'text-primary'
                                                            : deed.status === 'arquivado'
                                                                ? 'text-slate-500'
                                                                : deed.status === 'important'
                                                                    ? 'text-danger'
                                                                    : 'dark:shadow-dark'
                                                            }`} />
                                                    </div>
                                                    <div className="ltr:ml-2 rtl:mr-2">
                                                        <div className="font-bold">{deed.name}</div>
                                                        <div className="text-sx text-white-dark">{format(new Date(deed.docDate), 'dd/MM/yyyy')}</div>
                                                    </div>
                                                </div>
                                                {/* MENU DROP DOWN */}
                                                <div className="dropdown">
                                                    <Dropdown
                                                        offset={[0, 5]}
                                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                                        btnClassName="text-primary"
                                                        button={<IconHorizontalDots className="rotate-90 opacity-70 hover:opacity-100" />}
                                                    >
                                                        <ul className="text-sm font-medium">
                                                            <li>
                                                                <button type="button" onClick={() => viewDeed(deed)}>
                                                                    <IconEye className="h-4.5 w-4.5 shrink-0 ltr:mr-3 rtl:ml-3" />
                                                                    View
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="mt-4 font-semibold">{deed.authors.map(a => (<span key={a.id}>{a.name}</span>))}</h4>
                                                <p className="mt-2 text-white-dark">{deed.description?.slice(0, deed.description.indexOf(" ", 255))}...</p>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-5 left-0 w-full px-5">
                                            <div className="mt-2 flex items-center justify-end">
                                                <div className="flex items-center">
                                                    <button type="button" className="group text-warning ltr:ml-2 rtl:mr-2" onClick={() => setFav(deed)}>
                                                        <IconStar className={`h-4.5 w-4.5 group-hover:fill-warning ${deed.isFav && 'fill-warning'}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[400px] items-center justify-center text-lg font-semibold sm:min-h-[300px]">No data available</div>
                    )}

                    <Transition appear show={isViewDeedModal} as={Fragment}>
                        <Dialog as="div" open={isViewDeedModal} onClose={() => setIsViewDeedModal(false)} className="relative z-50">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-[black]/60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center px-4 py-8">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                            <button
                                                type="button"
                                                onClick={() => setIsViewDeedModal(false)}
                                                className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                            >
                                                <IconX />
                                            </button>
                                            <div className="flex flex-wrap items-center gap-2 bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                                <div className="ltr:mr-3 rtl:ml-3">{params.name}</div>
                                                {params.status && (
                                                    <button
                                                        type="button"
                                                        className={`badge badge-outline-primary rounded-3xl capitalize ltr:mr-3 rtl:ml-3 ${(
                                                            params.isFav && 'shadow-warning',
                                                            params.status === 'protocolado' && 'shadow-primary',
                                                            params.status === 'arquivado' && 'shadow-slate-500',
                                                            params.status === 'important' && 'shadow-danger')
                                                            }`}
                                                    >
                                                        {params.status}
                                                    </button>
                                                )}
                                                {params.isFav && (
                                                    <button type="button" className="text-warning">
                                                        <IconStar className="fill-warning" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <div className="text-base">{params.description}</div>

                                                <div className="mt-8 ltr:text-right rtl:text-left">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setIsViewDeedModal(false)}>
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
        </div>
    );
};

export default PropositionList;
