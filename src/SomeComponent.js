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
          // _number="true"
          _minlength="3"
          _maxlength="5"
          // _length="6"
          // _email="true"
          // _amount="true"
          // _pan="true"
          // _pin="true"
          name="name"
          // defaultValue={formState.value.field.text}
        />
        {errorState.name}
        <input
          ref={_register}
          onBlur={_onBlur}
          name="surname"
          // _required="true"
          // _number="true"
          // defaultValue={formState.value.field.text}
        />
        {errorState.surname}
        <input
          ref={_register}
          onBlur={_onBlur}
          name="lastname"
          // _isrequired="true"
          // defaultValue={formState.value.field.text}
        />
        {errorState.lastname}
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
