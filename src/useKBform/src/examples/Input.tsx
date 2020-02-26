import React, { ReactElement } from 'react';
import { IInputProps } from '../models';

export default function(props: IInputProps): ReactElement {
  const { errorstate, name } = props;

  return (
    <>
      <input {...props} />
      {errorstate[name]}
    </>
  );
}
