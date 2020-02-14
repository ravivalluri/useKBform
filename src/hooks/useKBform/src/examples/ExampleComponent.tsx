import React, { useContext, useEffect, useRef, useState } from 'react';
import useKBform from '../useKBform';
import Input from './Input';

/* example usage of useKBform()  */
export default function ExampleComponent (): React.ReactElement {
    const { _register, watchState, formState, errorState, _handleSubmit } = useKBform();

    useEffect(() => {
        /* temp condition */
        if (formState) {
            console.log(formState);
        }
    }, [formState]);

    return (
        <div>
            <form ref={_register} _next="true" onSubmit={_handleSubmit}>
                {/* <Input ref={_register} {...{ errorState }} name="name" _required="true" />
                <Input ref={_register} {...{ errorState }} name="surname" /> */}

                <input
                    name="name"
                    _required="true"
                    // _number="true"
                    // _min="5"
                    // _max="10"
                    // _password="true"
                    // _minlength="3"
                    // _maxlength="5"
                    // _length="6"
                    // _email="true"
                    // _amount="true"
                    // _pan="true"
                    // _panbasic="true"
                    // _pin="true"
                    // defaultValue={'default 1'}
                />
                {errorState.name}
                <input
                    name="lastname"
                    // _required="true"
                    // _number="true"
                    // _min="5"
                    // _max="10"
                    // _passwordrepeat="true"
                    // _minlength="3"
                    // _maxlength="5"
                    // _length="6"
                    // _email="true"
                    // _amount="true"
                    // _pan="true"
                    // _pin="true"
                    // defaultValue={'default 1'}
                />
                {errorState.lastname}

                <button type="submit">next</button>
            </form>

            <form ref={_register} onSubmit={_handleSubmit}>
                {/* <Input ref={_register} {...{ errorState }} name="name" _required="true" />
                <Input ref={_register} {...{ errorState }} name="surname" /> */}

                <input
                    name="front"
                    _required="true"
                    // _number="true"
                    // _min="5"
                    // _max="10"
                    // _password="true"
                    // _minlength="3"
                    // _maxlength="5"
                    // _length="6"
                    // _email="true"
                    // _amount="true"
                    // _pan="true"
                    // _panbasic="true"
                    // _pin="true"
                    // defaultValue={'default 1'}
                />
                {errorState.front}
                <input
                    name="back"
                    _required="true"
                    // _number="true"
                    // _min="5"
                    // _max="10"
                    // _passwordrepeat="true"
                    // _minlength="3"
                    // _maxlength="5"
                    // _length="6"
                    // _email="true"
                    // _amount="true"
                    // _pan="true"
                    // _pin="true"
                    // defaultValue={'default 1'}
                />
                {errorState.back}

                <button type="submit">submit</button>
            </form>
        </div>
    );
}
