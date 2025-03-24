import React, { useContext, useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Header from "./Header.jsx";
import { BiLoader } from "react-icons/bi";
import UserCTX from "../context/UserContext.jsx";
import classes from "./RootLayout.module.css"


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
    </div>
    </>
}

export async function loader(){try{
  const response = await fetch("http://localhost:3000/user", {credentials:"include"})
  const user = await response.json();
  return user;
}catch{}
   return null
}