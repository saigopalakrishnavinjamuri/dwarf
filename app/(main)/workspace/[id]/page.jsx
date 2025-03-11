import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";

const page = () => {
    return (
        <div className="h-[90%] w-full px-6 pt-0 pb-5 ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 h-full">
                <ChatView />
                <div className="col-span-3">
                    <CodeView />
                </div>
            </div>
        </div>
    );
}

export default page;