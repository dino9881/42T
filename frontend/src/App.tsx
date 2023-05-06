import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [name, setName] = useState("");
  function onClick() : void {
    const res = axios.post('http://localhost:5001/', {name : {name}});
    console.log(res);
  }
  function inputText(e : React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    console.log(name);
   }
  return (
    <div className="App">
     <input  onChange={inputText} value={name}></input>
     <button onClick={onClick} >click</button>
     <h1>text : {name}</h1>
    </div>
  );
}

export default App;
