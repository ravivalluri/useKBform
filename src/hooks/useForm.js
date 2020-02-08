import { useRef, useCallback, useEffect, useState } from 'react';

/* Utils starts*/

function Utils() {}

/* method to check that provided value is number */
Utils.prototype.isNumber = function(num) {
  let regex = /^\d+$/;
  return regex.test(String(num.trim()));
};

/* method to check that typed event is number */
Utils.prototype.isNumberEvent = function(event) {
  event = event ? event : window.event;
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  return true;
};

/* method to check email validity */
Utils.prototype.isValidEmail = function(email) {
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email.trim()));
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
  return regex.test(String(pin.trim()));
};

/* method to check amount validity */
Utils.prototype.isValidAmount = function(amount) {
  let regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(String(amount.trim()));
};

/* method to check phone validity */
Utils.prototype.isValidPhone = function(phone) {
  let regex = /^^((\+994)|0)((12[3-5]\d{6})|(((99)|(5[015])|(7[07]))[1-9]\d{6}))$/;
  return regex.test(String(phone.trim()));
};

/* method to check password strength */
Utils.prototype.isStrongPassword = function(password) {
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return regex.test(String(password.trim()));
};

/* method to check PAN validity without Luhn algorithm */
Utils.prototype.isValidPanBasic = function(pan) {
  let regex = /^(\d{16}|\d{19})?$/;
  return regex.test(String(pan.trim()));
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
// Array.prototype.hasEmptyProperties = function() {
//   return this.every(item => Object.getOwnPropertyNames(item).length === 0);
// };

/* returns true if each property in object is empty */
function isEmptyPropertiesOf(obj) {
  return Object.values(obj).every(item => utils.isEmpty(item));
}

/* core validate ctor function */
function Validate(array) {
  this.array = array;
}

/* returns array of inputs with given attribute */
Validate.prototype.hasAttribute = function(attr) {
  return this.array.filter(x => x.attributes.hasOwnProperty(attr));
};

/* method for validating form */
Validate.prototype.validate = function() {
  const errors = {};

  this.hasAttribute('_required').forEach(({ name, value }) => {
    if (utils.isEmpty(value)) errors[name] = 'this field is required';
    else errors[name] = '';
  });

  this.hasAttribute('_number').forEach(({ name, value }) => {
    if (!utils.isEmpty(value)) {
      if (!utils.isNumber(value)) errors[name] = 'this value is not number';
      errors[name] = '';
    }
  });

  this.hasAttribute('_email').forEach(({ name, value }) => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidEmail(value)) errors[name] = 'this email is not valid';
      else errors[name] = '';
    }
  });

  this.hasAttribute('_min').forEach(({ name, value, attributes }) => {
    if (!utils.isEmpty(value)) {
      if (value < parseInt(attributes._min.value)) errors[name] = `min ${attributes._min.value} required`;
      else errors[name] = '';
    }
  });

  this.hasAttribute('_max').forEach(({ name, value, attributes }) => {
    if (!utils.isEmpty(value)) {
      if (value > parseInt(attributes._max.value)) errors[name] = `max ${attributes._max.value} allowed`;
      else errors[name] = '';
    }
  });

  this.hasAttribute('_minlength').forEach(({ name, value, attributes }) => {
    if (!utils.isEmpty(value)) {
      if (value.length < parseInt(attributes._minlength.value))
        errors[name] = `min length ${attributes._minlength.value} required`;
      else errors[name] = '';
    }
  });

  this.hasAttribute('_maxlength').forEach(({ name, value, attributes }) => {
    if (!utils.isEmpty(value)) {
      if (value.length > parseInt(attributes._maxlength.value))
        errors[name] = `max length ${attributes._maxlength.value} allowed`;
      else errors[name] = '';
    }
  });

  this.hasAttribute('_length').forEach(({ name, value, attributes }) => {
    if (!utils.isEmpty(value)) {
      if (value.length !== parseInt(attributes._length.value)) errors[name] = `required length is ${attributes._length.value} `;
      else errors[name] = '';
    }
  });

  this.hasAttribute('_pin').forEach(({ name, value }) => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidPin(value)) errors[name] = 'this pin is not valid';
      else errors[name] = '';
    }
  });

  this.hasAttribute('_amount').forEach(({ name, value }) => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidAmount(value)) errors[name] = 'this amount is not valid';
      else errors[name] = '';
    }
  });

  this.hasAttribute('_pan').forEach(({ name, value }) => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidPan(value)) errors[name] = 'this pan is not valid';
      else errors[name] = '';
    }
  });

  this.hasAttribute('_panbasic').forEach(({ name, value }) => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidPanBasic(value)) errors[name] = 'this pan is not valid';
      else errors[name] = '';
    }
  });

  this.hasAttribute('_phone').forEach(({ name, value }) => {
    if (!utils.isEmpty(value)) {
      if (!utils.isValidPhone(value)) errors[name] = 'this phone number is not valid';
      else errors[name] = '';
    }
  });

  /* TODO refactor */
  const arr = [...this.hasAttribute('_password'), ...this.hasAttribute('_passwordrepeat')];

  if (arr.length) {
    let password;
    let passwordRepeat;
    let sname;

    this.hasAttribute('_password').forEach(({ value, name }) => {
      if (!utils.isEmpty(value)) {
        if (!utils.isStrongPassword(value)) errors[name] = 'passwords is not strong';
        else {
          password = value;
          errors[name] = '';
        }
      }
    });

    this.hasAttribute('_passwordrepeat').forEach(({ name, value }) => {
      if (!utils.isEmpty(password)) {
        if (!utils.isEmpty(value)) {
          passwordRepeat = value;
          sname = name;
        } else errors[name] = 'please provide password repeat';
      }
    });

    if (password !== passwordRepeat) errors[sname] = 'passwords does not match';
    else errors[sname] = '';
  }

  return errors;
};

