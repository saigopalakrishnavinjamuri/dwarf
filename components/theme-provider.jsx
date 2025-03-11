"use client"

import React, {useContext, useEffect, useState} from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { User } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DialogContext } from "@/context/DialogContext";

export function ThemeProvider({
  children,
  ...props
}) {

  const convex = useConvex();

  const [messages, setMessages] = useState();
  const [userDetails, setUserDetails] = useState();
  const [openDialog, setOpenDialog] = useState(false);


  useEffect(() => {
    IsAuthenticated();
  }, []);

  const IsAuthenticated = () => {
    if(typeof window !== undefined){
      const user = JSON.parse(localStorage.getItem('user'));
      
      if(user) {
        // fetch from db
        const result = convex.query(api.users.GetUser, {
          email: user?.email
        });
        // console.log(result);
        setUserDetails(result);
      }
    }
  }

  return (
    
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}>
      <DialogContext.Provider value={{ openDialog, setOpenDialog }} >
        <UserDetailsContext.Provider value={{userDetails, setUserDetails}}>
          <MessagesContext.Provider value={{messages, setMessages}}>
            <NextThemesProvider {...props}>{children}</NextThemesProvider>
          </MessagesContext.Provider>
        </UserDetailsContext.Provider>
      </DialogContext.Provider>
    </GoogleOAuthProvider>
  );
}
