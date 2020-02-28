import React, { ReactElement, useEffect } from 'react';
import { FormControl } from '../../../../../../shared/components/FormControl';
import Switch from '../../../../../../shared/components/Switch';
import Upload from '../../../../../../shared/components/Upload';
import useKBform from '../useKBform';
import Input from './Input';

/* example usage of useKBform() with single form or multiple step by step validation  */
export default function ExampleComponent(): ReactElement {
    const { _register, _envMode, _reset, _handleSubmit, watchState, formState, errorState, formStatus } = useKBform();

    /* set envMode */
    useEffect(() => {
        _envMode('dev');
    }, []);

    /* form state */
    useEffect(() => {
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
            <form ref={_register} _formname="firstform" onSubmit={_handleSubmit}>
                {/* <Input errorstate={errorState} name="name" /> */}
                {/* <Input errorstate={errorState} name="surname" _length="5" _number="true" /> */}

                {/* <input name="amount" _amount="true" />
                {errorState.amount} */}

                {/* <textarea name="poem" _required="true" />
                {errorState.poem} */}

                {/* <select name="developer" _required="true">
                    <option value="" />
                    <option value="rustam">rustam</option>
                    <option value="sabuhi">sabuhi</option>
                </select>
                {errorState.developer} */}

                {/* <FormControl type="checkbox" color="success" label="label" name="check" /> */}

                {/* <input name="ignoreTest" _ignore="true" /> */}

                {/* <Upload _required="true" name="file" multiple />
                {errorState.file} */}

                {/* <Switch name="switch" disabled={false} /> */}

                <button type="submit">next</button>
            </form>

            {/* <form ref={_register} _formname="secondform" onSubmit={_handleSubmit}>
                <Input errorstate={errorState} name="back" _required="true" _min="5" _max="10" _number="true" />
                <Input errorstate={errorState} name="front" _required="true" />

                <button type="submit">submit</button>
            </form> */}

            <button type="button" onClick={() => _reset('firstform')}>
                reset firstform
            </button>

            {/* <button type="button" onClick={() => _reset('secondform')}>
                reset secondform
            </button> */}
        </div>
    );
}
