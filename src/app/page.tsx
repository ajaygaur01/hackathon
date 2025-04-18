import  BentoGrid  from "@/components/ui/bento-grid"
import { HeroSection } from "@/components/hero-section"
import { FeatureShowcase } from "@/components/feature-showcase"
import { NavBar } from "@/components/nav-bar"
import { TextRevealCard } from "@/components/text-reveal-card"
import { WobbleCard } from "@/components/wobble-card"
// import { BlobCursor } from "@/components/blob-cursor"
import { LampEffect } from "@/components/lamp-effect"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { TracksSection } from "@/components/tracks-section"
import { Footer } from "@/components/footer"
import { FeatureCards } from "@/components/feature-cards"



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#050A1C]">
      {/* <div className="z-1000">
        <BlobCursor />
      </div> */}
      <NavBar />

      <HeroSection />

      <div className="w-full relative overflow-hidden py-20">
    {/* Enhanced Background Beams */}
    <BackgroundBeams className="absolute inset-0" />
    
    {/* Content */}
    <div className="container mx-auto px-4 relative z-10">
      {/* Hero Heading */}
      <div className="mb-16 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600">
          Unleash Your Learning Potential
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          The ultimate platform for computer science students to master programming concepts, algorithms, and ace technical interviews
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50">
            Start Learning
          </button>
          <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg border border-white/20 transition-all">
            View Courses
          </button>
        </div>
      </div>
      
      {/* Stats Section */}
      {/* <StatsSection /> */}
      
      {/* Learning Path */}
      {/* <LearningPath /> */}
      
      {/* Enhanced Bento Grid */}
      <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">
        All You Need to Succeed in Computer Science
      </h3>
      <BentoGrid />
    </div>
    
    {/* Additional decorative elements */}
    <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
    <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
  </div>

      <FeatureShowcase />

      <LampEffect>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Transform Your Learning Journey</h2>
          <p className="text-lg text-gray-300 mb-8">
            Edu-Ease.ai combines AI-powered tools with practical learning tracks to help you master coding skills faster
            than ever before.
          </p>
        </div>
      </LampEffect>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TextRevealCard text="AI-Playground" revealText="Build full-stack applications with AI assistance" />
          <WobbleCard title="Notes to Quiz" description="Convert your study notes into interactive quizzes instantly" />
        </div>
      </div>

      <FeatureCards />

      <TracksSection />

      <Footer />
    </main>
  )
}
