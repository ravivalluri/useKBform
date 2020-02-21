/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  ####################################################################  */
/*  ####################################################################  */
/*  ##    Made with ❤ by Rustam Islamov ,not all rights reserved :)  ##  */
/*  ####################################################################  */
/*  ####################################################################  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */

import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import isEmptyPropertiesOf from './helpers/isEmptyPropertiesOf';
import { ICurrent, IFormData, IFormStatus, IHTMLInputEvent, IUseKBform } from './models';
import utils from './utils';
import Validate from './validate/core';

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        _required?: string;
        _number?: string;
        _min?: string;
        _max?: string;
        _password?: string;
        _passwordrepeat?: string;
        _strongpassword?: string;
        _minlength?: string;
        _maxlength?: string;
        _length?: string;
        _email?: string;
        _amount?: string;
        _pan?: string;
        _panbasic?: string;
        _pin?: string;
        _formname?: string;
    }
}

export default function useKBform(): IUseKBform {
    /* validated form state for client */
    const [formState, setFormState] = useState<IFormData[]>();

    /* errors state for client */
    const [errorState, setErrorState] = useState<any>({} as any);

    /* watch mode state */
    const [watchState, setWatchState] = useState<IFormData[]>();

    /* status of each form to be sent to client */
    const [formStatus, setFormStatus] = useState<IFormStatus>();

    /* env mode  { 'dev' || 'prod' }*/
    const [envMode, setEnvMode] = useState<string>('prod');

    /* init refs array */
    const { current } = useRef<ICurrent[]>([]);

    /* get existing errors */
    const existingErrorsOf = useCallback(formInstance => formInstance.validate(), []);

    /* helper function to find refs array by node name */
    const filterRefsFrom = useCallback((refs: any, nodeName: string) => [...refs].filter((item: any) => item.nodeName === nodeName), []);

    /* helper function to filter elements by node name */
    const filterByNodeName = useCallback((currentFormEl: ICurrent, nodeName: string) => {
        return currentFormEl?.nodeName === nodeName;
    }, []);

    // useEffect(() => {
    //     console.log(errorState);
    // }, [errorState]);

    // const filterFormElement = el => {
    //     return filterByNodeName(el, 'INPUT');
    // };

    const createFormObjects = useCallback(() => {
        const formInputs = [];
        current.forEach(form => {
            [...form.elements].forEach(el => {
                if (filterByNodeName(el, 'INPUT')) {
                    formInputs.push({ [form.attributes._formname.value]: el });
                }
            });
        });

        return formInputs;
    }, [filterByNodeName]);

    /* helper function to create form objects with the value of  { [name] : value } input */
    const createSortedFormObjects = useCallback(() => {
        const sortedFormState = createFormObjects().reduce((acc: ICurrent, currentForm: ICurrent) => {
            for (const formName in currentForm) {
                if (!acc[formName]) {
                    acc[formName] = [];
                }

                acc[formName].push({ [currentForm[formName].name]: currentForm[formName].value });
            }
            return acc;
        }, {});

        return sortedFormState;
    }, [createFormObjects]);

    const onClick = useCallback(
        (form: ICurrent) => {
            const formInstance = new (Validate as any)(filterRefsFrom(form, 'INPUT'));
            setErrorState(existingErrorsOf(formInstance));

            if (isEmptyPropertiesOf(existingErrorsOf(formInstance))) {
                setFormStatus({ [form.attributes._formname.value]: 'success' });
            }
        },
        [filterRefsFrom, setErrorState, existingErrorsOf, setFormStatus],
    );

    /* TODO refactor */
    /* prevent user actions on keydown*/
    const onKeyDown = useCallback((event: any, currentFormEl: ICurrent) => {
        const bannedKeyCodes = event.keyCode !== 8 && event.keyCode !== 190 && event.keyCode !== 46;
        const numVal = currentFormEl.attributes?._number?.value;
        const lengthVal = currentFormEl.attributes?._length?.value;

        if (numVal && lengthVal) {
            if (parseInt(lengthVal, 10) === currentFormEl.value?.length) {
                if (bannedKeyCodes) {
                    return event.preventDefault();
                }
            }

            if (bannedKeyCodes) {
                return utils.isNumberEvent(event);
            }
        }

        if (numVal) {
            if (bannedKeyCodes) {
                return utils.isNumberEvent(event);
            }
        }

        if (parseInt(lengthVal, 10) === currentFormEl.value?.length) {
            console.log('length');
            if (bannedKeyCodes) {
                return event.preventDefault();
            }
        }
    }, []);

    /* enable watchMode only if envMode setted to 'dev' , you can use watch mode to track form state changes while debugging*/
    useEffect(() => {
        if (envMode === 'dev') {
            current.forEach(form => {
                [...form.elements].forEach(el => {
                    if (filterByNodeName(el, 'INPUT')) {
                        el.onchange = () => setWatchState(createSortedFormObjects());
                    }
                });
            });
        }
    }, [envMode]);

    const _register = useCallback(
        (formRef: ICurrent) => {
            current.push(formRef);

            current.forEach(form => {
                [...form.elements].forEach(el => {
                    if (filterByNodeName(el, 'BUTTON')) {
                        el.onclick = () => onClick(form);
                    }

                    if (filterByNodeName(el, 'INPUT')) {
                        el.onkeydown = (event: IHTMLInputEvent) => onKeyDown(event, el);
                    }
                });

                form.onsubmit = (event: IHTMLInputEvent) => event.preventDefault();
            });
        },
        [filterByNodeName, onKeyDown, onClick],
    );

    /* submit function */
    const _handleSubmit = useCallback(
        (event: SyntheticEvent) => {
            event.preventDefault();

            if (isEmptyPropertiesOf(errorState)) {
                setFormState(createSortedFormObjects());
            }
        },
        [setFormState, errorState, createSortedFormObjects],
    );

    /* set env mode */
    const _envMode = useCallback((mode: string) => setEnvMode(mode), [setEnvMode]);

    return { _register, watchState, formState, errorState, formStatus, _handleSubmit, _envMode };
}
