/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /* Author Rustam Islamov ,not all rights reserved :) */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */
/*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */ /*  */

import { useRef, useCallback, useEffect, useState } from 'react';
import utils from './utils/utils';
import { WatchState, ErrorState, FormState, Current, Form } from './types/types';
import isEmptyPropertiesOf from './helpers/isEmptyPropertiesOf';
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

export default function useKBform() {
  /* validated form state for client */
  const [formState, setFormState] = useState<FormState>();

  /* errors state for client */
  const [errorState, setErrorState] = useState<ErrorState>(<any>{});

  /* global form validation boolean */
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  /* watch mode state */
  const [watchState, setWatchState] = useState<WatchState>();

  /* init refs array */
  const { current } = useRef<Current[]>([]);

  /* create form validation obj */
  const form = new (Validate as any)(current);

  useEffect(() => form.checkAttrCombinations(), []);

  /* get existing errors */
  const existingErrors = useCallback(() => form.validate(), []);

  const handleErrors = useCallback(() => setIsFormValid(isEmptyPropertiesOf(existingErrors())), [
    setIsFormValid,
    existingErrors,
    isEmptyPropertiesOf,
  ]);

  useEffect(() => handleErrors(), [handleErrors]);

  const onKeyUp = useCallback(() => {
    handleErrors();
    watchMode();
  }, [handleErrors]);

  /* prevent user actions on specific cases */
  const preventAction = useCallback((event, ref) => {
    if (ref.attributes?._number?.value) return utils.isNumberEvent(event);
    if (parseInt(ref.attributes?._length?.value) === ref.value?.length) event.keyCode !== 8 && event.preventDefault();
    return ref;
  }, []);

  /* helper function to create name:value array */
  const createFormArrFrom = useCallback(arr => {
    const form: FormState = [];
    arr?.forEach(({ value, name }: Form) => form.push({ [name]: value }));
    return form;
  }, []);

  /* you can use watch mode to track form state changes while debugging */
  const watchMode = useCallback(() => setWatchState(createFormArrFrom(current)), [createFormArrFrom, setWatchState]);

  /* push registered inputs to refs array & handle events*/
  const _register = useCallback(
    (ref?) => {
      current?.push(ref);
      ref.onkeyup = onKeyUp;
      ref.onkeydown = (event: any) => preventAction(event, ref);
    },
    [onKeyUp, preventAction]
  );

  /* submit function */
  const _handleSubmit = useCallback(
    event => {
      event.preventDefault();
      setErrorState(existingErrors());
      if (isFormValid) setFormState(createFormArrFrom(current));
    },
    [isFormValid, createFormArrFrom, setFormState, setErrorState, existingErrors]
  );

  return { _handleSubmit, _register, watchState, formState, errorState };
}
