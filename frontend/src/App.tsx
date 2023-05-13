import React, { useState } from 'react';
import './App.css';
import axios, {AxiosResponse} from 'axios';

function App() {

  const [name, setName] = useState("");
  const [getName, setGetName] = useState("");
  
  function onClick() : void {
    const res = axios.post('http://localhost:5001/user', {"name": name, "email": 'l@Gmail.com'});
    console.log(res);
  }

  function inputText(e : React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    console.log(name);
  }
  
  function handleGetClick() : void{
    axios.get('http://localhost:5001/name', {params: {id : 1}})
    .then((res : AxiosResponse<string>)=>{
      setGetName(res.data);
      console.log(res);
    })
  }

  return (
    <div className="App">
     <input  onChange={inputText} value={name}></input>
     <button onClick={onClick} >click</button>
     <h1>text : {name}</h1>
     <>
     <button onClick={handleGetClick} >get id = 1</button>
     <h1>get id == 1 name: {getName}</h1>
     </>
    </div>
  );
}

export default App;
