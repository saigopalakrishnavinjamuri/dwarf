"use client";

import { MessagesContext } from "../../context/MessagesContext";
import { UserDetailsContext } from "../../context/UserDetailsContext";
import { api } from "../../convex/_generated/api";
import Colors from "../../data/Colors";
import Lookup from "../../data/Lookup";
import Prompt from "../../data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowUp, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatView = () => {
    const { id } = useParams();
    const convex = useConvex();
    const { userDetails, setUserDetails } = useContext(UserDetailsContext);
    const { messages, setMessages } = useContext(MessagesContext);

    const UpdateMessages = useMutation(api.workspace.UpdateMessages);

    const [userPrompt, setUserPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (id) GetWorkspaceData();
        
        if (!userDetails) {
            if (typeof window !== "undefined" && window.localStorage) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUserDetails(JSON.parse(storedUser));
                }
            }
        }

        console.log(userDetails)
    }, [id]);

    useEffect(() => {
        if(messages?.length > 0) {
            const role = messages[messages.length - 1]?.role;
            if(role==='user') {
                GetAiResponse();
            }
        }
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages])

    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id,
        });

        // ✅ Ensure messages is always an array
        setMessages(result?.messages || []);
        console.log(result);
    };

    const GetAiResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', {
            prompt: PROMPT,
        })
        console.log(result?.data?.result);
        const aiResp = {
            role: 'ai',
            content: result?.data.result 
        }
        setMessages(prev => [...prev, aiResp])
        await UpdateMessages({
            messages: [...messages, aiResp],
            workspaceId: id,
        })
        setLoading(false);
    }

    const onGenerate = async (input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input,
        }])
        setUserPrompt('');
    }

    return (
        <div className="h-full overflow-hidden flex flex-col justify-between pb-3 px-2 py-2 border border-white border-opacity-5 rounded-lg">
            <div ref={chatContainerRef}  className="overflow-y-scroll scroll-hide h-full">
                {Array.isArray(messages) && messages.map((msg, index) => (
                    <div className="p-3 rounded-lg mb-2 flex gap-2 items-center" style={{ backgroundColor: Colors.CHAT_BACKGROUND }} key={index}>
                        {msg?.role === 'user' && (
                            <Image src={userDetails?.picture || "/default-avatar.png"} alt="user Image" className="rounded-full" width={35} height={35} />
                        )}
                        <ReactMarkdown className={`${msg?.role == 'user' ? "text-purple-500" : "text-gray-400 flex flex-col"}`}>{msg.content}</ReactMarkdown>
                    </div>
                ))}
                {loading && (
                    <div className="p-3 rounded-lg mb-2 flex gap-2 items-center">
                        <Loader2Icon className="animate-spin" />
                        <h4 className="text-gray-400">Generating Response...</h4>
                    </div>
                )}
            </div>

            <div className="flex rounded-md mt-8 h-16 w-full">
                <input onChange={(e) => setUserPrompt(e.target.value)} value={userPrompt} type="text" className="h-full w-[90%] px-4 outline-none rounded-l-md" placeholder={Lookup.INPUT_PLACEHOLDER} name="prompt" />
                <ArrowUp onClick={() => onGenerate(userPrompt)} size={20} className="cursor-pointer w-[10%] font-semibold bg-purple-700  text-white rounded-r-md h-full p-2" />
            </div>
        </div>
    );
};

export default ChatView;
