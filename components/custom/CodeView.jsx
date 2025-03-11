"use client";
import { MessagesContext } from "@/context/MessagesContext";
import Lookup from "@/data/Lookup";
import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackStack,
  SandpackLayout,
  LoadingOverlay,
} from "@codesandbox/sandpack-react";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { useContext, useEffect, useState } from "react";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";

const CodeView = () => {
  const {id} = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState(structuredClone(Lookup.DEFAULT_FILE));
  const { messages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setIsLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    console.log(result?.fileData);
    const mergedFiles = {...Lookup.DEFAULT_FILE, ...result?.fileData};
    setFiles(mergedFiles);
    setIsLoading(false);
  }

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1]?.role;
      if (role === "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    try {
      setIsLoading(true);
      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post("/api/gen-code", {
        prompt: PROMPT,
      });

      const aiResp = result.data;
      console.log("aiResp:", aiResp);

      // Create a new object for the merged files
      const mergedFiles = { ...structuredClone(Lookup.DEFAULT_FILE) };
      
      // Handle different file structures in the AI response
      if (aiResp && typeof aiResp === 'object') {
        // Check if aiResp has a 'files' property
        const fileSource = aiResp.files || aiResp;
        
        Object.keys(fileSource).forEach(filePath => {
          const fileContent = fileSource[filePath];
          if (typeof fileContent === 'object' && fileContent.code) {
            // Add or replace the file in mergedFiles
            mergedFiles[filePath] = fileContent;
            
            // If this is an App.js/jsx file and we have an App.tsx in our default files,
            // we should update App.tsx with this content
            if ((filePath === '/App.js' || filePath === '/App.jsx') && mergedFiles['/App.tsx']) {
              mergedFiles['/App.tsx'] = {
                ...mergedFiles['/App.tsx'],
                code: fileContent.code
              };
              // Optionally, delete the .js/.jsx version to avoid confusion
              delete mergedFiles[filePath];
            }
          }
        });
      }
      
      console.log("mergedFiles:", mergedFiles);
      setFiles(mergedFiles);

      await UpdateFiles({
        workspaceId: id,
        files: mergedFiles,
      })

    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated files in state:", files);
  }, [files]);

  return (
    <div className="h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-purple-500 bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-purple-600 text-white p-4 rounded-md flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating code...</span>
          </div>
        </div>
      )}
      
      <div className="flex gap-3 p-2 bg-[#151515]">
        <h1
          onClick={() => setActiveTab("code")}
          className={`${
            activeTab == "code" ? "bg-purple-500" : "bg-gray-800"
          } p-2 rounded-md text-white cursor-pointer`}
        >
          Code
        </h1>
        <h1
          onClick={() => setActiveTab("preview")}
          className={`${
            activeTab == "preview" ? "bg-purple-500" : "bg-gray-800"
          } p-2 rounded-md text-white cursor-pointer`}
        >
          Preview
        </h1>
      </div>

      {/* Ensure files is defined before rendering Sandpack */}
      {files && (
        <SandpackProvider
          activeTab={'index.tsx'}
          key={JSON.stringify(files)}
          template="react-ts"
          files={files}
          customSetup={{
            dependencies: {
              ...Lookup.DEPENDANCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackThemeProvider
            theme={"dark"}
            style={{ fontWeight: 600, fontSize: "14px" }}
          >
            <SandpackStack>
              <SandpackLayout style={{ height: "80vh" }}>
                {activeTab == "code" ? (
                  <>
                    <SandpackFileExplorer activeTab={'index.tsx'} />
                    <SandpackCodeEditor
                      wrapContent
                      style={{
                        minHeight: "100%",
                        maxHeight: "100%",
                        overflow: "auto",
                      }}
                      showTabs
                      closableTabs
                      showInlineErrors
                      showLineNumbers
                    />
                  </>
                ) : (
                  <SandpackPreview
                    style={{ height: "80vh" }}
                    showNavigator
                    onLoad={() => console.log("loading preview...")}
                  />
                )}
              </SandpackLayout>
            </SandpackStack>
          </SandpackThemeProvider>
        </SandpackProvider>
      )}
    </div>
  );
};

export default CodeView;