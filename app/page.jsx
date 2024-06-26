"use client"
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import useNavbar from "./_hooks/useNavBar";
import useSideBar from "@@/_hooks/useSideBar";
import useRequest from "@@/_hooks/useRequest";
import useMethod from "@@/_hooks/useMethod";
import useResponse from "@@/_hooks/useResponse";
export const dynamic = 'force-dynamic';
export default function uitest(){
    const [showSidebar,setShowSidebar]=useState(false);
    const [showBackdrop,setShowBackdrop]=useState(false);
    const [requestComponent,requestURL,setRequestURL,requestMethod,setRequestMethod]=useRequest();
    const [MethodComponent,params,setParams,headers,setHeaders,body,setBody]=useMethod();
    const [responseComponent,fetchResponse,response,setResponse,responseCode,setResponseCode]=useResponse([requestURL,requestMethod,params,headers,body]);
    const [fetched,setFetched]=useState(false);
    const [sideBarComponent,activeRequestId]=useSideBar({
        'setRequestMethods':[setRequestURL,setRequestMethod,setParams,setHeaders,setBody,setResponse,setResponseCode],
        'showSidebar':showSidebar,
        'showBackdrop':showBackdrop
    })
    const [navBarComponent,saveRequest]=useNavbar({
      'apiParams':[requestURL,requestMethod,params,headers,body,response,responseCode],
      'showSidebar':showSidebar,
      'setShowSidebar':setShowSidebar,
      'showBackdrop':showBackdrop,
      'setShowBackdrop':setShowBackdrop,
      'activeRequestId':activeRequestId
    })
    const sendFunction=async (e)=>{
      await fetchResponse(e);
      setFetched((cur_val)=>{
        return true;
      })
    }
    useEffect(()=>{
      if(fetched){
        saveRequest();
        setFetched((cur_val)=>{
          return false;
        })
      }
    },[fetched])
    useEffect(() => {
        if(window.innerWidth>=1024) setShowSidebar(true);
        if(window.innerWidth<1024) setShowSidebar(false);
        const handleResize = () => {
            if(window.innerWidth>=1024) setShowSidebar(true);
            if(window.innerWidth<1024) setShowSidebar(false);
            setShowBackdrop(false)
        };
 
        window.addEventListener('resize', handleResize);
 
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return(
    <div className="flex flex-col">
      {navBarComponent}
      <div className="flex grow overflow-hidden bg-white pt-16 h-full">
         {sideBarComponent}
         <div id="main-content" className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
          <main>
               <div class="w-full">
                  <div className="flex flex-row w-full">
                    {requestComponent}
                    <button type="submit" className="w-24 my-5 h-12 mx-2 items-end text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center" onClick={async (e)=>{await sendFunction(e)}}>Send</button>
                  </div>
                  {MethodComponent}
                {responseComponent}
               </div>
         </main>
        </div>
      </div>
  </div>
  );
}