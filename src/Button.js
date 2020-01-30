import React, { useEffect } from 'react';

export default function({ state, setState, name }) {
  function handle() {
    // console.log();
    setState({ ...state, [name]: state[name].filter(x => x !== 1) });
  }

  return <button onClick={() => handle()}>click</button>;
}
