import { useRef, useCallback, useEffect, useState } from 'react';

/* Utils starts*/

function Utils() {}

/* method to check that provided value is number */
Utils.prototype.isNumber = function(num) {
  let regex = /^\d+$/;
  return regex.test(String(num));
};

/* method to check email validity */
Utils.prototype.isValidEmail = function(email) {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email));
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
Utils.prototype.isValidPhone = function(phone) {
  let regex = /^^((\+994)|0)((12[3-5]\d{6})|(((40)|(5[015])|(7[07]))[1-9]\d{6}))$/;
  return regex.test(String(phone));
};

/* method to check password strength */
Utils.prototype.isStrongPassword = function(password) {
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return regex.test(String(password));
};

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

/* returns true if each object in array is empty */
Array.prototype.hasEmptyProperties = function() {
  return this.every(item => Object.getOwnPropertyNames(item).length === 0);
};

/* core validate ctor function */
function Validate(array) {
  this.array = array;
}

/* returns array of inputs with given attribute */
Validate.prototype.hasAttribute = function(attr) {
  return this.array.filter(x => x.attributes.hasOwnProperty(attr));
};

/* method for validating form */
Validate.prototype.hasValidated = function() {
  const errors = {};

  this.hasAttribute('_required').forEach(({ name, value }) => {
    if (utils.isEmpty(value)) {
      errors[name] = {};
      errors[name] = 'this field is required';
    }
  });

  this.hasAttribute('_email').forEach(({ name, value }) => {
    if (!utils.isValidEmail(value)) {
      errors[name] = {};
      errors[name] = 'this email is not valid';
    }
  });

  this.hasAttribute('_number').forEach(({ name, value }) => {
    if (!utils.isNumber(value)) {
      errors[name] = {};
      errors[name] = 'this value is not number';
    }
  });

  this.hasAttribute('_min').forEach(({ name, value, attributes }) => {
    if (value < parseInt(attributes._min.value)) {
      errors[name] = {};
      errors[name] = `min ${attributes._min.value} required`;
    }
  });

  this.hasAttribute('_max').forEach(({ name, value, attributes }) => {
    if (value > parseInt(attributes._max.value)) {
      errors[name] = {};
      errors[name] = `max ${attributes._max.value} allowed`;
    }
  });

  this.hasAttribute('_minlength').forEach(({ name, value, attributes }) => {
    if (value.length < parseInt(attributes._minlength.value)) {
      errors[name] = {};
      errors[name] = `min length ${attributes._minlength.value} required`;
    }
  });

  this.hasAttribute('_maxlength').forEach(({ name, value, attributes }) => {
    if (value.length > parseInt(attributes._maxlength.value)) {
      errors[name] = {};
      errors[name] = `max length ${attributes._maxlength.value} allowed`;
    }
  });

  this.hasAttribute('_length').forEach(({ name, value, attributes }) => {
    if (value.length !== parseInt(attributes._length.value)) {
      errors[name] = {};
      errors[name] = `required length is ${attributes._length.value} `;
    }
  });

  this.hasAttribute('_pin').forEach(({ name, value }) => {
    if (!utils.isValidPin(value)) {
      errors[name] = {};
      errors[name] = 'this pin is not valid';
    }
  });

  this.hasAttribute('_amount').forEach(({ name, value }) => {
    if (!utils.isValidAmount(value)) {
      errors[name] = {};
      errors[name] = 'this amount is not valid';
    }
  });

  this.hasAttribute('_pan').forEach(({ name, value }) => {
    if (!utils.isValidPan(value)) {
      errors[name] = {};
      errors[name] = 'this pan is not valid';
    }
  });

  this.hasAttribute('_phone').forEach(({ name, value }) => {
    if (!utils.isValidPhone(value)) {
      errors[name] = {};
      errors[name] = 'this phone number is not valid';
    }
  });

  /* TODO refactor */
  const arr = [...this.hasAttribute('_password'), ...this.hasAttribute('_passwordrepeat')];

  if (arr.length !== 0) {
    let password;
    let passwordRepeat;
    let sname;

    this.hasAttribute('_password').forEach(({ value, name }) => {
      if (!utils.isStrongPassword(value)) {
        errors[name] = {};
        errors[name] = 'passwords is not strong';
      } else password = value;
    });

    this.hasAttribute('_passwordrepeat').forEach(({ name, value }) => {
      passwordRepeat = value;
      sname = name;
    });

    if (password !== passwordRepeat) {
      errors[sname] = {};
      errors[sname] = 'passwords does not match';
    }
  }

  return errors;
};

export default function useForm() {
  /* validated form state for client */
  const [formState, setFormState] = useState();

  /* errors state for client */
  const [errorState, setErrorState] = useState({});

  /* global form validation boolean */
  const [isFormValid, setFormValid] = useState(false);

  /* watch mode state */
  const [watchState, setWatchState] = useState();

  /* init refs array */
  const { current } = useRef([]);

  const validate = new Validate(current);

  useEffect(() => {
    console.log(errorState);
  }, [errorState]);

  // useEffect(() => {
  //   console.log(current);
  // }, []);

  const errorHandlingUtil = useCallback(() => {
    const errors = validate.hasValidated();
    const isErrorsEmpty = Object.keys(errors)
      .map(key => errors[key])
      .hasEmptyProperties();

    setErrorState(errors);
    setFormValid(isErrorsEmpty);
  }, [setErrorState, setFormValid]);

  const handleDefaultValue = useCallback(() => {
    current.forEach(({ defaultValue, name, value }) => {
      if (defaultValue) {
        errorHandlingUtil();
        console.log(value, name);
      }
    });
  }, [errorHandlingUtil]);

  useEffect(() => handleDefaultValue(), [handleDefaultValue]);

  const onBlur = useCallback(() => {
    errorHandlingUtil();
    watchMode();
  }, [errorHandlingUtil]);

  /* push registered inputs to refs array */
  const _register = useCallback(
    ref => {
      current.push(ref);
      ref.onblur = onBlur;
    },
    [onBlur]
  );

  const createFormArr = useCallback(arr => {
    const form = [];
    arr.forEach(({ value, name }) => form.push({ value, name }));
    return form;
  }, []);

  /* you can use watch mode to track form state changes while debugging */
  const watchMode = useCallback(() => setWatchState(createFormArr(current)), [createFormArr]);

  const _handleSubmit = useCallback(
    e => {
      e.preventDefault();
      if (isFormValid) setFormState(createFormArr(current));
    },
    [isFormValid, createFormArr]
  );

  return { _handleSubmit, _register, watchState, formState, errorState };
}
