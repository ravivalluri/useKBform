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

  /* init refs array */
  const { current } = useRef<ICurrent[]>([]);

  useEffect(() => {
    // console.log(current);
  }, []);

  /* get existing errors */
  const existingErrors = useCallback(formInstance => formInstance.validate(), []);

  /* helper function to find refs array by node name */
  const filterRefsArrFrom = useCallback(
    (refs: any, nodeName: string) => [...refs].filter((item: any) => item.nodeName === nodeName),
    []
  );

  /* helper function to filter elements by node name */
  const filterByNodeName = useCallback((currentFormEl: ICurrent, nodeName: string) => {
    return currentFormEl?.nodeName === nodeName;
  }, []);

  const createDirtyFormObjectsArr = useCallback(() => {
    const formObjectsArr = [] as any;

    for (let form = 0; form < current.length; form++) {
      for (let el = 0; el < current[form]?.length; el++) {
        if (filterByNodeName(current[form][el], 'INPUT')) {
          formObjectsArr.push({ [current[form].attributes._formname.value]: current[form][el] });
        }
      }
    }

    return formObjectsArr;
  }, []);

  /* helper function to create form objects with the value of  { [name] : value } input */
  const createCleanFormObjectsArr = useCallback(() => {
    const formState = createDirtyFormObjectsArr().reduce((acc: ICurrent, currentForm: ICurrent) => {
      for (const formName in currentForm) {
        if (!acc[formName]) {
          acc[formName] = [];
        }

        acc[formName].push({ [currentForm[formName].name]: currentForm[formName].value });
      }
      return acc;
    }, {});

    return formState;
  }, [createDirtyFormObjectsArr]);

  /* you can use watch mode to track form state changes while debugging */
  const watchMode = useCallback(() => setWatchState(createCleanFormObjectsArr()), [setWatchState, createCleanFormObjectsArr]);

  const onClick = useCallback(
    (form: ICurrent) => {
      const formInstance = new (Validate as any)(filterRefsArrFrom(form, 'INPUT'));

      setErrorState(existingErrors(formInstance));

      if (isEmptyPropertiesOf(existingErrors(formInstance))) {
        setFormStatus({ [form.attributes._formname.value]: 'success' });
      }

      watchMode();
    },
    [filterRefsArrFrom, setErrorState, existingErrors, setFormStatus, watchMode]
  );

  /* prevent user actions on keydown*/
  const onKeyDown = useCallback((event: any, currentFormEl: ICurrent) => {
    if (currentFormEl.attributes?._number?.value) {
      return utils.isNumberEvent(event);
    }

    if (parseInt(currentFormEl.attributes?._length?.value, 10) === currentFormEl.value?.length) {
      if (event.keyCode !== 8) {
        event.preventDefault();
      }
    }
  }, []);

  const _register = useCallback(
    (formRef: ICurrent) => {
      current.push(formRef);

      for (let form = 0; form < current.length; form++) {
        for (let el = 0; el < current[form]?.length; el++) {
          if (filterByNodeName(current[form][el], 'BUTTON')) {
            current[form][el].onclick = () => onClick(current[form]);
          }

          if (filterByNodeName(current[form][el], 'INPUT')) {
            current[form][el].onkeydown = (event: IHTMLInputEvent) => onKeyDown(event, current[form][el]);
          }
        }
        current[form].onsubmit = (event: IHTMLInputEvent) => event.preventDefault();
      }
    },
    [filterByNodeName, onKeyDown, onClick]
  );

  /* submit function */
  const _handleSubmit = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();

      if (isEmptyPropertiesOf(errorState)) {
        setFormState(createCleanFormObjectsArr());
      }
    },
    [setFormState, errorState, createCleanFormObjectsArr]
  );

  return { _register, watchState, formState, errorState, formStatus, _handleSubmit };
}
