'use client';
import React, { useState } from 'react';
import Form from '@/components/forms'
import IconMail from '@/components/icon/icon-mail';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconUnlockDots from '@/components/icon/icon-unlock-dots';
import { signIn } from 'next-auth/react';
import { Field } from 'formik';
import SignInProviders from './sign-in-providers';
import { useDispatch } from 'react-redux';
import { displayAlert } from '@/store/appConfigSlice';

type LoginForm = {
    identifier: string;
    password: string;
};

const LoginForm = () => {
    const dispatch = useDispatch();


    const [isDisabled, setIsDisabled] = useState(false);
    const [passwordInputType, setPasswordInputType] = useState<'password' | 'text'>('password');
    const handleSubmit = async ({ identifier, password }: LoginForm) => {
        try {
            setIsDisabled(true);
            await signIn('credentials', {
                identifier,
                password,
                redirect: true,
                callbackUrl: '/',
            });
        } catch (error) {
            console.error(error);
            dispatch(displayAlert({
                color: 'danger',
                type: 'error',
                title: 'Erro no login. Tente novamente'
            }));
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <>
            <Form<LoginForm>
                initialValues={{
                    identifier: '',
                    password: '',
                }}
                onSubmit={handleSubmit}
                //validationSchema={validationYupSchema}
                classStyles="space-y-5 dark:text-white"
            >
                <div>
                    <label htmlFor="Email">Email</label>
                    <div className="relative text-white-dark">
                        <Field
                            id="Email"
                            type="email"
                            name="identifier"
                            placeholder="Enter Email"
                            className="form-input ps-10 placeholder:text-white-dark"
                        />
                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconMail fill={true} />
                        </span>
                    </div>
                </div>
                <div>
                    <label htmlFor="Password">Password</label>
                    <div className="relative text-white-dark">
                        <Field
                            id="Password"
                            type={passwordInputType}
                            name="password"
                            placeholder="Enter Password"
                            className="form-input ps-10 placeholder:text-white-dark"
                        />
                        {passwordInputType === 'password' ?
                            <button
                                type="button"
                                className="absolute start-4 top-1/2 -translate-y-1/2"
                                onClick={() => setPasswordInputType('text')}
                            >
                                <IconLockDots fill={true} />
                            </button>
                            :
                            <button
                                type="button"
                                className="absolute start-4 top-1/2 -translate-y-1/2"
                                onClick={() => setPasswordInputType('password')}
                            >
                                <IconUnlockDots />
                            </button>
                        }
                    </div>
                </div>
                <button
                    type="submit"
                    className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(5,99,103,0.44)]"
                    disabled={isDisabled}
                >
                    Entrar
                </button>
            </Form>
            <div className="relative my-7 text-center md:mb-9">
                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">ou</span>
            </div>
            <div className="mb-10 md:mb-[60px]">
                <SignInProviders
                    isDisabled={isDisabled}
                    setIsDisabled={setIsDisabled}
                />
            </div>
        </>
    );
};

export default LoginForm;