/*  */
Validate.prototype.checkAttrCombinations = function() {
  this.array.forEach(({ attributes }) => {
    if (attributes._number && attributes._email) throw new Error(`you cant use _number with _email ,are you crazy?`);
    if (attributes._number && attributes._password) throw new Error(`you cant use _number with _password ,are you crazy?`);
    if (attributes._number && attributes._passwordrepeat)
      throw new Error(`you cant use _number with _passwordrepeat ,are you crazy?`);
    if (attributes._number && attributes._amount) throw new Error(`you cant use _number with _amount ,are you crazy?`);
    if (attributes._number && attributes._pan) throw new Error(`you cant use _number with _pan ,are you crazy?`);
    if (attributes._number && attributes._panbasic) throw new Error(`you cant use _number with _panbasic ,are you crazy?`);
    if (attributes._min && attributes._password) throw new Error(`you cant use _min with _password ,are you crazy?`);
    if (attributes._min && attributes._passwordrepeat) throw new Error(`you cant use _min with _passwordrepeat ,are you crazy?`);
    if (attributes._min && attributes._email) throw new Error(`you cant use _min with _email ,are you crazy?`);
    if (attributes._min && attributes._amount) throw new Error(`you cant use _min with _amount ,are you crazy?`);
    if (attributes._min && attributes._pan) throw new Error(`you cant use _min with _pan ,are you crazy?`);
    if (attributes._min && attributes._panbasic) throw new Error(`you cant use _min with _panbasic ,are you crazy?`);
    if (attributes._min && attributes._pin) throw new Error(`you cant use _min with _pin ,are you crazy?`);
    if (attributes._max && attributes._password) throw new Error(`you cant use _max with _password ,are you crazy?`);
    if (attributes._max && attributes._passwordrepeat) throw new Error(`you cant use _max with _passwordrepeat ,are you crazy?`);
    if (attributes._max && attributes._email) throw new Error(`you cant use _max with _email ,are you crazy?`);
    if (attributes._max && attributes._amount) throw new Error(`you cant use _max with _amount ,are you crazy?`);
    if (attributes._max && attributes._pan) throw new Error(`you cant use _max with _pan ,are you crazy?`);
    if (attributes._max && attributes._panbasic) throw new Error(`you cant use _max with _panbasic ,are you crazy?`);
    if (attributes._max && attributes._pin) throw new Error(`you cant use _max with _pin ,are you crazy?`);
  });
};

export default function useForm() {
  /* validated form state for client */
  const [formState, setFormState] = useState();

  /* errors state for client */
  const [errorState, setErrorState] = useState({});

  /* global form validation boolean */
  const [isFormValid, setIsFormValid] = useState(false);

  /* watch mode state */
  const [watchState, setWatchState] = useState();

  /* init refs array */
  const { current } = useRef([]);

  /* create form validation obj */
  const form = new Validate(current);

  useEffect(() => form.checkAttrCombinations(), []);

  /* get existing errors */
  const existingErrors = useCallback(() => form.validate(), []);

  // useEffect(() => {
  //   const x = Object.values(manageErrors()).every(item => utils.isEmpty(item));
  //   console.log(x);
  // }, [errorState, manageErrors]);

  const handleErrors = useCallback(() => setIsFormValid(isEmptyPropertiesOf(existingErrors())), [
    setIsFormValid,
    existingErrors,
    isEmptyPropertiesOf,
  ]);

  useEffect(() => handleErrors(), [handleErrors]);

  const onKeyUp = useCallback(() => {
    handleErrors();
    watchMode();
  }, [handleErrors]);

  /* prevent user actions on specific cases */
  const preventAction = useCallback((event, ref) => {
    if (ref.attributes?._number?.value) return utils.isNumberEvent(event);
    if (parseInt(ref.attributes?._length?.value) === ref.value?.length) event.keyCode !== 8 && event.preventDefault();
    return ref;
  }, []);

  /* helper function to create name:value array */
  const createFormArrFrom = useCallback(arr => {
    const form = [];
    arr.forEach(({ value, name }) => form.push({ [name]: value }));
    return form;
  }, []);

  /* you can use watch mode to track form state changes while debugging */
  const watchMode = useCallback(() => setWatchState(createFormArrFrom(current)), [createFormArrFrom, setWatchState]);

  /* push registered inputs to refs array & handle events*/
  const _register = useCallback(
    ref => {
      current.push(ref);
      ref.onkeyup = onKeyUp;
      ref.onkeydown = event => preventAction(event, ref);
    },
    [onKeyUp, preventAction]
  );

  /* submit function */
  const _handleSubmit = useCallback(
    event => {
      event.preventDefault();
      setErrorState(existingErrors());
      if (isFormValid) setFormState(createFormArrFrom(current));
    },
    [isFormValid, createFormArrFrom, setFormState, setErrorState, existingErrors]
  );

  return { _handleSubmit, _register, watchState, formState, errorState };
}
