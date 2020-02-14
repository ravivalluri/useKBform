import { IError, IForm, IInputElement } from '../models';
import utils from '../utils/utils';

/* core validate ctor function */
export default function Validate (this: any, array: IInputElement[]): void {
    this.array = array;
}

/* returns true if each object in array is empty */
// Array.prototype.hasEmptyProperties = function() {
//   return this.every(item => Object.getOwnPropertyNames(item).length === 0);
// };

/* returns array of inputs with given attribute */
Validate.prototype.hasAttribute = function (attr: string): IInputElement[] {
    return this.array[0]?.filter((x: IInputElement) => x.attributes.hasOwnProperty(attr));
};

/* method for validating form */
Validate.prototype.validate = function (): IError {
    const errors = {} as IError;

    this.hasAttribute('_required')?.forEach(({ name, value }: IInputElement): void => {
        if (utils.isEmpty(value)) {
            errors[name] = 'this field is required';
        } else {
            errors[name] = '';
        }
    });

    this.hasAttribute('_number')?.forEach(({ name, value }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (!utils.isNumber(value)) {
                errors[name] = 'this value is not number';
            }
            errors[name] = '';
        }
    });

    this.hasAttribute('_email')?.forEach(({ name, value }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (!utils.isValidEmail(value)) {
                errors[name] = 'this email is not valid';
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_min')?.forEach(({ name, value, attributes }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (((value as unknown) as number) < parseInt(attributes._min.value, 10)) {
                errors[name] = `min ${attributes._min.value} required`;
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_max')?.forEach(({ name, value, attributes }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (((value as unknown) as number) > parseInt(attributes._max.value, 10)) {
                errors[name] = `max ${attributes._max.value} allowed`;
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_minlength')?.forEach(({ name, value, attributes }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (value.length < parseInt(attributes._minlength.value, 10)) {
                errors[name] = `min length ${attributes._minlength.value} required`;
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_maxlength')?.forEach(({ name, value, attributes }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (value.length > parseInt(attributes._maxlength.value, 10)) {
                errors[name] = `max length ${attributes._maxlength.value} allowed`;
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_length')?.forEach(({ name, value, attributes }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (value.length !== parseInt(attributes._length.value, 10)) {
                errors[name] = `required length is ${attributes._length.value} `;
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_pin')?.forEach(({ name, value }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (!utils.isValidPin(value)) {
                errors[name] = 'this pin is not valid';
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_amount')?.forEach(({ name, value }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (!utils.isValidAmount(value)) {
                errors[name] = 'this amount is not valid';
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_pan')?.forEach(({ name, value }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (!utils.isValidPan(value)) {
                errors[name] = 'this pan is not valid';
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_panbasic')?.forEach(({ name, value }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (!utils.isValidPanBasic(value)) {
                errors[name] = 'this pan is not valid';
            } else {
                errors[name] = '';
            }
        }
    });

    this.hasAttribute('_phone')?.forEach(({ name, value }: IInputElement): void => {
        if (!utils.isEmpty(value)) {
            if (!utils.isValidPhone(value)) {
                errors[name] = 'this phone number is not valid';
            } else {
                errors[name] = '';
            }
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
                if (!utils.isStrongPassword(value)) {
                    errors[name] = 'passwords is not strong';
                } else {
                    password = value;
                    errors[name] = '';
                }
            }
        });

        this.hasAttribute('_passwordrepeat')?.forEach(({ name, value }: IInputElement): void => {
            if (!utils.isEmpty(password)) {
                if (!utils.isEmpty(value)) {
                    passwordRepeat = value;
                    sname = name;
                } else {
                    errors[name] = 'please provide password repeat';
                }
            }

            password !== passwordRepeat ? (errors[sname] = 'passwords does not match') : (errors[sname] = '');
        });
    }

    return errors;
};

/* exp */
Validate.prototype.checkAttrCombinations = function (): void {
    this.array?.forEach(({ attributes }: IInputElement) => {
        if (attributes._number && attributes._email) {
            throw new Error('you cant use _number with _email ,are you crazy?');
        }
        if (attributes._number && attributes._password) {
            throw new Error('you cant use _number with _password ,are you crazy?');
        }
        if (attributes._number && attributes._passwordrepeat) {
            throw new Error('you cant use _number with _passwordrepeat ,are you crazy?');
        }
        if (attributes._number && attributes._amount) {
            throw new Error('you cant use _number with _amount ,are you crazy?');
        }
        if (attributes._number && attributes._pan) {
            throw new Error('you cant use _number with _pan ,are you crazy?');
        }
        if (attributes._number && attributes._panbasic) {
            throw new Error('you cant use _number with _panbasic ,are you crazy?');
        }
        if (attributes._min && attributes._password) {
            throw new Error('you cant use _min with _password ,are you crazy?');
        }
        if (attributes._min && attributes._passwordrepeat) {
            throw new Error('you cant use _min with _passwordrepeat ,are you crazy?');
        }
        if (attributes._min && attributes._email) {
            throw new Error('you cant use _min with _email ,are you crazy?');
        }
        if (attributes._min && attributes._amount) {
            throw new Error('you cant use _min with _amount ,are you crazy?');
        }
        if (attributes._min && attributes._pan) {
            throw new Error('you cant use _min with _pan ,are you crazy?');
        }
        if (attributes._min && attributes._panbasic) {
            throw new Error('you cant use _min with _panbasic ,are you crazy?');
        }
        if (attributes._min && attributes._pin) {
            throw new Error('you cant use _min with _pin ,are you crazy?');
        }
        if (attributes._max && attributes._password) {
            throw new Error('you cant use _max with _password ,are you crazy?');
        }
        if (attributes._max && attributes._passwordrepeat) {
            throw new Error('you cant use _max with _passwordrepeat ,are you crazy?');
        }
        if (attributes._max && attributes._email) {
            throw new Error('you cant use _max with _email ,are you crazy?');
        }
        if (attributes._max && attributes._amount) {
            throw new Error('you cant use _max with _amount ,are you crazy?');
        }
        if (attributes._max && attributes._pan) {
            throw new Error('you cant use _max with _pan ,are you crazy?');
        }
        if (attributes._max && attributes._panbasic) {
            throw new Error('you cant use _max with _panbasic ,are you crazy?');
        }
        if (attributes._max && attributes._pin) {
            throw new Error('you cant use _max with _pin ,are you crazy?');
        }
    });
};
