'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconMinus from '@/components/icon/icon-minus';
import IconMenuNotes from '@/components/icon/menu/icon-menu-notes';
import IconMenuCalendar from '@/components/icon/menu/icon-menu-calendar';
import IconMenuFontIcons from '@/components/icon/menu/icon-menu-font-icons';
import IconMenuUsers from '@/components/icon/menu/icon-menu-users';
import IconMenuPages from '@/components/icon/menu/icon-menu-pages';
import IconMenuAuthentication from '@/components/icon/menu/icon-menu-authentication';
import IconMenuDocumentation from '@/components/icon/menu/icon-menu-documentation';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import Image from 'next/image';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => setCurrentMenu((oldValue) => oldValue === value ? '' : value);;

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <Image className="ml-[5px] w-12 flex-none" src="/assets/images/logo/logoMLinner(328-328).png" alt="logo" width={328} height={328} />
                            <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">MENSLEGIS</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                    <div className="flex items-center">
                                        <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}&nbsp;
                                            {
                                                pathname === '/' && (<span className='text-xs font-extrabold'>(Legis)</span>)
                                            }
                                        </span>
                                    </div>

                                    <div className={currentMenu !== 'dashboard' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/">{t('legis')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('apps')}</span>
                            </h2>

                            <li className="nav-item">
                                <ul>
                                    <li className="nav-item">
                                        <Link href="/apps/propositions" className="group">
                                            <div className="flex items-center">
                                                <IconMenuNotes className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Propositions')}</span>
                                            </div>
                                        </Link>
                                    </li>


                                    <li className="nav-item">
                                        <Link href="/apps/calendar" className="group">
                                            <div className="flex items-center">
                                                <IconMenuCalendar className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('calendar')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/font-icons" className="group">
                                    <div className="flex items-center">
                                        <IconMenuFontIcons className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('font_icons')}</span>
                                    </div>
                                </Link>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('user_and_pages')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'users' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('users')}>
                                    <div className="flex items-center">
                                        <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('users')}</span>
                                    </div>

                                    <div className={currentMenu !== 'users' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'users' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/users/profile">{t('profile')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/users/user-account-settings">{t('account_settings')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'page' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('page')}>
                                    <div className="flex items-center">
                                        <IconMenuPages className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('pages')}</span>
                                    </div>

                                    <div className={currentMenu !== 'page' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'page' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/pages/knowledge-base">{t('knowledge_base')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/contact-us-boxed" target="_blank">
                                                {t('contact_us_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/contact-us-cover" target="_blank">
                                                {t('contact_us_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/faq">{t('faq')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/coming-soon-boxed" target="_blank">
                                                {t('coming_soon_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/coming-soon-cover" target="_blank">
                                                {t('coming_soon_cover')}
                                            </Link>
                                        </li>
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${errorSubMenu ? 'open' : ''
                                                    } w-full before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                onClick={() => setErrorSubMenu(!errorSubMenu)}
                                            >
                                                {t('error')}
                                                <div className={`${errorSubMenu ? '-rotate-90 rtl:rotate-90' : ''} ltr:ml-auto rtl:mr-auto`}>
                                                    <IconCaretsDown fill={true} className="h-4 w-4" />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={errorSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <a href="/pages/error404" target="_blank">
                                                            {t('404')}
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/error500" target="_blank">
                                                            {t('500')}
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/error503" target="_blank">
                                                            {t('503')}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>

                                        <li>
                                            <Link href="/pages/maintenence" target="_blank">
                                                {t('maintenence')}
                                            </Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'auth' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('auth')}>
                                    <div className="flex items-center">
                                        <IconMenuAuthentication className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('authentication')}</span>
                                    </div>

                                    <div className={currentMenu !== 'auth' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'auth' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/auth/boxed-signin" target="_blank">
                                                {t('login_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-signup" target="_blank">
                                                {t('register_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-lockscreen" target="_blank">
                                                {t('unlock_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-password-reset" target="_blank">
                                                {t('recover_id_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-login" target="_blank">
                                                {t('login_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-register" target="_blank">
                                                {t('register_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-lockscreen" target="_blank">
                                                {t('unlock_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-password-reset" target="_blank">
                                                {t('recover_id_cover')}
                                            </Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('supports')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <Link href="https://vristo.sbthemes.com" target="_blank" className="nav-link group">
                                    <div className="flex items-center">
                                        <IconMenuDocumentation className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('documentation')}</span>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
