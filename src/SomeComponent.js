import React, { useEffect, useState, useContext, useRef } from 'react';
import useFetch from './hooks/useFetch';
import useForm from './hooks/useForm';

export default function SomeComponent() {
  // const [data] = useFetch('https://jsonplaceholder.typicode.com/posts');
  const { _handleSubmit, _register, watchState, formState, errorState } = useForm();

  useEffect(() => {
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
          name="password"
          _required="true"
          // _password="true"
          // _number="true"
          // _min="5"
          // _max="10"
          // _minlength="3"
          // _maxlength="5"
          // _length="6"
          // _email="true"
          // _amount="true"
          // _pan="true"
          // _pin="true"
          defaultValue={'this is a default value'}
        />
        {errorState.password}
        <input
          ref={_register}
          name="password_repeat"
          // _passwordrepeat="true"
          // _required="true"
          // _number="true"
          // defaultValue={formState.value.field.text}
        />
        {errorState.password_repeat}
        <input
          ref={_register}
          name="lastname"
          // _required="true"
          // defaultValue={formState.value.field.text}
        />
        {errorState.lastname}
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
