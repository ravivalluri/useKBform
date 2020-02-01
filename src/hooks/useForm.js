import { useRef, useCallback, useEffect, useState } from 'react';

/* Utils starts*/

function Utils() {}

/* method to check that provided value is number */
Utils.prototype.isNumber = function(num) {
  return isNaN(num);
};

/* method to check email validity */
Utils.prototype.isValidEmail = function(email) {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

/* method to check that provided value is not empty */
Utils.prototype.isEmpty = function(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

/* method to check PIN validity */
Utils.prototype.isValidPin = function(pin) {
  let regex = /^[\w!o!O!_]{7}$/;
  return regex.test(String(pin));
};

/* method to check amount validity */
Utils.prototype.isValidAmount = function(amount) {
  let regex = /^[\d]+[\.][\d]{2}$/;
  return regex.test(String(amount));
};

/* method to check phone validity */
Utils.prototype.isValidPhone = function(phone) {};

/* method to check PAN validity ,Luhn algorithm */
Utils.prototype.isValidPan = function(pan) {
  if (/[^0-9-\s]+/.test(pan)) return false;

  let nCheck = 0,
    bEven = false;
  pan = pan.replace(/\D/g, '');

  for (let n = pan.length - 1; n >= 0; n--) {
    let cDigit = pan.charAt(n),
      nDigit = parseInt(cDigit, 10);

    if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 == 0;
};

const utils = Object.create(Utils.prototype);

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
  const errors = {};

  this.hasAttribute('_required').forEach(({ name, value }) => {
    if (utils.isEmpty(value)) {
      delete errors[name];
      errors[name] = 'this field is required';
    }
  });

  this.hasAttribute('_email').forEach(({ name, value }) => {
    if (!utils.isValidEmail(value)) {
      delete errors[name];
      errors[name] = 'this email is not valid';
    }
  });

  this.hasAttribute('_number').forEach(({ name, value }) => {
    if (utils.isNumber(value)) {
      delete errors[name];
      errors[name] = 'this value is not number';
    }
  });

  this.hasAttribute('_minlength').forEach(({ name, value, attributes }) => {
    if (value.length < parseInt(attributes._minlength.value)) {
      delete errors[name];
      errors[name] = `min length ${attributes._minlength.value} required`;
    }
  });

  this.hasAttribute('_maxlength').forEach(({ name, value, attributes }) => {
    if (value.length > parseInt(attributes._maxlength.value)) {
      delete errors[name];
      errors[name] = `max length ${attributes._maxlength.value} allowed`;
    }
  });

  this.hasAttribute('_length').forEach(({ name, value, attributes }) => {
    if (value.length !== parseInt(attributes._length.value)) {
      delete errors[name];
      errors[name] = `required length is ${attributes._length.value} `;
    }
  });

  this.hasAttribute('_pin').forEach(({ name, value }) => {
    if (!utils.isValidPin(value)) {
      delete errors[name];
      errors[name] = 'this pin is not valid';
    }
  });

  this.hasAttribute('_amount').forEach(({ name, value }) => {
    if (!utils.isValidAmount(value)) {
      delete errors[name];
      errors[name] = 'this amount is not valid';
    }
  });

  this.hasAttribute('_pan').forEach(({ name, value }) => {
    if (!utils.isValidPan(value)) {
      delete errors[name];
      errors[name] = 'this pan is not valid';
    }
  });

  return errors;
};

export default function useForm() {
  const [formState, setFormState] = useState();
  const [errorState, setErrorState] = useState({});
  const [isFormValid, setFormValid] = useState(false);
  const { current } = useRef([]);

  const _register = useCallback(ref => current.push(ref), []);

  useEffect(() => {
    console.log(errorState);
  }, [errorState]);

  useEffect(() => {
    // console.log(current.hasAttribute('_min'));
    // console.log();
  }, [current]);

  //TODO insert _onblur function to every refs onblur event
  const _onBlur = useCallback(() => {
    const errors = current.hasValidated();
    const isErrorsEmpty = Object.keys(errors)
      .map(key => errors[key])
      .hasEmptyProperties();

    setErrorState(errors);
    setFormValid(isErrorsEmpty);
  }, []);

  const _handleSubmit = useCallback(
    e => {
      e.preventDefault();
      const form = [];
      current.forEach(({ value, name }) => {
        if (isFormValid) {
          form.push({ value, name });
          setFormState(form);
        }
      });
    },
    [isFormValid]
  );

  return { _handleSubmit, _register, _onBlur, formState, errorState };
}
