import { chatSession } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {prompt} = await req.json();

    try{
        const result = await chatSession.sendMessage(prompt);
        const Modelres = result.response.text();

        return NextResponse.json({result:Modelres}); 
    }catch(e){
        return NextResponse.json({error:e}); 
    }
}