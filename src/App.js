import React, { useEffect, useState, Suspense, lazy } from 'react';
import './App.css';
import SomeComponent from './SomeComponent';

function App() {
  return (
    <div className="App">
      <SomeComponent />
    </div>
  );
}

export default App;
