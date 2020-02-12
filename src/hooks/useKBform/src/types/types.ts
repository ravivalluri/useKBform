export interface IForm {
  [name: string]: any;
}

export interface ICurrent {
  current: string[];
  [x: string]: any;
}

export interface IHTMLInputEvent extends Event {
  which: HTMLInputElement & EventTarget;
  keyCode: HTMLInputElement & EventTarget;
}
