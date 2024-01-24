'use client'
import { IRootState } from '@/store'
import React, { Suspense, useCallback, useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelector, useDispatch } from 'react-redux'
import { DeedFilters } from '@/components/actions/get-deeds'
import IconSettings from '@/components/icon/icon-settings';
import IconXCircle from '@/components/icon/icon-x-circle';
import IconTrash from '@/components/icon/icon-trash';
import ConfigModal from '../../elements/config-modal';
import { Author, getAuthors } from '@/components/actions/get-authors';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Loading from '@/components/layouts/loading'
import { Type, getTypes } from '../../actions/get-types'
import { Subtype, getSubtypes } from '../../actions/get-subtypes'
import { ChartData, Serie, getChartData } from './actions/get-chart-data'
import { addMonths, differenceInMonths, format, subMonths } from 'date-fns';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import DropdownMenu from '../../elements/dropdown-menu'
import IconCopy from '@/components/icon/icon-copy'
import { DashboardComponentProps, DashboardElementNames } from '@/components/dashboard/dashboard-legis'
import { deleteDashboardComponent, duplicateDashboardComponent, saveDashboardComponentsState } from '@/store/dashboardLegisConfigSlice'
import DashboardComponentLoading from '../../elements/loading'

interface PropositionBarChartProps extends DashboardComponentProps {
    filters?: DeedFilters;
    authorsRangeInputValue?: number;
}

