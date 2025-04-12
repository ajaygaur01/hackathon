"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Share2, Copy, Download } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [textPrompt, setTextPrompt] = useState("");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [image, setImage] = useState(null);
  const [generatedText, setGeneratedText] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error("Please enter an image prompt");
      return;
    }

    try {
      setImageLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(data.imageUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  const generateText = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your post");
      return;
    }

    try {
      setTextLoading(true);
      const response = await fetch("/api/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: textPrompt,
          topic,
          platform
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate text");
      }

      setGeneratedText(data.text);
      toast.success("Text generated successfully!");
    } catch (error) {
      toast.error("Failed to generate text. Please try again.");
    } finally {
      setTextLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadImage = () => {
    if (!image) return;
    
    const link = document.createElement("a");
    link.href = image;
    link.download = "edtech-generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image download started!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">EdTech Social Media Creator</h1>
          <p className="text-gray-400">Create engaging images and text for your educational content</p>
        </div>

        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="image">Generate Image</TabsTrigger>
            <TabsTrigger value="text">Generate Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="image">
            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Image Description</label>
                  <Input
                    placeholder="Describe the educational image you want to create..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <Button
                  onClick={generateImage}
                  disabled={imageLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {imageLoading ? (
                    "Generating..."
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>

                {imageLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Creating your educational visual...</p>
                  </div>
                )}

                {image && !imageLoading && (
                  <div className="mt-8 space-y-4">
                    <img
                      src={image}
                      alt="Generated educational image"
                      className="rounded-lg w-full object-cover shadow-xl"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        onClick={downloadImage}
                        variant="outline" 
                        size="sm"
                        className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="text">
            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Topic</label>
                  <Input
                    placeholder="What educational topic is your post about?"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full rounded-md bg-gray-700 border-gray-600 text-white p-2"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Additional Instructions (Optional)</label>
                  <Textarea
                    placeholder="E.g., Add statistics, include questions, keep it concise..."
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-20"
                  />
                </div>
                
                <Button
                  onClick={generateText}
                  disabled={textLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {textLoading ? (
                    "Generating..."
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Post Text
                    </>
                  )}
                </Button>

                {textLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Crafting your educational post...</p>
                  </div>
                )}

                {generatedText && !textLoading && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Generated {platform.charAt(0).toUpperCase() + platform.slice(1)} Post</h3>
                      <div className="text-gray-200 whitespace-pre-line">{generatedText}</div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        onClick={() => copyToClipboard(generatedText)}
                        variant="outline" 
                        size="sm"
                        className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Text
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {image && generatedText && (
          <Card className="p-6 bg-gray-800/50 border-gray-700 mt-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Your Complete Social Media Post</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <img
                    src={image}
                    alt="Generated educational image"
                    className="rounded-lg w-full object-cover shadow-xl"
                  />
                </div>
                <div className="md:w-1/2">
                  <div className="p-4 bg-gray-700 rounded-lg h-full">
                    <div className="text-gray-200 whitespace-pre-line">{generatedText}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => toast.success("Ready to share! (Share functionality would be implemented here)")}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Post
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}