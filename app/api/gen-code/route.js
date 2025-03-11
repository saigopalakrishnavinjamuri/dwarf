import { GenAiCode } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {prompt} = await req.json();

    try{
        const result = await GenAiCode.sendMessage(prompt);
        const Modelres = result.response.text();

        console.log('Model response:', Modelres);
        return NextResponse.json(JSON.parse(Modelres)); 
    }catch(e){
        return NextResponse.json({error:e}); 
    }
}