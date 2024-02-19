/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Forgot from "../Pages/Forgot";
import Profile from "../Pages/Profile";

function CommonRouter() {
  return (
    <>
      <Routes>
        <Route path="/signup" Component={Signup}></Route>
        <Route path="/login" Component={Login}></Route>
        <Route path="/" Component={Home}></Route>
        <Route path="/pass" Component={Forgot}></Route>
        <Route path="/profile" Component={Profile}></Route>
      </Routes>
    </>
  );
}

export default CommonRouter;
