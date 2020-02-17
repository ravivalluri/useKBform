/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  ####################################################################  */
/*  ####################################################################  */
/*  ##    Made with ❤ by Rustam Islamov ,not all rights reserved :)  ##  */
/*  ####################################################################  */
/*  ####################################################################  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */

import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import isEmptyPropertiesOf from './helpers/isEmptyPropertiesOf';
import { ICurrent, IForm, IFormData, IHTMLInputEvent, IError } from './models';
import utils from './utils/utils';
import Validate from './validate/core';

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        _required?: string;
        _number?: string;
        _min?: string;
        _max?: string;
        _password?: string;
        _passwordrepeat?: string;
        _minlength?: string;
        _maxlength?: string;
        _length?: string;
        _email?: string;
        _amount?: string;
        _pan?: string;
        _panbasic?: string;
        _pin?: string;
        _next?: string;
        _submitnext?: string;
        _formname?: string;
    }
}

interface IUseKBform {
    _register(ref: any): void;
    _handleSubmit(event: SyntheticEvent): void;
    watchState?: IFormData[];
    formState?: IFormData[];
    errorState: any;
    formStatus: any;
}

export default function useKBform(): IUseKBform {
    /* validated form state for client */
    const [formState, setFormState] = useState<IFormData[]>();

    /* errors state for client */
    const [errorState, setErrorState] = useState<any>({ global: false, errors: {} } as any);

    /* global form validation boolean */
    // const [isFormValid, setIsFormValid] = useState<boolean>(false);

    /* watch mode state */
    const [watchState, setWatchState] = useState<IFormData[]>();

    /* status of each form to be sent to client */
    const [formStatus, setFormStatus] = useState<any>();

    /* init refs array */
    const { current } = useRef<any[]>([]);

    // useEffect(() => formInstance.checkAttrCombinations(), []);

    useEffect(() => {
        console.log(formStatus);
    }, [formStatus]);

    /* get existing errors */
    const existingErrors = useCallback(formInstance => formInstance.validate(), []);

    /* helper function to find ref by node name */
    const filterRefsFrom = useCallback((refs: any, refType: string) => [...refs].filter((item: any) => item.nodeName === refType), []);

    /* prevent user actions on specific cases */
    const preventAction = useCallback((event, formRef) => {
        let isNumberBool: boolean | undefined;

        // filterInputRefsFrom(formRef).forEach((input: any) => {
        //   if (input.attributes?._number?.value) {
        //     isNumberBool = utils.isNumberEvent(event);
        //   }

        //   if (parseInt(input.attributes?._length?.value, 10) === input.value?.length) {
        //     if (event.keyCode !== 8) {
        //       event.preventDefault();
        //     }
        //   }
        // });

        return isNumberBool;
    }, []);

    /* helper function to create name:value array */
    const createFormArrFrom = useCallback(arr => {
        console.log(arr);
        // const form: IFormData[] = [];
        // arr?.forEach(({ value, name }: IForm) => form.push({ [name]: value }));
        return arr;
    }, []);

    /* you can use watch mode to track form state changes while debugging */
    // const watchMode = useCallback(() => setWatchState(createFormArrFrom(current[0])), [createFormArrFrom, setWatchState]);

    useEffect(() => {
        if (isEmptyPropertiesOf(errorState.errors)) {
            setErrorState({ ...errorState, global: true });
        }
    }, [setErrorState, errorState.errors]);

    // useEffect(() => {
    //     if (errorState.global) {
    //         console.log('oooo');
    //         setFormStatus(true);
    //     }
    // }, [errorState.global]);

    const onClick = useCallback(
        form => {
            const formInstance = new (Validate as any)(filterRefsFrom(form, 'INPUT'));
            const errors = existingErrors(formInstance);
            setErrorState({ ...errorState, errors });
        },
        [filterRefsFrom, setErrorState, existingErrors],
    );

    const onSubmit = useCallback(
        (event: any, currentForm: any) => {
            event.preventDefault();
            const status = {} as any;

            if (errorState.global) {
                status[currentForm.attributes._formname.value] = 'clean';
                setFormStatus(status);
            }
        },
        [errorState.global],
    );

    const _register = useCallback(
        (formRef: any) => {
            current.push(formRef);

            for (let form = 0; form < current.length; form++) {
                for (let el = 0; el < current[form]?.length; el++) {
                    if (current[form][el].nodeName === 'BUTTON') {
                        current[form][el].onclick = () => onClick(current[form]);
                    }
                    current[form].onsubmit = (event: any) => onSubmit(event, current[form]);
                }
            }

            // filterInputRefsFrom(formRef).forEach((input: any) => {
            //   input.onblur = onBlur;
            //   input.onkeydown = (event: IHTMLInputEvent) => preventAction(event, formRef);
            // });
        },
        [onSubmit, onClick],
    );

    /* submit function */
    const _handleSubmit = useCallback(
        (event: SyntheticEvent) => {
            event.preventDefault();

            if (errorState.global) {
                const currentArr = [...new Set(current)].filter((x: any) => x !== null);

                // console.log(currentArr);
                const arr = [];

                for (let form = 0; form < currentArr.length; form++) {
                    for (let el = 0; el < currentArr[form]?.length; el++) {
                        if (currentArr[form][el].nodeName === 'INPUT') {
                            // console.log('input values', currentArr[form][el].value);
                            const formName = currentArr[form].attributes._formname.value;

                            console.log(formName);

                            arr.push({ [formName]: currentArr[form][el] });

                            // console.log('form name', { [formName]: currentArr[form][el].value });
                        }
                    }
                }

                console.log(arr);

                // setFormState(createFormArrFrom(current));
                // console.log('submitted', [...new Set(current)]);
            }
        },
        [createFormArrFrom, setFormState, errorState.global],
    );

    return { _register, watchState, formState, errorState, formStatus, _handleSubmit };
}
