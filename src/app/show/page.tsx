'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { StepsList } from '@/components/StepsList';
import { FileExplorer } from '@/components/FileExplorer';
import { TabView } from '@/components/TabView';
import { CodeEditor } from '@/components/CodeEditor';
import { PreviewFrame } from '@/components/PreviewFrame';
import axios from 'axios';
import { parseXml } from '@/lib/step';
import { useWebContainer } from '@/hooks/useWebContainers';
import { Loader } from '@/components/Loader';
import { BACKEND_URL, StepType } from '@/lib/utils';

export default function Builder() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt') || '';
  const [userPrompt, setUserPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const updateFileStructure = () => {
      let originalFiles = [...files];
      let updateHappened = false;
      
      steps.filter(({status}) => status === "pending").forEach(step => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? [];
          let currentFileStructure = [...originalFiles];
          const finalAnswerRef = currentFileStructure;

          let currentFolder = ""
          while(parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            const currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              const file = currentFileStructure.find(x => x.path === currentFolder);
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: 'file',
                  path: currentFolder,
                  content: step.code
                });
              } else {
                file.content = step.code;
              }
            } else {
              // in a folder
              const folder = currentFileStructure.find(x => x.path === currentFolder);
              if (!folder) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: 'folder',
                  path: currentFolder,
                  children: []
                });
              }
              currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

      if (updateHappened) {
        setFiles(originalFiles);
        setSteps(steps => steps.map(s => ({
          ...s,
          status: "completed"
        })));
      }
    };

    updateFileStructure();
  }, [steps, files]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
        return mountStructure[file.name];
      };
  
      files.forEach(file => processFile(file, true));
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  

  useEffect(() => {

    async function init() {
        try {
          const response = await axios.post(`${BACKEND_URL}/template`, {
            prompt: prompt.trim()
          });
          
          setTemplateSet(true);
          const {prompts, uiPrompts} = response.data;

          console.log(prompts, uiPrompts);
    
          setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
            ...x,
            status: "pending"
          })));

        
    
          setLoading(true);

          const allPrompts = [...prompts, prompt];
        
          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
            messages : allPrompts.map(content => ({
              role: "user",
              parts: [content]
            } ) )
          });
    
          setLoading(false);
          setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
            ...x,
            status: "pending" as const
          }))]);
    
          setLlmMessages([...prompts, prompt].map(content => ({
            role: "user",
            content
          })));
    
          setLlmMessages(x => [...x, {
            role: "assistant", 
            content: stepsResponse.data.response
          }]);
        } catch (error) {
          console.error('Initialization error:', error);
          setLoading(false);
        }
    }
    if (prompt) {
      init();
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div className="max-h-[75vh] overflow-scroll">
              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>
            <div>
              <div className='flex'>
                {(loading || !templateSet) && <Loader />}
                {!(loading || !templateSet) && (
                  <div className='flex w-full'>
                    <textarea 
                      value={userPrompt} 
                      onChange={(e) => setUserPrompt(e.target.value)}
                      className='p-2 w-full bg-gray-800 text-gray-100 rounded-l'
                      placeholder="Enter additional instructions..."
                    />
                    <button 
                      onClick={async () => {
                        const newMessage = {
                          role: "user" as const,
                          content: userPrompt
                        };

                        setLoading(true);
                        try {
                          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                            messages : [...llmMessages, newMessage].map(content => ({
                              role: "user",
                              parts: [content]
                            }))
                          });
                          
                          setLlmMessages(x => [...x, newMessage, {
                            role: "assistant",
                            content: stepsResponse.data.response
                          }]);
                          
                          setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                            ...x,
                            status: "pending" as const
                          }))]);
                        } catch (error) {
                          console.error('Error sending message:', error);
                        } finally {
                          setLoading(false);
                          setUserPrompt("");
                        }
                      }}
                      className='bg-purple-600 px-4 py-2 rounded-r hover:bg-purple-700 transition-colors'
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <FileExplorer 
              files={files} 
              onFileSelect={setSelectedFile}
            />
          </div>
          
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                webcontainer && <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}