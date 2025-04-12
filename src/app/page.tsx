import { BentoGrid } from "@/components/ui/bento-grid"
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
        <BackgroundBeams className="absolute inset-0" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#2563EB]">
            Unleash Your Learning Potential
          </h2>

          <BentoGrid />
        </div>
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