const PropositionsBarChart = ({ componentId, filters, authorsRangeInputValue = 3, triggerToast }: PropositionBarChartProps) => {
    const componentName = PropositionsBarChart.name as DashboardElementNames;
    const dispatch = useDispatch();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const [isMounted, setIsMounted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [chartData, setChartData] = useState<ChartData>();
    const [series, setSeries] = useState<Serie[]>();
    const [authorsQtyRange, setAuthorsQtyRange] = useState<number>(authorsRangeInputValue);

    const [deedSubtype, setDeedSubtype] = useState<{ displayName: string }>();
    // Select Input Data's
    const [types, setTypes] = useState<Type[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [subtypes, setSubtypes] = useState<Subtype[]>([]);
    const [selectedSubtype, setSelectedSubtype] = useState('');
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>();
    const [isFilterByPeriod, setIsFilterByPeriod] = useState(true);

    const [deedFilters, setDeedFilters] = useState<DeedFilters | undefined>(filters);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const [authors, types, chartData] = await Promise.all([
                    getAuthors(),
                    getTypes(),
                    getChartData(filters)
                ]);
                setDeedFilters((prevState) => ({ ...prevState, filters }));

                setAuthors(authors);
                setTypes(types);

                setDeedSubtype(chartData.deeds[0].deedSubtype);
                setChartData(chartData);
                setSeries(chartData.series.slice(0, authorsRangeInputValue));
            } catch (error) {
                console.error(`ERROR: (${componentId} | ${componentName})`, error);
                triggerToast({ type: 'error', color: 'danger', title: error, duration: 5000 })
            } finally {
                setIsMounted(true);
            }
        };

        fetchChartData();
    }, [filters, authorsRangeInputValue]);

    const handleResetChart = async () => {
        if (!deedFilters) return;
        dispatch(
            saveDashboardComponentsState({
                id: componentId,
                props: { filters: { ...deedFilters }, authorsRangeInputValue: authorsQtyRange }
            })
        );
        setIsMounted(false);
        const chartData = await getChartData();
        setSeries(chartData?.series?.slice(0, authorsQtyRange))
        setDeedFilters(undefined);
        setIsMounted(true);
    }

    const handleUpdateChart = async () => {
        setIsMounted(false);
        dispatch(
            saveDashboardComponentsState({
                id: componentId,
                props: { filters: deedFilters, authorsRangeInputValue: authorsQtyRange }
            })
        );

        const params = Object.entries(deedFilters ?? {});
        const newFilters: Partial<DeedFilters> = params.reduce((acc, [key, value]) => (value ? { ...acc, [key]: value } : acc), {});
        const chartData = await getChartData(newFilters);
        setChartData(chartData);
        setShowModal(false);
        setSeries(chartData?.series?.slice(0, authorsQtyRange))
        setIsMounted(true);
    }

    const handleSelectAuthors = (options: MultiValue<{
        label: string;
        value: string;
    }>) => {
        if (options.length > 3)
            return setSelectedAuthors(authors.filter(author => options.some(opt => opt.value === author.id)).slice(0, authorsQtyRange));

        const authorsIds = options.map(option => option.value).join(',');
        setDeedFilters((prevState) => ({ ...prevState, authorsIds }));
        setSelectedAuthors(authors.filter(author => options.some(opt => opt.value === author.id)));
    }

    // uniqueVisitorSeriesOptions
    const deedsSeries: any = {
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#FF45F2', '#C672E8', '#7872E8', '#E87299', '#FFBB44', '#FFE845', '#E8CB72', '#E8AB72', '#E8E872', '#ffd700', '#4f4f4f'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 8,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: chartData?.categories,
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 0,
                opposite: !!isRtl,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };

    return (
        <React.Fragment>
            <ConfigModal showModal={showModal} setShowModal={setShowModal} title='Chart Settings'>
                <form>
                    {/* Authors */}
                    <div className="mb-5">
                        <label htmlFor="authors">Authors</label>
                        <Select
                            isMulti
                            id="authors"
                            name="authors"
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
                        <div className='mt-5'>
                            <div className="font-bold">
                                <span
                                    className="inline-block py-1 px-2 rounded text-primary border border-white-light dark:border-dark">{authorsQtyRange}</span>
                                <span className='ml-5'>Authors per chart</span>
                            </div>
                            <input type="range" className="w-full py-2.5" value={authorsQtyRange} min={0} max={authors.length} onChange={
                                (e) => setAuthorsQtyRange(parseInt(e.target.value))
                            } />
                        </div>
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
                            {types?.map(({ id, name, displayName }) => (<option key={id} value={name}>{displayName}</option>))}
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
                            {subtypes?.map(({ id, name, displayName }) => (<option key={id} value={name}>{displayName}</option>))}
                        </select>
                    </div>
                    {/* DocDate */}
                    <div className="mb-5">
                        <label htmlFor="tag">Data do Documento</label>
                        <Flatpickr
                            value={deedFilters?.date}
                            options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                            className="form-input"
                            disabled={isFilterByPeriod}
                            onChange={(date) => {
                                const formatedDate = date[0] && format(new Date(date[0]), 'yyyy-MM-dd');
                                setDeedFilters((prevState) => ({ ...prevState, date: formatedDate }));
                            }}
                        />
                    </div>
                    {/* Period */}
                    <div className="mt-5 flex flex-nowrap">
                        <label htmlFor="tag" className='mr-5'>Filtrar por período:</label>
                        <label className="w-12 h-6 relative">
                            <input
                                type="checkbox"
                                id="custom_switch_checkbox1"
                                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                checked={isFilterByPeriod}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsFilterByPeriod(checked);
                                    if (checked) {
                                        setDeedFilters((prevState) => ({ ...prevState, date: undefined }));
                                    } else {
                                        setDeedFilters((prevState) => ({ ...prevState, initialDate: undefined, finalDate: undefined }));
                                    }
                                }}
                            />
                            <span className="outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                        </label>
                    </div>
                    <div className={`mb-5 ml-5 ${!isFilterByPeriod && 'hidden'}`}>
                        <label htmlFor="tag" className='mr-5'>Período</label>
                        <div className="w-full flex flex-row flex-nowrap justify-between">
                            <Flatpickr
                                value={deedFilters?.initialDate}
                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                className="form-input w-[48%]"
                                onChange={(date) => {
                                    const formatedDate = date[0] && format(new Date(date[0]), 'yyyy-MM-dd');

                                    if (!deedFilters?.finalDate) {
                                        const finalFormatedDate = format(addMonths(formatedDate, 12), 'yyyy-MM-dd');
                                        setDeedFilters((prevState) => ({ ...prevState, initialDate: formatedDate, finalDate: finalFormatedDate }));
                                    } else {
                                        if (differenceInMonths(deedFilters.finalDate, formatedDate) !== 11) {
                                            setDeedFilters((prevState) => ({ ...prevState, finalDate: undefined, }));
                                            alert('O período deve comportar 12 meses');
                                            return;
                                        }
                                        setDeedFilters((prevState) => ({ ...prevState, initialDate: formatedDate, }));
                                    }
                                }}
                            />
                            <Flatpickr
                                value={deedFilters?.finalDate}
                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                className="form-input w-[48%]"
                                onChange={(date) => {
                                    const formatedDate = date[0] && format(new Date(date[0]), 'yyyy-MM-dd');

                                    if (!deedFilters?.initialDate) {
                                        const initialFormatedDate = format(subMonths(formatedDate, 12), 'yyyy-MM-dd');
                                        setDeedFilters((prevState) => ({ ...prevState, initialDate: initialFormatedDate, finalDate: formatedDate }));
                                    } else {
                                        if (differenceInMonths(formatedDate, deedFilters.initialDate) !== 11) {
                                            setDeedFilters((prevState) => ({ ...prevState, initialDate: undefined, }));
                                            alert('O período deve comportar 12 meses');
                                            return;
                                        }
                                        setDeedFilters((prevState) => ({ ...prevState, finalDate: formatedDate, }));
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* BUTTONS */}
                    <div className="mt-8 flex items-center justify-end">
                        <button type="button" className="btn btn-outline-danger gap-2" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleUpdateChart}>
                            Update Chart
                        </button>
                    </div>
                </form>
            </ConfigModal>
            <Suspense fallback={
                <span className="w-5 h-5 m-auto mb-10">
                    <span className="animate-ping inline-flex h-full w-full rounded-full bg-primary"></span>
                </span>
            }>
                <div className="panel h-full p-0 lg:col-span-2">
                    <div className="mb-5 flex items-start justify-between border-b border-white-light p-5  dark:border-[#1b2e4b] dark:text-white-light">
                        <h5 className="w-full text-lg font-semibold flex items-center justify-between">
                            {`Quantidade mensal de ${deedSubtype?.displayName} por parlamentar`}
                            <span className="mr-6 text-sm text-gray-400">{chartData?.period}</span>
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
                                        onClick: () => dispatch(duplicateDashboardComponent({
                                            name: componentName,
                                            props: { filters: deedFilters, authorsRangeInputValue: authorsQtyRange }
                                        }))
                                    },
                                    {
                                        icon: <IconXCircle className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />,
                                        text: 'Reset',
                                        onClick: () => handleResetChart()
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
                    {isMounted ?
                        <ReactApexChart
                            options={deedsSeries.options}
                            series={series}
                            type="bar"
                            height={360}
                            width={'100%'}
                        /> :
                        <DashboardComponentLoading />
                    }
                </div>
            </Suspense>
        </React.Fragment>
    )
}

export default PropositionsBarChart



