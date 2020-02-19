import React, { useContext, useEffect, useRef, useState } from 'react';
import useKBform from '../useKBform';
import Input from './Input';

/* example usage of useKBform() with single form or multiple step by step validation  */
export default function ExampleComponent (): React.ReactElement {
    const { _register, _envMode, _handleSubmit, watchState, formState, errorState, formStatus } = useKBform();

    useEffect(() => {
        _envMode('dev');
    }, []);

    useEffect(() => {
        /* temp condition */
        if (formState) {
            console.log(formState);
        }
    }, [formState]);

    /* watch state */
    useEffect(() => {
        console.log(watchState);
    }, [watchState]);

    /* status of first form by name "firstform */
    useEffect(() => {
        if (formStatus?.firstform) {
            console.log('first form is clean', formStatus);
        }
    }, [formStatus]);

    /* status of second form by name "secondform" */
    useEffect(() => {
        if (formStatus?.secondform) {
            console.log('second form is clean', formStatus);
        }
    }, [formStatus]);

    return (
        <div>
            <form ref={_register} _formname="firstform">
                <Input errorstate={errorState} name="name" _required="true" />
                <Input errorstate={errorState} name="surname" />

                <button type="submit">next</button>
            </form>

            <form ref={_register} _formname="secondform" onSubmit={_handleSubmit}>
                <Input errorstate={errorState} name="back" _required="true" />
                <Input errorstate={errorState} name="front" />

                <button type="submit">submit</button>
            </form>
        </div>
    );
}
