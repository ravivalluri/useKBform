import { useRef, useCallback, useEffect, useState } from 'react';

/* Utils starts*/

/* function to check that provided value is number */
function isNumber(num) {
  return isNaN(num);
}

/* function to check that provided value is not empty */
function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

/* function to check email validity */
function isValidEmail(email) {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

/* function to check PIN validity */
function isValidPin(pin) {
  let regex = /^[\w!o!O!_]{7}$/;
  return regex.test(String(pin));
}

/* function to check PAN validity ,Luhn algorithm */
function isValidPan(pan) {}

/* Utils ends*/

/* returns array of inputs with given attribute */
Array.prototype.hasAttribute = function(attr) {
  return this.filter(x => x.attributes.hasOwnProperty(attr));
};

/* returns true if each object in array is empty */
Array.prototype.hasEmptyProperties = function() {
  return this.every(item => Object.getOwnPropertyNames(item).length === 0);
};

/* validate form */
Array.prototype.hasValidated = function() {
  const emptyFieldValidationErrors = {};
  const emailValidationErrors = {};
  const numberValidationErrors = {};
  const pinValidationErrors = {};

  this.hasAttribute('_required').forEach(({ name, value }) => {
    if (isEmpty(value)) emptyFieldValidationErrors[name] = 'this field is required';
  });

  this.hasAttribute('_email').forEach(({ name, value }) => {
    if (!isValidEmail(value)) emailValidationErrors[name] = 'email is not valid';
  });

  this.hasAttribute('_number').forEach(({ name, value }) => {
    if (isNumber(value)) numberValidationErrors[name] = 'this value is not number';
  });

  this.hasAttribute('_pin').forEach(({ name, value }) => {
    if (!isValidPin(value)) pinValidationErrors[name] = 'this pin is not valid';
  });

  return { emptyFieldValidationErrors, emailValidationErrors, numberValidationErrors, pinValidationErrors };
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
    console.log(isFormValid);
  }, [isFormValid]);

  const _onBlur = useCallback(() => {
    const errors = current.hasValidated();
    const isErrorsEmpty = Object.keys(errors)
      .map(key => errors[key])
      .hasEmptyProperties();

    setFormValid(isErrorsEmpty);
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
      handleErrors();
      handleForm();
    },
    [handleForm, handleErrors]
  );

  return { _handleSubmit, _register, _onBlur, formState, errorState };
}
