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
    _formname?: string;
  }
}

interface IUseKBform {
  _register(ref: any): void;
  _handleSubmit(event: SyntheticEvent): void;
  watchState?: IFormData[];
  formState?: IFormData[];
  errorState?: any;
  formStatus?: any;
}

export default function useKBform(): IUseKBform {
  /* validated form state for client */
  const [formState, setFormState] = useState<IFormData[]>();

  /* errors state for client */
  const [errorState, setErrorState] = useState<any>({} as any);

  /* watch mode state */
  const [watchState, setWatchState] = useState<IFormData[]>();

  /* status of each form to be sent to client */
  const [formStatus, setFormStatus] = useState<any>();

  /* init refs array */
  const { current } = useRef<any[]>([]);

  // useEffect(() => formInstance.checkAttrCombinations(), []);

  //   useEffect(() => {
  //     console.log(formStatus);
  //   }, [formStatus]);

  /* get existing errors */
  const existingErrors = useCallback(formInstance => formInstance.validate(), []);

  /* helper function to find ref by node name */
  const filterRefsFrom = useCallback(
    (refs: any, refType: string) => [...refs].filter((item: any) => item.nodeName === refType),
    []
  );

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

  /* helper function to create form objects with the value of  { [name] : value } input */
  const createFormObjects = useCallback(() => {
    const formObjectsArr = [] as any;

    for (let form = 0; form < current.length; form++) {
      for (let el = 0; el < current[form]?.length; el++) {
        if (current[form][el].nodeName === 'INPUT') {
          formObjectsArr.push({ [current[form].attributes._formname.value]: current[form][el] });
        }
      }
    }

    const formState = formObjectsArr.reduce((acc, currentForm) => {
      for (let formName in currentForm) {
        if (!acc[formName]) acc[formName] = [];
        acc[formName].push({ [currentForm[formName].name]: currentForm[formName].value });
      }
      return acc;
    }, {});

    return formState;
  }, []);

  /* you can use watch mode to track form state changes while debugging */
  const watchMode = useCallback(() => setWatchState(createFormObjects()), [setWatchState, createFormObjects]);

  const onClick = useCallback(
    form => {
      const formInstance = new (Validate as any)(filterRefsFrom(form, 'INPUT'));
      setErrorState(existingErrors(formInstance));
      if (isEmptyPropertiesOf(existingErrors(formInstance))) {
        setFormStatus({ [form.attributes._formname.value]: 'clean' });
      }

      watchMode();
    },
    [filterRefsFrom, setErrorState, existingErrors, setFormStatus, watchMode]
  );

  const _register = useCallback((formRef: any) => {
    current.push(formRef);

    for (let form = 0; form < current.length; form++) {
      for (let el = 0; el < current[form]?.length; el++) {
        if (current[form][el].nodeName === 'BUTTON') {
          current[form][el].onclick = () => onClick(current[form]);
        }
        current[form].onsubmit = (event: any) => event.preventDefault();
      }
    }

    // filterInputRefsFrom(formRef).forEach((input: any) => {
    //   input.onblur = onBlur;
    //   input.onkeydown = (event: IHTMLInputEvent) => preventAction(event, formRef);
    // });
  }, []);

  /* submit function */
  const _handleSubmit = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();

      if (isEmptyPropertiesOf(errorState)) {
        setFormState(createFormObjects());
      }
    },
    [setFormState, errorState, createFormObjects]
  );

  return { _register, watchState, formState, errorState, formStatus, _handleSubmit };
}
