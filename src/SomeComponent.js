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

  // useEffect(() => {
  //   console.log(errorState);
  // }, [errorState]);

  return (
    <div>
      <form onSubmit={_handleSubmit}>
        <input
          ref={_register}
          onBlur={_onBlur}
          _required="true"
          // _email="true"
          _pin="true"
          name="name"
          // defaultValue={formState.value.field.text}
        />
        {errorState.emptyFieldValidationErrors?.name ||
          errorState.emailValidationErrors?.name ||
          errorState.numberValidationErrors?.name ||
          errorState.pinValidationErrors?.name}
        <input
          ref={_register}
          onBlur={_onBlur}
          name="surname"
          // _number="true"
          // defaultValue={formState.value.field.text}
        />
        {errorState.emptyFieldValidationErrors?.surname ||
          errorState.emailValidationErrors?.surname ||
          errorState.numberValidationErrors?.surname}
        <input
          ref={_register}
          onBlur={_onBlur}
          name="lastname"
          // _isrequired="true"
          // defaultValue={formState.value.field.text}
        />
        {errorState.emptyFieldValidationErrors?.lastname ||
          errorState.emailValidationErrors?.lastname ||
          errorState.numberValidationErrors?.lastname}
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
