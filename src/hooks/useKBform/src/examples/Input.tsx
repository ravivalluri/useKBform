import React, { forwardRef, useEffect } from 'react';
import { IInputProps } from '../models';

export default forwardRef(function (props: IInputProps, ref: React.LegacyRef<HTMLInputElement>): React.ReactElement {
    const { errorstate, name } = props;

    return (
        <>
            <input {...props} {...{ ref }} />
            {errorstate[name]}
        </>
    );
});
