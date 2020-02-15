/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /* Author Rustam Islamov ,not all rights reserved :) */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */

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
  }
}

interface IUseKBform {
  _register(ref: any): void;
  _handleSubmit(event: SyntheticEvent): void;
  watchState?: IFormData[];
  formState?: IFormData[];
  errorState: any;
}

export default function useKBform(): IUseKBform {
  /* validated form state for client */
  const [formState, setFormState] = useState<IFormData[]>();

  /* errors state for client */
  const [errorState, setErrorState] = useState<IError>({} as any);

  /* global form validation boolean */
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  /* watch mode state */
  const [watchState, setWatchState] = useState<IFormData[]>();

  /* init refs array */
  const { current } = useRef<any[]>([]);

  /* create form validation obj */
  // const formInstance = new (Validate as any)(current);

  // useEffect(() => formInstance.checkAttrCombinations(), []);

  useEffect(() => {
    console.log(errorState);
  }, [errorState]);

  /* get existing errors */
  const existingErrors = useCallback(formInstance => formInstance.validate(), []);

  const filterRefsFrom = useCallback(
    (refs: any, refType: string) => [...refs].filter((item: any) => item.nodeName === refType),
    []
  );

  // const handleErrors = useCallback(formInstance => setIsFormValid(isEmptyPropertiesOf(existingErrors())), [
  //   setIsFormValid,
  //   existingErrors,
  //   isEmptyPropertiesOf,
  // ]);

  const onClick = useCallback(
    form => {
      const formInstance = new (Validate as any)(filterRefsFrom(form, 'INPUT'));
      setErrorState(existingErrors(formInstance));
    },
    [filterRefsFrom, setErrorState]
  );

  // const onBlur = useCallback(() => {
  //   handleErrors();
  //   watchMode();
  // }, [handleErrors]);

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
    const form: IFormData[] = [];
    arr?.forEach(({ value, name }: IForm) => form.push({ [name]: value }));
    return form;
  }, []);

  /* you can use watch mode to track form state changes while debugging */
  const watchMode = useCallback(() => setWatchState(createFormArrFrom(current[0])), [createFormArrFrom, setWatchState]);

  const onSubmit = useCallback((event: SyntheticEvent) => {
    event.preventDefault();
    // setErrorState(existingErrors());
    // if (isFormValid) {
    //     setFormState(createFormArrFrom(current[0]));
    // }
  }, []);

  const _register = useCallback(
    (formRef: any) => {
      // current.push(filterInputRefsFrom(formRef));
      current.push(formRef);

      for (let form = 0; form < current.length; form++) {
        for (let el = 0; el < current[form].length; el++) {
          if (current[form][el].nodeName === 'BUTTON') {
            current[form][el].onclick = () => onClick(current[form]);
          }
        }
      }

      // filterInputRefsFrom(formRef).forEach((input: any) => {
      //   input.onblur = onBlur;
      //   input.onkeydown = (event: IHTMLInputEvent) => preventAction(event, formRef);
      // });

      formRef.onsubmit = (event: SyntheticEvent) => onSubmit(event);
      // ref.onsubmit = (event: SyntheticEvent) => event.preventDefault();
    },
    [preventAction]
  );

  /* submit function */
  const _handleSubmit = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      // setErrorState(existingErrors());
      // if (isFormValid) {
      //   setFormState(createFormArrFrom(current[0]));
      // }
    },
    [isFormValid, createFormArrFrom, setFormState, setErrorState]
  );

  return { _register, watchState, formState, errorState, _handleSubmit };
}
