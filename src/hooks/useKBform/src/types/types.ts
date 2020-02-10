export interface IForm {
    value: string;
    name: string;
    [name: string]: any;
}

export interface IFormState {
    formState?: IForm;
    setFormState? (state: IForm): void;
    [x: string]: any;
}

export interface IWatchState {
    watchState?: IForm;
    setWatchState? (state: IForm): void;
    [x: string]: any;
}

export interface ICurrent {
    current: string[];
    [x: string]: any;
}

export interface IHTMLInputEvent extends Event {
    which: HTMLInputElement & EventTarget;
    keyCode: HTMLInputElement & EventTarget;
}
