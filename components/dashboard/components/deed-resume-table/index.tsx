import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { Author, getAuthors } from '@/components/actions/get-authors';
import { Type, getTypes } from '../actions/get-types';
import { Deed, DeedFilters, getDeeds } from '@/components/actions/get-deeds';
import { format } from 'date-fns';
import IconMultipleForwardRight from '@/components/icon/icon-multiple-forward-right';
import IconTrash from '@/components/icon/icon-trash';
import IconCopy from '@/components/icon/icon-copy';
import IconXCircle from '@/components/icon/icon-x-circle';
import IconSettings from '@/components/icon/icon-settings';
import DropdownMenu from '../elements/dropdown-menu';
import { DashboardComponentProps, DashboardElementNames } from '../../dashboard-legis';
import ConfigModal from '../elements/config-modal';
import { Subtype, getSubtypes } from '../actions/get-subtypes';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import Tippy from '@tippyjs/react';
import IconFile from '@/components/icon/icon-file';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { deleteDashboardComponent, duplicateDashboardComponent, saveDashboardComponentsState } from '@/store/dashboardLegisConfigSlice';

interface DeedResumeTableProps extends DashboardComponentProps {
    filters?: DeedFilters;
}

const DeedResumeTable = ({ componentId, filters }: DeedResumeTableProps) => {
    const dispatch = useDispatch();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    const componentName = DeedResumeTable.name as DashboardElementNames;
    const [showModal, setShowModal] = useState(false);
    const [deeds, setDeeds] = useState<Deed[]>();
    const [deedFilters, setDeedFilters] = useState<DeedFilters | undefined>(filters);

    // Select Input Data's
    const [types, setTypes] = useState<Type[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [subtypes, setSubtypes] = useState<Subtype[]>([]);
    const [selectedSubtype, setSelectedSubtype] = useState('');
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>();

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const [authors, types, deeds] = await Promise.all([
                    getAuthors(),
                    getTypes(),
                    getDeeds({ isMostRecent: 'true' })
                ]);
                setDeeds(deeds);
                setTypes(types);
                setAuthors(authors);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                // Lidar com o erro, se necessário
            }
        };

        fetchChartData();
    }, [filters]);

    const handleSelectAuthors = (options: MultiValue<{
        label: string;
        value: string;
    }>) => {
        if (options.length > 5)
            return setSelectedAuthors(authors.filter(author => options.some(opt => opt.value === author.id)).slice(0, 5));

        const authorsIds = options.map(option => option.value).join(',');
        setDeedFilters((prevState) => ({ ...prevState, authorsIds }));
        setSelectedAuthors(authors.filter(author => options.some(opt => opt.value === author.id)));
    }

    const handleUpdateDeedResumeTable = async () => {
        dispatch(
            saveDashboardComponentsState({
                id: componentId,
                props: { filters: { ...deedFilters, isMostRecent: 'true' } }
            })
        );
        const deeds = await getDeeds({ ...deedFilters, isMostRecent: 'true' });
        setDeeds(deeds);
        setShowModal(false);
    };

    const handleResetDeedResumeTable = async () => {
        dispatch(
            saveDashboardComponentsState({
                id: componentId,
                props: { filters: { isMostRecent: 'true' } }
            })
        );
        const deeds = await getDeeds({ isMostRecent: 'true' });
        setDeeds(deeds);
    }

    return (
        <div className="panel h-full w-full">
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
                                setDeedFilters((prevState) => ({ ...prevState, type: value }));
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
                                setDeedFilters((prevState) => ({ ...prevState, subtype: value }));
                                setSelectedSubtype(value);
                            }}>
                            <option value="">Select subtype</option>
                            {subtypes?.map(({ name, displayName }) => (<option key={name} value={name}>{displayName}</option>))}
                        </select>
                    </div>
                    {/* BUTTONS */}
                    <div className="mt-8 flex items-center justify-end">
                        <button type="button" className="btn btn-outline-danger gap-2" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleUpdateDeedResumeTable}>
                            Update Proposition Table
                        </button>
                    </div>
                </form>
            </ConfigModal >
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Recent Propositions</h5>
                <DropdownMenu
                    options={
                        [
                            {
                                icon: <IconTrash className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                text: 'Delete',
                                onClick: () => dispatch(deleteDashboardComponent({ id: componentId }))
                            },
                            {
                                icon: <IconCopy className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                text: 'Duplicate',
                                onClick: () => dispatch(duplicateDashboardComponent({ name: componentName, props: { filters: deedFilters } }))
                            },
                            {
                                icon: <IconXCircle className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                text: 'Reset',
                                onClick: () => handleResetDeedResumeTable()
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
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Autores</th>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th className="ltr:rounded-r-md rtl:rounded-l-md !text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deeds?.map(({ id, name, deedType, docDate, pageDocLink, status, authors }) => (
                            <tr key={id} className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <span className="whitespace-nowrap">
                                            {authors.map(author => (author.name))}
                                        </span>
                                    </div>
                                </td>
                                <td>{name}</td>
                                <td>{deedType.displayName}</td>
                                <td>{format(docDate, 'dd/MM/yyyy')}</td>
                                <td>
                                    <span
                                        className={`badge shadow-md
                                        ${status === 'arquivado' && 'bg-orange-500 dark:group-hover:bg-orange-400/80'}
                                        ${status === 'protocolado' && 'bg-slate-800 dark:group-hover:bg-slate-800/80'}
                                        `}
                                    >{status}</span>
                                </td>
                                <td className='text-center'>
                                    <ul className="flex items-center justify-center gap-2">
                                        <li>
                                            <Tippy content="See" className={`${isDark && 'text-white'}`}>
                                                <button type="button">
                                                    <IconFile className="text-success" />
                                                </button>
                                            </Tippy>
                                        </li>
                                        <li>
                                            <Tippy content="Ir" className={`${isDark && 'text-white'}`}>
                                                <button type="button">
                                                    <a
                                                        href={pageDocLink}
                                                        className="flex items-center"
                                                        target='_blank'
                                                        rel="noreferrer">
                                                        <IconMultipleForwardRight className="h-5 w-5 text-primary" />
                                                    </a>
                                                </button>
                                            </Tippy>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        )).slice(0, 6)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DeedResumeTable
