'use client'
import Dropdown from '@/components/dropdown'
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots'
import { IRootState } from '@/store'
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import { DeedFilters } from './actions/get-deeds'
import IconSettings from '@/components/icon/icon-settings'
import ModalCharts from '../modal-charts/modal-charts'
import { Author, getAuthors } from './actions/get-authors'
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Loading from '@/components/layouts/loading'
import { Type, getTypes } from './actions/get-types'
import { Subtype, getSubtypes } from './actions/get-subtypes'
import { ChartData, getChartData } from './actions/get-chart-data'

const PropositionsBarChart = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const [isMounted, setIsMounted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [deedSubtype, setDeedSubtype] = useState({});
    // Select Input Data's
    const [authors, setAuthors] = useState<Author[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [subtypes, setSubtypes] = useState<Subtype[]>([]);

    const [selectedAuthor, setSelectedAuthor] = useState<string>();
    const [selectedType, setSelectedType] = useState<string>();
    const [selectedSubtype, setSelectedSubtype] = useState<string>();

    const [docDate, setDocDate] = useState<any>('2022-07-05');
    const [initialDate, setInitialDate] = useState<any>('2022-07-05');
    const [finalDate, setFinalDate] = useState<any>('2022-07-05');
    const [filters, setFilters] = useState<DeedFilters | undefined>(undefined);
    const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

    useEffect(() => {
        (async () => setAuthors(await getAuthors()))();
        (async () => setTypes(await getTypes()))();
        (async () => setSubtypes(await getSubtypes()))();
    }, []);

    const generateChartData = useCallback(async () => filters ? await getChartData(filters) : await getChartData(), [filters]);

    const generateChart = (chartData: ChartData) => {
        setIsMounted(false);
        if (chartData.deeds[0].authors.length <= 1) setSelectedAuthor(chartData.deeds[0].authors[0].name);
        setSelectedType(chartData.deeds[0].deedType.name);
        setSelectedSubtype(chartData.deeds[0].deedSubtype.name);
        setDeedSubtype(chartData.deeds[0].deedSubtype);
        setSeries(chartData.series);
        setIsMounted(true);
    };

    useEffect(() => {
        const fetchChartData = async () => {
            const chartData = await generateChartData();
            generateChart(chartData);
        };

        fetchChartData();
    }, []);

    const updateChart = async (filters?: DeedFilters) => {
        const params = Object.entries(filters ?? {});
        const newFilters: Partial<DeedFilters> = params.reduce((acc, [key, value]) => (value ? { ...acc, [key]: value } : acc), {});

        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
        const chartData = await generateChartData();
        generateChart(chartData);
        setShowModal(false);
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
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
            <ModalCharts showModal={showModal} setShowModal={setShowModal} title='Chart Settings'>
                <form>
                    {/* Author */}
                    <div className="mb-5">
                        <label htmlFor="name">Author</label>
                        <select
                            id="author"
                            className="form-select"
                            value={selectedAuthor}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFilters((prevFilters) => ({ ...prevFilters, authorsIds: e.target.value }));
                                setSelectedAuthor(value);
                            }}
                        >
                            <option value="">Select author</option>
                            {authors?.map(({ id, name }) => (<option key={id} value={id}>{name}</option>))}
                        </select>
                    </div>
                    {/* Type */}
                    <div className="mb-5">
                        <label htmlFor="type">Tipo</label>
                        <select id="type" className="form-select" value={selectedType} onChange={(e) => {
                            const value = e.target.value;
                            setFilters((prevFilters) => ({ ...prevFilters, type: value }));
                            setSelectedType(value);
                        }}>
                            <option value="">Select type</option>
                            {types?.map(({ name, displayName }) => (<option key={name} value={name}>{displayName}</option>))}
                        </select>
                    </div>
                    {/* Subtype */}
                    <div className="mb-5">
                        <label htmlFor="subtype">Sub-Tipo</label>
                        <select id="subtype" className="form-select" value={selectedSubtype} onChange={(e) => {
                            const value = e.target.value;
                            setFilters((prevFilters) => ({ ...prevFilters, subtype: value }));
                            setSelectedSubtype(value);
                        }}>
                            <option value="">Select subtype</option>
                            {subtypes?.map(({ name, displayName }) => (<option key={name} value={name}>{displayName}</option>))}
                        </select>
                    </div>
                    <div className="mb-5">
                        <label htmlFor="tag">Data do Documento</label>
                        <Flatpickr
                            value={docDate}
                            options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                            className="form-input"
                            onChange={(date) => setDocDate(date)}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="tag">Período</label>
                        <div className="w-full flex flex-row flex-nowrap justify-between">
                            <Flatpickr
                                value={initialDate}
                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                className="form-input w-[48%]"
                                onChange={(date) => {
                                    setFilters((prevFilters) => ({ ...prevFilters, initialDate: date }));
                                    setInitialDate(date);
                                }}
                            />
                            <Flatpickr
                                value={finalDate}
                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                className="form-input w-[48%]"
                                onChange={(date) => setFinalDate(date)}
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center justify-end">
                        <button type="button" className="btn btn-outline-danger gap-2" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={updateChart}>
                            Update Chart
                        </button>
                    </div>
                </form>
            </ModalCharts>
            <Suspense fallback={<Loading />}>
                <div className="panel h-full p-0 lg:col-span-2">
                    <div className="mb-5 flex items-start justify-between border-b border-white-light p-5  dark:border-[#1b2e4b] dark:text-white-light">
                        <h5 className="text-lg font-semibold ">
                            {`Quantidade mensal de ${deedSubtype?.displayName} por parlamentar`}
                        </h5>
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="hover:text-primary"
                                button={<IconHorizontalDots className="text-black/70 hover:!text-primary dark:text-white/70" />}
                            >
                                <ul>
                                    <li>
                                        <button type="button" onClick={() => setShowModal(true)}>
                                            <IconSettings className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />
                                            Settings
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>

                    {isMounted && <ReactApexChart
                        options={deedsSeries.options}
                        series={series}
                        type="bar"
                        height={360}
                        width={'100%'}
                    />}
                </div>
            </Suspense>
        </React.Fragment>
    )
}

export default PropositionsBarChart



