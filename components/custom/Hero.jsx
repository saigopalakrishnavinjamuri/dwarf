import { MessagesContext } from "../../context/MessagesContext";
import { UserDetailsContext } from "../../context/UserDetailsContext";
import Lookup from "../../data/Lookup";
import { ArrowRight } from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import SigninDialog from "./SigninDialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { DialogContext } from "../../context/DialogContext";

const Hero = () => {

    const CreateWorkSpace = useMutation(api.workspace.CreateWorkSpace);

    const router = useRouter();
    const { messages, setMessages } = useContext(MessagesContext);
    const { userDetails, setUserDetails } = useContext(UserDetailsContext);
    const { openDialog, setOpenDialog } = useContext(DialogContext);

    const [userPrompt, setUserPrompt] = useState('');

    useEffect(() => {
        if (!userDetails) {
            if (typeof window !== "undefined" && window.localStorage) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUserDetails(JSON.parse(storedUser));
                }
            }
        }
    }, [userDetails, setUserDetails]);

    const onGenerate = async (input) => {
        console.log("entered onGenerate function");
        console.log(userDetails);

        if (!userDetails?.name) {
            setOpenDialog(true);
            console.log('true');
            return;
        }
        console.log('authenticated');
        const msg = {
            role: 'user',
            content: input
        };
        setMessages(msg);

        if (!userDetails._id) {
            console.error("User ID is null");
            return;
        }

        const workspaceId = await CreateWorkSpace({
            messages: [msg],
            user: userDetails._id,
        });

        console.log(workspaceId);
        setUserPrompt('');
        router.push('/workspace/' + workspaceId);
    };

    return (
        <div className="h-[90%] w-full flex justify-center items-center">
            <div className="flex flex-col items-center justify-center h-[90%]">
                <h1 className="font-bold text-6xl">{Lookup.HERO_HEADING}</h1>
                <p className="text-lg mt-4 text-gray-400">{Lookup.HERO_DESC}</p>

                <div className="flex rounded-md mt-16 h-14 w-[35vw] border border-gray-600 bg-gray-800 shadow-md">
    <input 
        value={userPrompt} 
        onChange={(e) => setUserPrompt(e.target.value)} 
        type="text" 
        className="h-full w-[85%] px-4 outline-none rounded-l-md bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500" 
        placeholder={Lookup.INPUT_PLACEHOLDER} 
        name="prompt" 
    />
    <div 
        onClick={() => onGenerate(userPrompt)} 
        className="cursor-pointer w-[15%] bg-purple-700 text-white rounded-r-md flex items-center justify-center hover:bg-purple-600 active:scale-95 transition-all"
    >
        <ArrowRight size={24} />
    </div>
</div>


                <div className="flex flex-row mt-8 text-md text-gray-400 justify-center items-center gap-4 flex-nowrap">
    <h4 className="font-semibold text-gray-300 whitespace-nowrap">Example Prompts like</h4>
    
    {[Lookup.Example_prompt, Lookup.Example_prompt1, Lookup.Example_prompt2].map((prompt, index) => (
        <div 
            key={index} 
            className="flex flex-row items-center justify-center border border-gray-600 px-3 py-2 rounded-2xl 
                       hover:border-gray-400 hover:shadow-lg hover:scale-105 text-center whitespace-nowrap"
        >
            <p className="text-purple-400 cursor-pointer text-sm font-medium">{prompt}</p>
        </div>
    ))}
</div>




            </div>
            <SigninDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(false)} />
        </div>
    );
};

export default Hero;