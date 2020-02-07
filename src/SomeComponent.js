import React, { useEffect, useState, useContext, useRef } from 'react';
import useFetch from './hooks/useFetch';
import useForm from './hooks/useForm';

export default function SomeComponent() {
  // const [data] = useFetch('https://jsonplaceholder.typicode.com/posts');
  const { _handleSubmit, _register, watchState, formState, errorState } = useForm();

  useEffect(() => {
    /* temp condition */
    if (formState !== undefined) {
      console.log(formState);
    }
  }, [formState]);

  // useEffect(() => {
  //   console.log(watchState);
  // }, [watchState]);

  return (
    <div>
      <form onSubmit={_handleSubmit}>
        <input
          ref={_register}
          name="name"
          _required="true"
          // _number="true"
          // _min="5"
          // _max="10"
          // _password="true"
          // _minlength="3"
          // _maxlength="5"
          // _length="6"
          // _email="true"
          // _amount="true"
          // _pan="true"
          // _pin="true"
          // defaultValue={'default 1'}
        />
        {errorState.name}
        <input
          ref={_register}
          name="surname"
          _required="true"
          // _number="false"
          // _min="5"
          // _max="10"
          // _passwordrepeat="true"
          // _minlength="3"
          // _maxlength="5"
          // _length="6"
          // _email="true"
          // _amount="true"
          // _pan="true"
          // _pin="true"
          // defaultValue={'default 1'}
        />
        {errorState.surname}
        {/* <input
          ref={_register}
          name="lastname"
          // _required="true"
          _number="false"
          // _min="5"
          // _max="10"
          // _password="true"
          // _minlength="3"
          // _maxlength="5"
          // _length="6"
          // _email="true"
          // _amount="true"
          // _pan="true"
          // _pin="true"
          // defaultValue={'default 1'}
        />
        {errorState.requiredErrors?.lastname ||
          errorState.numErrors?.lastname ||
          errorState.minNumErrors?.lastname ||
          errorState.maxNumErrors?.lastname ||
          errorState.emailErrors?.lastname} */}
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
