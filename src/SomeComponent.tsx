import React, { useEffect, useState, useContext, useRef } from 'react';
import useKBform from './hooks/useKBform/src/useKBform';

export default function SomeComponent() {
  const { _handleSubmit, _register, watchState, formState, errorState } = useKBform();

  useEffect(() => {
    /* temp condition */
    if (formState !== undefined) {
      console.log(formState);
    }
  }, [formState]);

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
          // _panbasic="true"
          // _pin="true"
          // defaultValue={'default 1'}
        />
        {errorState.name}
        <input
          ref={_register}
          name="surname"
          // _required="true"
          // _number="true"
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
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
