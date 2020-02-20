import React, { useEffect } from 'react';
import './App.css';
import ExampleComponent from './useKBform/src/examples/ExampleComponent';

const App = () => {
  function dayOfWeek(year, month, day) {
    const t = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
    return ((year + Math.floor(year / 4) + t[month % 12] + day) % 7) + 1;
  }
  useEffect(() => {
    // console.log(new Date(dayOfWeek(1990, 1, 13)));
    // console.log(dayOfWeek(2020, 2, 18));
  }, []);

  return (
    <div className="App">
      <ExampleComponent />
    </div>
  );
};

export default App;
