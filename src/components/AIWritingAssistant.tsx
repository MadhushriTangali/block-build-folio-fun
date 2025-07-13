import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Wand2, Copy, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AIWritingAssistantProps {
  onClose: () => void;
  onContentGenerated: (content: string) => void;
}

const prompts = [
  {
    id: "about",
    title: "About Me",
    description: "Create a compelling personal introduction",
    icon: "👋",
  },
  {
    id: "project",
    title: "Project Description", 
    description: "Describe your project professionally",
    icon: "🚀",
  },
  {
    id: "skills",
    title: "Skills Summary",
    description: "List and describe your expertise",
    icon: "💡",
  },
  {
    id: "improve",
    title: "Improve Text",
    description: "Enhance existing content",
    icon: "✨",
  },
];

const sampleGeneratedContent = {
  about: "I'm a passionate creative professional with a love for innovative design and problem-solving. With over 5 years of experience in the industry, I specialize in creating user-centered solutions that make a real impact. When I'm not crafting digital experiences, you can find me exploring new technologies or enjoying a good coffee.",
  project: "This project showcases my expertise in modern web development using React and TypeScript. The application features a clean, responsive design with smooth animations and intuitive user interactions. I focused on creating an accessible and performant solution that delivers exceptional user experience across all devices.",
  skills: "Frontend Development: React, TypeScript, CSS/SASS • Design: Figma, Adobe Creative Suite • Backend: Node.js, Python • Tools: Git, VS Code, Webpack • Soft Skills: Team collaboration, problem-solving, creative thinking",
  improve: "Here's your improved content with better flow, clarity, and professional tone. The enhanced version maintains your authentic voice while making the message more compelling and engaging for your audience.",
};

export const AIWritingAssistant = ({ onClose, onContentGenerated }: AIWritingAssistantProps) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedPrompt) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = sampleGeneratedContent[selectedPrompt as keyof typeof sampleGeneratedContent];
    setGeneratedContent(content);
    setIsGenerating(false);
    
    toast.success("Content generated! ✨");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Content copied to clipboard!");
  };

  const handleUse = () => {
    onContentGenerated(generatedContent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-background shadow-strong animate-fade-in">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-creative/10 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-creative" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Writing Assistant</h2>
                <p className="text-muted-foreground">Let AI help you craft amazing content</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Prompt Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold">Choose what you'd like help with:</h3>
              
              <div className="grid gap-3">
                {prompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-medium ${
                      selectedPrompt === prompt.id
                        ? "ring-2 ring-primary bg-primary-light"
                        : "bg-gradient-card"
                    }`}
                    onClick={() => setSelectedPrompt(prompt.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{prompt.icon}</span>
                      <div>
                        <h4 className="font-medium">{prompt.title}</h4>
                        <p className="text-sm text-muted-foreground">{prompt.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {selectedPrompt && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Additional context (optional):
                  </label>
                  <Textarea
                    placeholder="Tell me more about what you'd like to include..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  <Button
                    variant="gradient"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Generated Content */}
            <div className="space-y-4">
              <h3 className="font-semibold">Generated Content:</h3>
              
              {generatedContent ? (
                <Card className="p-4 bg-gradient-card">
                  <div className="space-y-4">
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      className="min-h-[200px] resize-none"
                      placeholder="Generated content will appear here..."
                    />
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      <Button variant="default" size="sm" onClick={handleUse}>
                        Use This Content
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleGenerate}>
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 bg-muted/20 border-dashed border-2">
                  <div className="text-center text-muted-foreground">
                    <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a content type and click generate to get started!</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};