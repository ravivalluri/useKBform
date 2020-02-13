/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /* Author Rustam Islamov ,not all rights reserved :) */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */

import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import isEmptyPropertiesOf from './helpers/isEmptyPropertiesOf';
import { ICurrent, IForm, IHTMLInputEvent } from './types/types';
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
  }
}

interface IUseKBform {
  _handleSubmit(event: SyntheticEvent): void;
  _register(ref: any): void;
  watchState?: IForm[];
  formState?: IForm[];
  errorState: any;
}

export default function useKBform(): IUseKBform {
  /* validated form state for client */
  const [formState, setFormState] = useState<IForm[]>();

  /* errors state for client */
  const [errorState, setErrorState] = useState<any>({} as any);

  /* global form validation boolean */
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  /* watch mode state */
  const [watchState, setWatchState] = useState<IForm[]>();

  /* init refs array */
  const { current } = useRef<any>([]);

  /* create form validation obj */
  const formInstance = new (Validate as any)(current);

  // useEffect(() => formInstance.checkAttrCombinations(), []);

  /* get existing errors */
  const existingErrors = useCallback(() => formInstance.validate(), [formInstance]);

  const handleErrors = useCallback(() => setIsFormValid(isEmptyPropertiesOf(existingErrors())), [
    setIsFormValid,
    existingErrors,
    isEmptyPropertiesOf,
  ]);

  useEffect(() => {
    handleErrors();
  }, []);

  useEffect(() => {
    console.log(formState);
  }, [formState]);

  const onBlur = useCallback(() => {
    handleErrors();
    watchMode();
  }, [handleErrors]);

  /* prevent user actions on specific cases */
  const preventAction = useCallback((event, ref) => {
    if (ref.attributes?._number?.value) {
      return utils.isNumberEvent(event);
    }
    if (parseInt(ref.attributes?._length?.value, 10) === ref.value?.length) {
      return event.keyCode !== 8 && event.preventDefault();
    }
    return ref;
  }, []);

  /* helper function to create name:value array */
  const createFormArrFrom = useCallback(arr => {
    const form: IForm[] = [];
    arr.forEach(({ value, name }: IForm) => form.push({ [name]: value }));
    return form;
  }, []);

  /* you can use watch mode to track form state changes while debugging */
  const watchMode = useCallback(() => setWatchState(createFormArrFrom(current[0])), [createFormArrFrom, setWatchState]);

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setErrorState(existingErrors());
    if (isFormValid) {
      setFormState(createFormArrFrom(current[0]));
    }
  };

  /* push registered inputs to refs array & handle events*/
  const _register = useCallback((ref: any) => {
    current.push([...ref].filter((item: any) => item.nodeName === 'INPUT'));

    [...ref]
      .filter((item: any) => item.nodeName === 'INPUT')
      .forEach((item: any) => {
        item.onblur = onBlur;
      });

    // console.log([...ref].filter((item: any) => item.nodeName === 'INPUT')[0].onblur);

    // ref.onblur = onBlur;
    ref.onsubmit = (event: SyntheticEvent) => onSubmit(event);
    //   ref.onkeydown = (event: IHTMLInputEvent) => preventAction(event, ref);
  }, []);

  /* submit function */
  const _handleSubmit = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      // setErrorState(existingErrors());
      if (isFormValid) {
        setFormState(createFormArrFrom(current));
      }
    },
    [isFormValid, createFormArrFrom, setFormState, setErrorState]
  );

  return { _handleSubmit, _register, watchState, formState, errorState };
}
