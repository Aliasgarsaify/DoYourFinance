import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div>
        <ToastContainer/>
        <Routes>
          <Route path="/" element ={<Signup/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
        </Routes>
    </div>
  );
}

export default App;
