"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import { useContext } from "react";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { DialogContext } from "@/context/DialogContext";

const Header = () => {
    const { userDetails, setUserDetails } = useContext(UserDetailsContext);
    const { setOpenDialog } = useContext(DialogContext)

    const goBack = () => {
        window.location.href = '/';
        localStorage.clear();
    }
    return (
        <div className={`p-4 flex justify-between h-[10%]`}>
            <Image src={'/logo.png'} width={150} height={50} alt={'logo'} />
            {!userDetails && (
                <div className="flex gap-2">
                    <Button onClick={() => setOpenDialog(true)} variant="secondary">Sign In</Button>
                    <Button onClick={() => setOpenDialog(true)} className="bg-purple-700 hover:bg-purple-500 text-white">Get Started</Button>
                </div>
            )}

            {userDetails && typeof window !== "undefined" && window.location.pathname !== '/' && (
            <Button onClick={goBack} className="bg-purple-700 hover:bg-purple-500 text-white">
                Go Back
            </Button>
            )}
        </div>
    );
}

export default Header;