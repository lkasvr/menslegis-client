'use client'
import Dropdown from '@/components/dropdown'
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots'
import { IRootState } from '@/store'
import React, { Suspense, useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import { DeedFilters } from '../actions/get-deeds'
import IconSettings from '@/components/icon/icon-settings';
import IconXCircle from '@/components/icon/icon-x-circle';
import ModalCharts from '../modal-charts/modal-charts';
import { Author, getAuthors } from '../actions/get-authors'
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Loading from '@/components/layouts/loading'
import { Type, getTypes } from '../actions/get-types'
import { Subtype, getSubtypes } from '../actions/get-subtypes'
import { ChartData, Serie, getChartData } from './actions/get-chart-data'
import { format } from 'date-fns';
import Select, { ActionMeta, MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';

interface AuthorOption {
    label: string;
    value: string;
}

const PropositionsBarChart = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const [isMounted, setIsMounted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [chartData, setChartData] = useState<ChartData>();
    const [series, setSeries] = useState<Serie[]>();
    const [authorsQtyRange, setAuthorsQtyRange] = useState<number>(3);


    const [deedSubtype, setDeedSubtype] = useState<{ displayName: string }>();
    // Select Input Data's
    const [types, setTypes] = useState<Type[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [subtypes, setSubtypes] = useState<Subtype[]>([]);
    const [selectedSubtype, setSelectedSubtype] = useState('');
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>();
    const [isFilterByPeriod, setIsFilterByPeriod] = useState(true);

    const [docDate, setDocDate] = useState<Date[]>();
    const [initialDate, setInitialDate] = useState<Date[]>();
    const [finalDate, setFinalDate] = useState<Date[]>();

    const [filters, setFilters] = useState<DeedFilters | undefined>(undefined);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const [authors, types, subTypes] = await Promise.all([
                    getAuthors(),
                    getTypes(),
                    getSubtypes(),
                ]);

                const firstThreeAuthors = authors.slice(0, 3);
                const authorsIds = firstThreeAuthors.map(author => author.id).join(',');
                const chartData = await getChartData({ authorsIds });
                setFilters((prevFilters) => ({ ...prevFilters, authorsIds }));

                setAuthorsQtyRange(authors.length)
                setAuthors(authors);
                setSelectedAuthors(firstThreeAuthors);
                setTypes(types);
                setSelectedType(chartData.deeds[0].deedType.name);
                setSubtypes(subTypes);
                setSelectedSubtype(chartData.deeds[0].deedSubtype.name);
                setDeedSubtype(chartData.deeds[0].deedSubtype);

                setChartData(chartData);
                setSeries(chartData.series);
                setIsMounted(true);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                // Lidar com o erro, se necessário
            }
        };

        fetchChartData();
    }, []);

    const handleResetChart = async () => {
        if (!filters) return;
        setIsMounted(false);
        const chartData = await getChartData();
        setSeries(chartData?.series?.slice(0, authorsQtyRange))
        setFilters(undefined);
        setIsMounted(true);
    }

    const handleUpdateChart = async () => {
        setIsMounted(false);
        const params = Object.entries(filters ?? {});
        const newFilters: Partial<DeedFilters> = params.reduce((acc, [key, value]) => (value ? { ...acc, [key]: value } : acc), {});
        const chartData = await getChartData(newFilters);
        setChartData(chartData);
        setSeries(chartData?.series?.slice(0, authorsQtyRange))
        setIsMounted(true);
        setShowModal(false);
    }

    const handleSelectAuthors = (options: MultiValue<AuthorOption>, actionMeta: ActionMeta<AuthorOption>) => {
        if (options.length > 3)
            return setSelectedAuthors(authors.filter(author => options.some(opt => opt.value === author.id)).slice(0, range1));

        const authorsIds = options.map(option => option.value).join(',');
        setFilters((prevFilters) => ({ ...prevFilters, authorsIds }));
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
            <ModalCharts showModal={showModal} setShowModal={setShowModal} title='Chart Settings'>
                <form>
                    {/* Author */}
                    <div className="mb-5">
                        <label htmlFor="authors">Author</label>
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
                            disabled={isFilterByPeriod}
                            onChange={(date) => {
                                const formatedDate = date[0] && format(new Date(date[0]), 'yyyy-MM-dd');
                                setFilters((prevFilters) => ({ ...prevFilters, date: formatedDate }));
                                setDocDate(date);
                            }}
                        />
                    </div>
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
                                    if (!checked) {
                                        setInitialDate(undefined);
                                        setFinalDate(undefined);
                                    } else { setDocDate(undefined); }
                                }}
                            />
                            <span className="outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                        </label>
                    </div>
                    <div className={`mb-5 ml-5 ${!isFilterByPeriod && 'hidden'}`}>
                        <label htmlFor="tag" className='mr-5'>Período</label>
                        <div className="w-full flex flex-row flex-nowrap justify-between">
                            <Flatpickr
                                value={initialDate}
                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                className="form-input w-[48%]"
                                onChange={(date) => {
                                    const formatedDate = date[0] && format(new Date(date[0]), 'yyyy-MM-dd');
                                    setFilters((prevFilters) => ({ ...prevFilters, initialDate: formatedDate }));
                                    setInitialDate(date);
                                }}
                            />
                            <Flatpickr
                                value={finalDate}
                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                className="form-input w-[48%]"
                                onChange={(date) => {
                                    const formatedDate = date[0] && format(new Date(date[0]), 'yyyy-MM-dd');
                                    setFilters((prevFilters) => ({ ...prevFilters, finalDate: formatedDate }));
                                    setFinalDate(date);
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center justify-end">
                        <button type="button" className="btn btn-outline-danger gap-2" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleUpdateChart}>
                            Update Chart
                        </button>
                    </div>
                </form>
            </ModalCharts>
            <Suspense fallback={
                <span className="w-5 h-5 m-auto mb-10">
                    <span className="animate-ping inline-flex h-full w-full rounded-full bg-info"></span>
                </span>
            }>
                <div className="panel h-full p-0 lg:col-span-2">
                    <div className="mb-5 flex items-start justify-between border-b border-white-light p-5  dark:border-[#1b2e4b] dark:text-white-light">
                        <h5 className="text-lg font-semibold ">
                            {`Quantidade mensal de ${deedSubtype?.displayName} por parlamentar, período: ${chartData?.period}`}
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
                                        <button type="button" onClick={() => handleResetChart()}>
                                            <IconXCircle className="h-4.5 w-4.5 shrink-0 ltr:mr-1 rtl:ml-1" />
                                            Reset
                                        </button>
                                    </li>
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



