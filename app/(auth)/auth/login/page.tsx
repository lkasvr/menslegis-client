import ComponentsAuthLoginForm from '@/components/auth/login-form';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import SignInProviders from '@/components/auth/sign-in-providers';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Login Cover',
};

const Page = () => {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-white bg-cover bg-center bg-no-repeat px-6 py-10 sm:px-16">
            <div
                className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden border-y border-[#056367] border-r rounded-md backdrop-blur-lg lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0"
            >
                {/* [linear-gradient(225deg,rgba(5,99,103,1)_0%,rgba(72,141,144,1)_100%)] */}
                <div className="relative hidden w-full items-center justify-center bg-primary p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                    <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                    <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                        <Link href="/" className="ms-10 block w-60 lg:w-96">
                            <Image
                                src="/assets/images/mens-legis-logo-cover.svg"
                                width={1000}
                                height={1000}
                                alt="Logo Cover"
                                className="h-full w-full"
                            />
                        </Link>
                    </div>
                </div>
                <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                    <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                        <Link href="/" className="block w-8 lg:hidden">
                            <Image
                                src="/assets/images/auth/Mens-Legis-Login-Cover.svg"
                                alt="Logo"
                                className="mx-auto w-10"
                                width={500}
                                height={500}
                            />
                        </Link>
                    </div>
                    <div className="w-full max-w-[440px] lg:mt-16">
                        <div className="mb-10">
                            <h1 className="text-3xl font-extrabold uppercase !leading-snug text-[#056367] md:text-4xl">Sign in</h1>
                            <p className="text-base font-bold leading-normal text-white-dark">Entre com seu email e senha para logar</p>
                        </div>
                        <ComponentsAuthLoginForm />
                        <div className="relative my-7 text-center md:mb-9">
                            <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                            <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">ou</span>
                        </div>
                        <div className="mb-10 md:mb-[60px]">
                            <SignInProviders />
                        </div>
                        <div className="text-center dark:text-black">
                            Don&apos;t have an account ?&nbsp;
                            <Link
                                href="/auth/cover-register"
                                className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                SIGN UP
                            </Link>
                        </div>
                    </div>
                    <p
                        className="absolute bottom-6 w-full text-center dark:text-white">
                        © {new Date().getFullYear()}.MENSLEGIS All Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;
