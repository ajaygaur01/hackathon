import { Brain, ChevronRight, Code, Globe, Lightbulb, Server, Users } from "lucide-react";

const BentoGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    {[
      {
        title: "Code Creation and Review",
        description: "Generate, review and debug code with the help of AI",
        icon: Brain,
        spanCols: false
      },
      {
        title: "Code Challenge Arena",
        description: "Test your skills with daily challenges ranging from beginner to competitive programming level",
        icon: Code,
        spanCols: false
      },
      {
        title: "Project-Based Learning",
        description: "Build real-world applications while mastering CS fundamentals",
        icon: Server,
        spanCols: false
      },
      {
        title: "AI-Powered Learning Assistant",
        description: "Get personalized help and feedback on your code with our intelligent tutor",
        icon: Lightbulb,
        spanCols: true
      },
      {
        title: "Global Student Community",
        description: "Connect, collaborate and learn with CS students from around the world",
        icon: Globe,
        spanCols: true 
      }
    ].map((item, i) => (
      <div 
        key={i} 
        className={`${item.spanCols ? 'md:col-span-3' : ''} bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all group`}
      >
        <div className="flex items-start justify-between">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <item.icon className="text-white" size={20} />
          </div>
          {!item.spanCols && (
            <div className="bg-blue-500/10 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="text-blue-400" size={16} />
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
        <p className="text-gray-300">{item.description}</p>
        
        {item.spanCols && (
          <div className="mt-4 flex flex-wrap gap-4">
            {item.icon === Lightbulb ? (
              <div className="mt-4 w-full">
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Lightbulb className="text-blue-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full bg-white/10 rounded-full mb-2"></div>
                    <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 p-4 rounded-lg border border-white/5 flex items-center gap-4 mt-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Code className="text-blue-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full bg-white/5 rounded-full mb-2"></div>
                    <div className="h-2 w-1/2 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-white/10 text-center">
                  <Users className="text-blue-400 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-300">Study Groups</p>
                </div>
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-white/10 text-center">
                  <Code className="text-blue-400 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-300">Coding Challenges</p>
                </div>
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-white/10 text-center">
                  <Server className="text-blue-400 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-300">Project Collaboration</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);


export default BentoGrid;