import { Formik, Form as FormikFormComponent, FormikHelpers } from 'formik';
import React, { ReactNode } from 'react';
import * as Yup from 'yup';

interface IForm<T> {
    children: ReactNode;
    initialValues: T;
    onSubmit: (initialValues: T, actions: FormikHelpers<T>) => void;
    //validationSchema?: Yup.SchemaOf;
    classStyles?: string;
}

const Form = <T extends object>({
    children,
    initialValues,
    onSubmit,
    //validationSchema,
    classStyles,
}: IForm<T>) => {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
        //validationSchema={validationSchema}
        >
            <FormikFormComponent
                className={`${classStyles ?? ''} max-md:scrollbar-none`}
            >
                {children}
            </FormikFormComponent>
        </Formik>
    );
};

export default Form;
