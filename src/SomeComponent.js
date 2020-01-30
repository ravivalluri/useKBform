import React, { useEffect, useState, useContext, useRef } from 'react';
import useFetch from './hooks/useFetch';
import useForm from './hooks/useForm';

export default function SomeComponent() {
  // const [data] = useFetch('https://jsonplaceholder.typicode.com/posts');
  const { _handleSubmit, _register, _onBlur, formState, errorState } = useForm();

  useEffect(() => {
    if (formState !== undefined) {
      console.log(formState);
    }
  }, [formState]);

  useEffect(() => {
    console.log(errorState);
  }, [errorState]);

  return (
    <div>
      <form onSubmit={_handleSubmit}>
        <input
          type="text"
          ref={_register}
          onBlur={_onBlur}
          _required="true"
          _email="true"
          name="name"
          // defaultValue={formState.value.field.text}
        />
        {errorState.errors?.name || errorState.emailErrors?.name}
        <input
          type="text"
          ref={_register}
          onBlur={_onBlur}
          name="surname"
          // defaultValue={formState.value.field.text}
        />
        {errorState.surname && 'surname is required'}
        <input
          type="text"
          ref={_register}
          onBlur={_onBlur}
          name="lastname"
          // _isrequired="true"
          // defaultValue={formState.value.field.text}
        />
        {errorState.lastname && 'lastname is required'}
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
