import React, { forwardRef } from 'react';
import { IInputProps } from '../models';

export default forwardRef(function(props: IInputProps, ref: React.LegacyRef<HTMLInputElement>): React.ReactElement {
  return (
    <>
      <input {...props} {...{ ref }} />
      {props.errorState[props.name]}
    </>
  );
});
