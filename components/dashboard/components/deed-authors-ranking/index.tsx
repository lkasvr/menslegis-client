'use client'

import IconSettings from '@/components/icon/icon-settings';
import IconXCircle from '@/components/icon/icon-x-circle';
import IconCopy from '@/components/icon/icon-copy';
import { IRootState } from '@/store';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ConfigModal from '../elements/config-modal';
import { getAuthorsRankingByDeed } from './actions/get-deed-authors-ranking';
import { AuthorWithDeeds, AuthorWithDeedsFilters } from './actions/get-authors-with-deeds';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { format } from 'date-fns';
import { Author, getAuthors } from '@/components/actions/get-authors';
import { Type, getTypes } from '../actions/get-types';
import { Subtype, getSubtypes } from '../actions/get-subtypes';
import DropdownMenu from '../elements/dropdown-menu';
import IconTrash from '@/components/icon/icon-trash';
import { DashboardComponentProps, DashboardElementNames } from '../../dashboard-legis';
import { deleteDashboardComponent, duplicateDashboardComponent, saveDashboardComponentsState } from '@/store/dashboardLegisConfigSlice';

interface DeedAuthorsRankingProps extends DashboardComponentProps {
    filters?: AuthorWithDeedsFilters;
}

const DeedAuthorsRanking = ({ componentId, filters, triggerToast }: DeedAuthorsRankingProps) => {
    const componentName: DashboardElementNames = 'DeedAuthorsRanking';
    const dispatch = useDispatch();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';


    const [showModal, setShowModal] = useState(false);

    const [authorsFilters, setAuthorsFilters] = useState<AuthorWithDeedsFilters | undefined>(filters);
    const [authorsRankedWithDeeds, setAuthorsRankedWithDeeds] = useState<AuthorWithDeeds[]>();

    const [period, setPeriod] = useState<string | null>(null);

    // Select Input Data's
    const [types, setTypes] = useState<Type[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [subtypes, setSubtypes] = useState<Subtype[]>([]);
    const [selectedSubtype, setSelectedSubtype] = useState('');
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>();

    useEffect(() => {
        const fetchAuthorsRankingData = async () => {
            try {
                const [authors, types, authorsWithDeeds] = await Promise.all([
                    getAuthors(),
                    getTypes(),
                    getAuthorsRankingByDeed(filters)
                ]);

                setAuthorsRankedWithDeeds(authorsWithDeeds.data);
                setPeriod(authorsWithDeeds.period);
                setAuthorsFilters(authorsWithDeeds.filters);

                setAuthors(authors);
                setTypes(types);
            } catch (error) {
                console.error(`ERROR: (${componentId} | ${componentName})`, error);
                triggerToast({ type: 'error', color: 'danger', title: error, duration: 5000 })
            }
        }
        fetchAuthorsRankingData();
    }, [filters]);

    const handleUpdateRanking = async () => {
        dispatch(
            saveDashboardComponentsState({
                id: componentId,
                props: { filters: { ...authorsFilters } }
            })
        );
        const authorsWithDeeds = await getAuthorsRankingByDeed(authorsFilters);
        setAuthorsRankedWithDeeds(authorsWithDeeds.data);
        setPeriod(authorsWithDeeds.period);
        setShowModal(false);
        triggerToast({ type: 'success', color: 'success', title: 'Ranking updated' })
    };

    const handleResetRanking = async () => {
        if (!authorsFilters) return;
        dispatch(
            saveDashboardComponentsState({
                id: componentId,
            })
        );
        const authorsWithDeeds = await getAuthorsRankingByDeed();
        setAuthorsRankedWithDeeds(authorsWithDeeds.data);
        setPeriod(authorsWithDeeds.period);
    }

    const handleSelectAuthors = (options: MultiValue<{
        label: string;
        value: string;
    }>) => {
        if (options.length > 5)
            return setSelectedAuthors(authors.filter(author => options.some(opt => opt.value === author.id)).slice(0, 5));

        const authorsIds = options.map(option => option.value).join(',');
        setAuthorsFilters((prevState) => ({ ...prevState, authorsIds }));
        setSelectedAuthors(authors.filter(author => options.some(opt => opt.value === author.id)));
    }

    return (
        <div className="panel h-full w-full">
            {/* MODAL */}
            <ConfigModal showModal={showModal} setShowModal={setShowModal} title='Proposition Ranking Settings'>
                <form>
                    {/* Authors */}
                    <div className="mb-5">
                        <label htmlFor="authors">Authors</label>
                        <Select
                            isMulti
                            id="authors"
                            name="author´s"
                            unstyled
                            className="form-select"
                            hideSelectedOptions
                            components={makeAnimated()}
                            classNames={{
                                dropdownIndicator: () => '!hidden',
                                clearIndicator: () => '!hidden'
                            }}
                            defaultValue={selectedAuthors?.map(author => ({ value: author.id, label: author.name }))}
                            options={authors.map(author => ({
                                value: author.id,
                                label: author.name,
                            }))}
                            onChange={handleSelectAuthors}
                        />
                    </div>
                    {/* Type */}
                    <div className="mb-5">
                        <label htmlFor="type">Tipo</label>
                        <select
                            id="type"
                            className="form-select"
                            value={selectedType}
                            onChange={async (e) => {
                                const value = e.target.value;
                                setAuthorsFilters((prevState) => ({ ...prevState, type: value }));
                                setSelectedType(value);
                                if (value) {
                                    const subtypes = await getSubtypes({ deedType: value });
                                    setSubtypes(subtypes);
                                } else { setSubtypes([]) }
                            }}>
                            <option value="">Select type</option>
                            {types?.map(({ name, displayName }) => (<option key={name} value={name}>{displayName}</option>))}
                        </select>
                    </div>
                    {/* Subtype */}
                    <div className="mb-5">
                        <label htmlFor="subtype">Sub-Tipo</label>
                        <select
                            id="subtype"
                            className="form-select"
                            value={selectedSubtype}
                            onChange={(e) => {
                                const value = e.target.value;
                                setAuthorsFilters((prevState) => ({ ...prevState, subtype: value }));
                                setSelectedSubtype(value);
                            }}>
                            <option value="">Select subtype</option>
                            {subtypes?.map(({ name, displayName }) => (<option key={name} value={name}>{displayName}</option>))}
                        </select>
                    </div>
                    {/* Period */}
                    <div className="mb-5">
                        <label htmlFor="tag">Período</label>
                        <div className="w-full flex flex-row flex-nowrap justify-between">
                            <Flatpickr
                                value={authorsFilters?.initialDate}
                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                className="form-input w-[48%]"
                                onChange={(date) => {
                                    const formatedDate = date[0] && format(new Date(date[0]), 'yyyy-MM-dd');

                                    if (new Date(formatedDate) > new Date(`${authorsFilters?.finalDate}`))
                                        return setAuthorsFilters((prevState) => ({ ...prevState, initialDate: undefined }));

                                    setAuthorsFilters((prevState) => ({ ...prevState, initialDate: formatedDate }));
                                }}
                            />
                            <Flatpickr
                                value={authorsFilters?.finalDate}
                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                className="form-input w-[48%]"
                                onChange={(date) => {
                                    const formatedDate = date[0] && format(new Date(date[0]), 'yyyy-MM-dd');

                                    if (new Date(formatedDate) < new Date(`${authorsFilters?.initialDate}`))
                                        return setAuthorsFilters((prevState) => ({ ...prevState, finalDate: undefined }));

                                    setAuthorsFilters((prevState) => ({ ...prevState, finalDate: formatedDate }));
                                }}
                            />
                        </div>
                    </div>
                    {/* BUTTONS */}
                    <div className="mt-8 flex items-center justify-end">
                        <button type="button" className="btn btn-outline-danger gap-2" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleUpdateRanking}>
                            Update Ranking
                        </button>
                    </div>
                </form>
            </ConfigModal >
            {/* CONFIG MENU */}
            <div className="mb-5 flex items-center justify-between">
                <h5 className="w-full text-lg font-semibold dark:text-white-light flex items-center justify-between">
                    Proposition Ranking<span className="mr-6 text-sm text-gray-400">{period}</span>
                </h5>
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
                                onClick: () => dispatch(duplicateDashboardComponent({ name: componentName, props: { filters: authorsFilters } }))
                            },
                            {
                                icon: <IconXCircle className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                text: 'Reset',
                                onClick: () => handleResetRanking()
                            },
                            {
                                icon: <IconSettings className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                text: 'Settings',
                                onClick: () => setShowModal(true)
                            }
                        ]
                    }
                />
            </div>
            {/* TABLE */}
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr className="border-b-0">
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Parlamentar</th>
                            <th>Tipo</th>
                            <th>Subtipo</th>
                            <th>Qtd</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authorsRankedWithDeeds?.map(({ id, name, deeds }, i) => (
                            <tr key={id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex">
                                        <p className="whitespace-nowrap">
                                            {name}
                                            <span
                                                className={`block text-xs
                                                ${i + 1 === 1 && 'text-green-500'}
                                                ${i + 1 === 2 && 'text-yellow-500'}
                                                ${i + 1 === 3 && 'text-orange-500'}
                                                ${i + 1 > 3 && 'text-primary'}`}>
                                                {i + 1}º
                                            </span>
                                        </p>
                                    </div>
                                </td>
                                <td>Proposição</td>
                                <td>Moção</td>
                                <td>{deeds.length}</td>
                            </tr>
                        )).slice(0, 5)}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default DeedAuthorsRanking;
