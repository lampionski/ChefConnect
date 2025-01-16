import React, { useContext, useEffect } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Header from "./Header.jsx";
import { BiLoader } from "react-icons/bi";
import UserCTX from "../context/UserContext.jsx";


export default function RootLayout(){

  const loaderData = useLoaderData();
  const userData = useContext(UserCTX)

  useEffect(()=>{
    if()
    userData.setUser(loaderData)
  },[loaderData])

    return <>
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
    </>
}

export async function loader(){try{
  const response = await fetch("http://localhost:3000/user", {credentials:"include"})
  return response;
}catch{}
   return null
}