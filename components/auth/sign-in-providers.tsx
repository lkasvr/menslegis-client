'use client';
import React from 'react';

import { signIn } from "next-auth/react";
import IconGoogle from '../icon/icon-google';

interface SignInProvidersProps {
    isDisabled: boolean;
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInProviders = ({ isDisabled, setIsDisabled }: SignInProvidersProps) => {
    return (
        <ul className="flex justify-center gap-3.5 text-white">
            <li className="w-3/4 h-full flex flex-row flex-nowrap justify-center items-center">
                <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                        setIsDisabled(true);
                        signIn('google', { redirect: true, callbackUrl: '/' })
                    }}
                    className="w-full h-full flex justify-center items-center btn btn-outline-primary"
                >
                    <IconGoogle className="h-10 w-10 mr-2" />
                    Entre com o <b>Google</b>
                </button>
            </li>
        </ul>
    )
}

export default SignInProviders
