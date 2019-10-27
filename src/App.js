import React from 'react';
import Canvas from './components/Canvas'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container">
        <Topbar/>
        <Sidebar/>
        <Canvas/>
      </div>
    </div>
  );
}

export default App;
