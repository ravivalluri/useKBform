import React, { forwardRef } from 'react';
import { IInputProps } from '../models';

export default forwardRef(function (
    {
        errorState,
        name,
        defaultValue,
        _required,
        _number,
        _min,
        _max,
        _password,
        _passwordrepeat,
        _minlength,
        _maxlength,
        _length,
        _email,
        _amount,
        _pan,
        _panbasic,
        _pin,
    }: IInputProps,
    ref: React.LegacyRef<HTMLInputElement>,
): React.ReactElement {
    return (
        <>
            <input
                {...{
                    ref,
                    name,
                    defaultValue,
                    _required,
                    _number,
                    _min,
                    _max,
                    _password,
                    _passwordrepeat,
                    _minlength,
                    _maxlength,
                    _length,
                    _email,
                    _amount,
                    _pan,
                    _panbasic,
                    _pin,
                }}
            />
            {errorState[name]}
        </>
    );
});
