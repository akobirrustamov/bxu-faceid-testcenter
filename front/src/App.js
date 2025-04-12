import React, {useEffect} from "react";
import './App.css';
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import ApiCall from "./config/index"

// my pages
import Home from "./pages/home/Home"
import PageNotFound from "./pages/404/404";
import DataForm from "./pages/home/DataForm";

import LoginAdmin from "./admin/LoginAdmin";
import EducationForm from "./admin/myPages/EducationForm";
import EducationField from "./admin/myPages/EducationField";
import EducationType from "./admin/myPages/EducationType";
import MyAppeals from "./admin/myPages/Appeals"
import AdminHome from "./admin/myPages/AdminHome";


// app admin
import AdminHomeUser from "./admin/admin/AdminHome";


// agent

import AppealsAgent from "./admin/agent/Appeals"
import TestAbuturient from "./pages/home/TestAbuturient";
import Staff from "./admin/myPages/Staff";
import AllAppeals from "./admin/agent/AllAppeals";
import HemisToken from "./admin/admin/HemisToken";
import Groups from "./admin/admin/Groups";
import GroupDetail from "./admin/admin/GroupDetail";
import Contract from "./admin/admin/Contract";
import StudentDetail from "./admin/admin/StudentDetail";
function App() {

  const blockedPages = [
    "/dashboard"
  ];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect( () => {

    checkSecurity()
  }, [blockedPages, location.pathname, navigate])
  async function checkSecurity(){
    if (blockedPages.some((blockedPage) => location.pathname.startsWith(blockedPage))) {
      let accessToken = localStorage.getItem("access_token");
      const res = await ApiCall("/api/v1/security", "GET")
      if(res?.data==401){
        navigate("/admin/login");
      }
      if (accessToken !== null ) {
        if (res?.data!==401&&res?.error){
          if (res?.data[0]?.name!=="ROLE_ADMIN"){
            navigate("/404")
          }
        }
      } else {
        navigate("/admin/login");
      }
    }
  }

  return (
    <div>
      <Routes>
        <Route path={"/"} element={<Home/>} />
        <Route path={"/:agentId"} element={<Home/>} />
        <Route path={"/data-form"} element={<DataForm/>} />
        <Route path={"/test"} element={<TestAbuturient/>} />


        <Route path={"/admin/login"} element={<LoginAdmin/>}/>
        <Route path={"/dashboard"} element={<AdminHome/>}/>
        <Route path={"/dashboard/appeal"} element={<MyAppeals/>}/>
        <Route path={"/dashboard/staff"} element={<Staff/>}/>
        <Route path={"/dashboard/education-form"} element={<EducationForm/>}/>
        <Route path={"/dashboard/education-field"} element={<EducationField/>}/>
        <Route path={"/dashboard/education-type"} element={<EducationType/>}/>
        <Route path={"/*"} element={<PageNotFound/>}/>





      {/*  app admins */}
        <Route path={"/admin/home"} element={<AdminHomeUser/>}/>
        <Route path={"/admin/token"} element={<HemisToken/>}/>
        <Route path={"/admin/groups"} element={<Groups/>}/>
        <Route path={"/admin/contract"} element={<Contract/>}/>
        <Route path={"/admin/group/:groupId"} element={<GroupDetail/>}/>
        <Route path={"/admin/student/:studentId"} element={<StudentDetail/>}/>



        {/*/!*agent*!/*/}
        {/*<Route path={"/agent/home"} element={<AdminHomeAgent/>}/>*/}
        {/*<Route path={"/agent/appeals"} element={<AppealsAgent/>}/>*/}
        {/*<Route path={"/agent/all-appeals"} element={<AllAppeals/>}/>*/}





      </Routes>
    </div>
  );
}

export default App;
