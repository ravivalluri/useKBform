import { useRef, useCallback, useEffect, useState } from 'react';

// validates email ,returns bool
function isValidEmail(email) {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

//returs array of items with required attribute
Array.prototype.hasRequiredAttr = function() {
  return this.filter(x => x.attributes.hasOwnProperty('_required'));
};

//returns array of items with email attribute
Array.prototype.hasEmailAttr = function() {
  return this.filter(x => x.attributes.hasOwnProperty('_email'));
};

//returns global form valid bool
Array.prototype.isValidForm = function() {
  return this.hasRequiredAttr().every(x => x.value !== '');
};

//validate form
Array.prototype.hasValidated = function() {
  const errors = {};
  const emailErrors = {};

  this.hasRequiredAttr().forEach(({ name, value }) => {
    if (value === '') errors[name] = 'this field is required';
  });

  this.hasEmailAttr().forEach(({ name, value }) => {
    if (!isValidEmail(value)) emailErrors[name] = 'email is not valid';
  });

  return { errors, emailErrors };
};

export default function useForm() {
  const [formState, setFormState] = useState();
  const [errorState, setErrorState] = useState({});
  const [isFormValid, setFormValid] = useState(false);

  const { current } = useRef([]);

  const _register = useCallback(ref => current.push(ref), []);

  useEffect(() => {
    // console.log(current.hasEmailAttr().filter(x => isValidForm(x.value)));
  }, []);

  // useEffect(() => {
  //   console.log(errorState);
  // }, [errorState]);

  const _onBlur = useCallback(() => {
    const isValid = current.isValidForm();
    setFormValid(isValid);
  }, []);

  const handleErrors = useCallback(() => {
    const { errors, emailErrors } = current.hasValidated();
    setErrorState({ errors, emailErrors });
    // console.log(errors, emailErrors);
  }, []);

  const handleForm = useCallback(() => {
    const form = [];
    current.forEach(({ value, name, type }) => {
      if (isFormValid) {
        form.push({ value, name, type });
        setFormState(form);
      }
    });
  }, [isFormValid]);

  const _handleSubmit = useCallback(
    e => {
      e.preventDefault();
      handleErrors();
      handleForm();
    },
    [handleForm, handleErrors]
  );

  return { _handleSubmit, _register, _onBlur, formState, errorState };
}
