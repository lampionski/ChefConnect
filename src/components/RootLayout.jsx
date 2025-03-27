import React, { useContext, useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Header from "./Header.jsx";
import { BiLoader } from "react-icons/bi";
import UserCTX from "../context/UserContext.jsx";
import classes from "./RootLayout.module.css"
import { API_BASE_URL } from '../api';
import Footer from "./Footer"


export default function RootLayout(){

  const loaderData = useLoaderData();
  const userData = useContext(UserCTX)

  useEffect(()=>{
    if(loaderData && userData.user == null){
      userData.setUser(loaderData)
    }
  },[loaderData])

    return <>
    <div>
      <Header />
      <main className={classes.globalContainer}>
        <Outlet />
      </main>
      <Footer />
    </div>
    </>
}

export async function loader(){try{
  const response = await fetch(`${API_BASE_URL}/user`, {credentials:"include"})
  const user = await response.json();
  return user;
}catch{}
   return null
}