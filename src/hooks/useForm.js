import { useRef, useCallback, useEffect, useState } from 'react';

function isValidForm(email) {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

Array.prototype.hasRequiredAttr = function() {
  return this.filter(x => x.attributes.hasOwnProperty('_required'));
};

Array.prototype.hasEmailAttr = function() {
  return this.filter(x => x.attributes.hasOwnProperty('_email'));
};

Array.prototype.isValidForm = function() {
  return this.hasRequiredAttr().every(item => item.value !== '');
};

Array.prototype.hasValidated = function() {
  const errors = {};
  this.hasRequiredAttr().map(({ name, value }) => {
    if (value === '') errors[name] = true;
  });
  // .hasRequiredAttr()
  // .map(({ name, value }) => {
  //   if (value === '') errors[name] = true;
  // });
  return errors;
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

  useEffect(() => {
    // console.log(current);
  }, []);

  const _onBlur = useCallback(() => {
    const isValid = current.isValidForm();
    setFormValid(isValid);
  }, []);

  const handleErrors = useCallback(() => {
    const errors = current.hasValidated();
    setErrorState(errors);
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
      handleForm();
      handleErrors();
    },
    [handleForm, handleErrors]
  );

  return { _handleSubmit, _register, _onBlur, formState, errorState };
}
