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
Validate.prototype.validated = function() {
  const requiredErrors = {};
  const numErrors = {};
  const minNumErrors = {};
  const maxNumErrors = {};
  const emailErrors = {};
  const minLengthErrors = {};
  const maxLengthErrors = {};
  const lengthErrors = {};
  const pinErrors = {};
  const amountErrors = {};
  const panErrors = {};
  const phoneErrors = {};
  const passwordStengthErrors = {};
  const passwordRepeatErrors = {};

  this.hasAttribute('_required').forEach(({ name, value }) => {
    if (utils.isEmpty(value)) requiredErrors[name] = 'this field is required';
    else requiredErrors[name] = '';
  });

  this.hasAttribute('_number').forEach(({ name, value }) => {
    if (!utils.isNumber(value)) numErrors[name] = 'this value is not number';
    numErrors[name] = '';
  });

  this.hasAttribute('_email').forEach(({ name, value, attributes }) => {
    // console.log(value);
    if (!utils.isEmpty(value)) {
      if (!utils.isValidEmail(value)) emailErrors[name] = 'this email is not valid';
      else emailErrors[name] = '';
    } else return;
  });

  this.hasAttribute('_min').forEach(({ name, value, attributes }) => {
    if (value < parseInt(attributes._min.value)) minNumErrors[name] = `min ${attributes._min.value} required`;
    else minNumErrors[name] = '';
  });

  this.hasAttribute('_max').forEach(({ name, value, attributes }) => {
    if (value > parseInt(attributes._max.value)) maxNumErrors[name] = `max ${attributes._max.value} allowed`;
    else maxNumErrors[name] = '';
  });

  this.hasAttribute('_minlength').forEach(({ name, value, attributes }) => {
    if (value.length < parseInt(attributes._minlength.value))
      minLengthErrors[name] = `min length ${attributes._minlength.value} required`;
    else minLengthErrors[name] = '';
  });

  this.hasAttribute('_maxlength').forEach(({ name, value, attributes }) => {
    if (value.length > parseInt(attributes._maxlength.value))
      maxLengthErrors[name] = `max length ${attributes._maxlength.value} allowed`;
    else maxLengthErrors[name] = '';
  });

  this.hasAttribute('_length').forEach(({ name, value, attributes }) => {
    if (value.length !== parseInt(attributes._length.value)) {
      lengthErrors[name] = `required length is ${attributes._length.value} `;
    } else lengthErrors[name] = '';
  });

  this.hasAttribute('_pin').forEach(({ name, value }) => {
    if (!utils.isValidPin(value)) pinErrors[name] = 'this pin is not valid';
    else pinErrors[name] = '';
  });

  this.hasAttribute('_amount').forEach(({ name, value }) => {
    if (value) {
      if (!utils.isValidAmount(value)) amountErrors[name] = 'this amount is not valid';
      else amountErrors[name] = 'this amount is not valid';
    } else return;
  });

  this.hasAttribute('_pan').forEach(({ name, value }) => {
    if (!utils.isValidPan(value)) panErrors[name] = 'this pan is not valid';
    else panErrors[name] = '';
  });

  this.hasAttribute('_phone').forEach(({ name, value }) => {
    if (!utils.isValidPhone(value)) phoneErrors[name] = 'this phone number is not valid';
    else phoneErrors[name] = '';
  });

  /* TODO refactor */
  const arr = [...this.hasAttribute('_password'), ...this.hasAttribute('_passwordrepeat')];

  if (arr.length !== 0) {
    let password;
    let passwordRepeat;
    let sname;

    this.hasAttribute('_password').forEach(({ value, name }) => {
      if (!utils.isStrongPassword(value)) passwordStengthErrors[name] = 'passwords is not strong';
      else {
        password = value;
        passwordStengthErrors[name] = '';
      }
    });

    this.hasAttribute('_passwordrepeat').forEach(({ name, value }) => {
      passwordRepeat = value;
      sname = name;
    });

    if (password !== passwordRepeat) passwordRepeatErrors[sname] = 'passwords does not match';
    else passwordRepeatErrors[sname] = '';
  }

  /* TODO refactor error handling */
  return {
    requiredErrors:
      (requiredErrors.name !== '' && requiredErrors) ||
      (requiredErrors.surname !== '' && requiredErrors) ||
      (requiredErrors.lastname !== '' && requiredErrors),
    numErrors:
      (numErrors.name !== '' && numErrors) || (numErrors.surname !== '' && numErrors) || (numErrors.lastname !== '' && numErrors),
    minNumErrors:
      (minNumErrors.name !== '' && minNumErrors) ||
      (minNumErrors.surname !== '' && minNumErrors) ||
      (minNumErrors.lastname !== '' && minNumErrors),
    maxNumErrors:
      (maxNumErrors.name !== '' && maxNumErrors) ||
      (maxNumErrors.surname !== '' && maxNumErrors) ||
      (maxNumErrors.lastname !== '' && maxNumErrors),
    emailErrors:
      (emailErrors.name !== '' && emailErrors | (emailErrors.surname !== '') && emailErrors) ||
      (emailErrors.lastname !== '' && emailErrors),
    minLengthErrors:
      (minLengthErrors.name !== '' && minLengthErrors | (minLengthErrors.surname !== '') && minLengthErrors) ||
      (minLengthErrors.lastname !== '' && minLengthErrors),
    maxLengthErrors:
      (maxLengthErrors.name !== '' && maxLengthErrors | (maxLengthErrors.surname !== '') && maxLengthErrors) ||
      (maxLengthErrors.lastname !== '' && maxLengthErrors),
    lengthErrors:
      (lengthErrors.name !== '' && lengthErrors | (lengthErrors.surname !== '') && lengthErrors) ||
      (lengthErrors.lastname !== '' && lengthErrors),
    pinErrors:
      (pinErrors.name !== '' && pinErrors | (pinErrors.surname !== '') && pinErrors) || (pinErrors.lastname !== '' && pinErrors),
    amountErrors:
      (amountErrors.name !== '' && amountErrors | (amountErrors.surname !== '') && amountErrors) ||
      (amountErrors.lastname !== '' && amountErrors),
    panErrors:
      (panErrors.name !== '' && panErrors | (panErrors.surname !== '') && panErrors) || (panErrors.lastname !== '' && panErrors),
    phoneErrors:
      (phoneErrors.name !== '' && phoneErrors | (phoneErrors.surname !== '') && phoneErrors) ||
      (phoneErrors.lastname !== '' && phoneErrors),
    passwordStengthErrors:
      (passwordStengthErrors.name !== '' &&
        passwordStengthErrors | (passwordStengthErrors.surname !== '') &&
        passwordStengthErrors) ||
      (passwordStengthErrors.lastname !== '' && passwordStengthErrors),
    passwordRepeatErrors:
      (passwordRepeatErrors.name !== '' &&
        passwordRepeatErrors | (passwordRepeatErrors.surname !== '') &&
        passwordRepeatErrors) ||
      (passwordRepeatErrors.lastname !== '' && passwordRepeatErrors),
  };
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

  useEffect(() => {
    handleErrors();
  }, []);

  const manageErrors = useCallback(() => validate.validated(), []);

  const handleErrors = useCallback(() => {
    const isErrorsEmpty = Object.keys(manageErrors())
      .map(key => manageErrors()[key])
      .hasEmptyProperties();

    setFormValid(isErrorsEmpty);
  }, [setFormValid, manageErrors]);

  const onKeyUp = useCallback(() => {
    handleErrors();
    watchMode();
  }, [handleErrors]);

  function test(e, ref) {
    if (ref.attributes?._number?.value) return utils.isNumber(e.key);
    if (parseInt(ref.attributes?._length?.value) === ref.value?.length) e.preventDefault();
    return ref;
  }

  /* push registered inputs to refs array */
  const _register = useCallback(
    ref => {
      current.push(ref);
      ref.onkeyup = onKeyUp;
      ref.onkeydown = e => test(e, ref);
    },
    [onKeyUp]
  );

  const createFormArrFrom = useCallback(arr => {
    const form = [];
    arr.forEach(({ value, name }) => form.push({ value, name }));
    return form;
  }, []);

  /* you can use watch mode to track form state changes while debugging */
  const watchMode = useCallback(() => setWatchState(createFormArrFrom(current)), [createFormArrFrom, setWatchState]);

  const _handleSubmit = useCallback(
    e => {
      e.preventDefault();
      setErrorState(manageErrors());
      if (isFormValid) setFormState(createFormArrFrom(current));
    },
    [isFormValid, createFormArrFrom, setFormState, setErrorState, manageErrors]
  );

  return { _handleSubmit, _register, watchState, formState, errorState };
}
