import { SyntheticEvent } from 'react';

export interface IForm {
    value: string;
    name: string;
}

export interface ICurrent {
    current: string[];
    [x: string]: any;
}

export interface IHTMLInputEvent extends Event {
    which: HTMLInputElement & EventTarget;
    keyCode: HTMLInputElement & EventTarget;
}

interface ICustomAttribute {
    value?: string;
}

interface IInputAttributes extends NamedNodeMap {
    _required?: ICustomAttribute;
    _number?: ICustomAttribute;
    _min?: ICustomAttribute;
    _max?: ICustomAttribute;
    _password?: ICustomAttribute;
    _passwordrepeat?: ICustomAttribute;
    _minlength?: ICustomAttribute;
    _maxlength?: ICustomAttribute;
    _length?: ICustomAttribute;
    _email?: ICustomAttribute;
    _amount?: ICustomAttribute;
    _pan?: ICustomAttribute;
    _panbasic?: ICustomAttribute;
    _pin?: ICustomAttribute;
    _formname?: string;
}

export interface IFormData {
    [name: string]: any;
}

export interface IError {
    [name: string]: string;
}

export interface IInputElement extends HTMLInputElement {
    attributes: IInputAttributes;
}

export interface IInputProps {
    errorstate: IForm;
    name: string;
    defaultValue?: string;
    _required?: string;
    _number?: string;
    _min?: string;
    _max?: string;
    _password?: string;
    _passwordrepeat?: string;
    _minlength?: string;
    _maxlength?: string;
    _length?: string;
    _email?: string;
    _amount?: string;
    _pan?: string;
    _panbasic?: string;
    _pin?: string;
    _formname?: string;
}

export interface IFormStatus {
    [name: string]: string;
}

export interface IUseKBform {
    _register (ref: any): void;
    _handleSubmit (event: SyntheticEvent): void;
    _envMode (mode: string): void;
    watchState?: IFormData[];
    formState?: IFormData[];
    formStatus?: IFormStatus;
    errorState?: any;
}
