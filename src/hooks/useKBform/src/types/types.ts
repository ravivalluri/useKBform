export interface Form {
  value: string;
  name: string;
  [name: string]: any;
}

export interface FormState {
  formState?: Form;
  setFormState?(state: Form): void;
  [x: string]: any;
}

export interface ErrorState {
  name: string;
  surname: string;
}

export interface WatchState {
  watchState?: Form;
  setWatchState?(state: Form): void;
  [x: string]: any;
}

export interface Current {
  current: string[];
  [x: string]: any;
}
