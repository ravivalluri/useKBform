import { IError, IForm, IInputElement } from '../models';
import utils from '../utils';

/* core validate ctor function */
export default function Validate(this: any, array: IInputElement[]): void {
  this.array = array;
}

/* returns true if each object in array is empty */
// Array.prototype.hasEmptyProperties = function() {
//   return this.every(item => Object.getOwnPropertyNames(item).length === 0);
// };

/* returns array of inputs with given attribute */
Validate.prototype.hasAttribute = function(attr: string): IInputElement[] {
  return this.array?.filter((x: IInputElement) => x.attributes.hasOwnProperty(attr));
};

/* method for validating form */
Validate.prototype.validate = function(): IError {
  const errors = {} as IError;

  this.hasAttribute('_required')?.forEach(({ name, value }: IInputElement): void => {
    utils.isEmpty(value) ? (errors[name] = 'this field is required') : (errors[name] = '');
  });

  this.hasAttribute('_number')?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      !utils.isNumber(value) ? (errors[name] = 'this value is not number') : (errors[name] = '');
    }
  });

  this.hasAttribute('_email')?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      !utils.isValidEmail(value) ? (errors[name] = 'this email is not valid') : (errors[name] = '');
    }
  });

  this.hasAttribute('_min')?.forEach(({ name, value, attributes }: any): void => {
    if (!utils.isEmpty(value)) {
      ((value as unknown) as number) < parseInt(attributes._min.value, 10)
        ? (errors[name] = `min ${attributes._min.value} required`)
        : (errors[name] = '');
    }
  });

  this.hasAttribute('_max')?.forEach(({ name, value, attributes }: any): void => {
    if (!utils.isEmpty(value)) {
      ((value as unknown) as number) > parseInt(attributes._max.value, 10)
        ? (errors[name] = `max ${attributes._max.value} allowed`)
        : (errors[name] = '');
    }
  });

  this.hasAttribute('_minlength')?.forEach(({ name, value, attributes }: any): void => {
    if (!utils.isEmpty(value)) {
      value.length < parseInt(attributes._minlength.value, 10)
        ? (errors[name] = `min length ${attributes._minlength.value} required`)
        : (errors[name] = '');
    }
  });

  this.hasAttribute('_maxlength')?.forEach(({ name, value, attributes }: any): void => {
    if (!utils.isEmpty(value)) {
      value.length > parseInt(attributes._maxlength.value, 10)
        ? (errors[name] = `max length ${attributes._maxlength.value} allowed`)
        : (errors[name] = '');
    }
  });

  this.hasAttribute('_length')?.forEach(({ name, value, attributes }: any): void => {
    if (!utils.isEmpty(value)) {
      value.length !== parseInt(attributes._length.value, 10)
        ? (errors[name] = `required length is ${attributes._length.value} `)
        : (errors[name] = '');
    }
  });

  this.hasAttribute('_pin')?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      !utils.isValidPin(value) ? (errors[name] = 'this pin is not valid') : (errors[name] = '');
    }
  });

  this.hasAttribute('_amount')?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      !utils.isValidAmount(value) ? (errors[name] = 'this amount is not valid') : (errors[name] = '');
    }
  });

  this.hasAttribute('_pan')?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      !utils.isValidPan(value) ? (errors[name] = 'this pan is not valid') : (errors[name] = '');
    }
  });

  this.hasAttribute('_panbasic')?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      !utils.isValidPanBasic(value) ? (errors[name] = 'this pan is not valid') : (errors[name] = '');
    }
  });

  this.hasAttribute('_phone')?.forEach(({ name, value }: IInputElement): void => {
    if (!utils.isEmpty(value)) {
      !utils.isValidPhone(value) ? (errors[name] = 'this phone number is not valid') : (errors[name] = '');
    }
  });

  /* TODO refactor */
  const arr = [...this?.hasAttribute('_password'), ...this?.hasAttribute('_passwordrepeat')];

  if (arr.length) {
    let password: string;
    let passwordRepeat: string;
    let sname: string;

    this.hasAttribute('_password')?.forEach(({ value, name }: IInputElement): void => {
      if (!utils.isEmpty(value)) {
        !utils.isStrongPassword(value) ? (errors[name] = 'passwords is not strong') : (password = value) && (errors[name] = '');
      }
    });

    this.hasAttribute('_passwordrepeat')?.forEach(({ name, value }: IInputElement): void => {
      if (!utils.isEmpty(password)) {
        !utils.isEmpty(value) ? (passwordRepeat = value) && (sname = name) : (errors[name] = 'please provide password repeat');
      }

      password !== passwordRepeat ? (errors[sname] = 'passwords does not match') : (errors[sname] = '');
    });
  }

  return errors;
};
