import './App.css';
import axios, {AxiosResponse} from 'axios';
import Layout from './Layout';
import Login from './Login';
import Main from './main';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Sidebar from './sidebar/Sidebar';

function App(){
    return (
      <div className='App'>
        <BrowserRouter>
        <Routes>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/" element={<Login />}></Route>
        </Routes>
        </BrowserRouter>
        <Layout />
      </div>
  );
}









// function App() {
  // const [name, setName] = useState("");
  // const [getName, setGetName] = useState("");
  
  // function onClick() : void {
  //   const res = axios.post('http://localhost:5001/name', {"name": name});
  //   console.log(res);
  // }
  // function inputText(e : React.ChangeEvent<HTMLInputElement>) {
  //   setName(e.target.value);
  //   console.log(name);
  //  }
  // function handleGetClick() : void{
  //   axios.get('http://localhost:5001/name', {params: {id : 219}})
  //   .then((res : AxiosResponse<string>)=>{
  //     setGetName(res.data);
  //     console.log(res);
  //   })
  // }

  // return (
  //   <div className="App">
  //    <input  onChange={inputText} value={name}></input>
  //    <button onClick={onClick} >click</button>
  //    <h1>text : {name}</h1>
  //    <>
  //    <button onClick={handleGetClick} >get id = 209</button>
  //    <h1>get id == 1 name: {getName}</h1>
  //    </>
  //   </div>
  // );
  
// }

export default App;