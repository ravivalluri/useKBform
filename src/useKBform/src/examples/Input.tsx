import React, { forwardRef, LegacyRef, ReactElement } from 'react';
import { IInputProps } from '../models';

export default forwardRef(function(props: IInputProps, ref: LegacyRef<HTMLInputElement>): ReactElement {
    const { errorstate, name } = props;

    return (
        <>
            <input {...props} {...{ ref }} />
            {errorstate[name]}
        </>
    );
});
