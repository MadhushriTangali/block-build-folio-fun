import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Palette, Eye, Save, Wand2 } from "lucide-react";
import { DraggablePortfolioBlock } from "@/components/DraggablePortfolioBlock";
import { ThemeSelector } from "@/components/ThemeSelector";
import { AIWritingAssistant } from "@/components/AIWritingAssistant";
import { toast } from "sonner";

interface PortfolioBuilderProps {
  onBack: () => void;
}

interface PortfolioBlock {
  id: string;
  type: "about" | "skills" | "projects" | "testimonials" | "contact";
  title: string;
  content: string;
  order: number;
}

const defaultBlocks: PortfolioBlock[] = [
  {
    id: "1",
    type: "about",
    title: "About Me",
    content: "Tell your story here. What makes you unique?",
    order: 0,
  },
  {
    id: "2", 
    type: "skills",
    title: "Skills",
    content: "List your key skills and expertise",
    order: 1,
  },
  {
    id: "3",
    type: "projects", 
    title: "Projects",
    content: "Showcase your best work and achievements",
    order: 2,
  },
  {
    id: "4",
    type: "contact",
    title: "Contact",
    content: "How can people reach you?",
    order: 3,
  },
];

export const PortfolioBuilder = ({ onBack }: PortfolioBuilderProps) => {
  const [blocks, setBlocks] = useState<PortfolioBlock[]>(defaultBlocks);
  const [selectedTheme, setSelectedTheme] = useState("elegant");
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);

  const handleSave = () => {
    toast.success("Portfolio saved successfully! 🎉");
  };

  const handlePreview = () => {
    toast.info("Opening preview in new tab...");
  };

  const handleBlockUpdate = (blockId: string, newContent: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, content: newContent } : block
    ));
  };

  const handleAddBlock = () => {
    const newBlock: PortfolioBlock = {
      id: Date.now().toString(),
      type: "about",
      title: "New Section",
      content: "Add your content here...",
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleReorderBlocks = (reorderedBlocks: PortfolioBlock[]) => {
    setBlocks(reorderedBlocks);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Portfolio Builder</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowThemeSelector(true)}
              >
                <Palette className="w-4 h-4" />
                Themes
              </Button>
              
              <Button
                variant="creative"
                onClick={() => setShowAIAssistant(true)}
              >
                <Wand2 className="w-4 h-4" />
                AI Assistant
              </Button>
              
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              
              <Button variant="default" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Builder Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Portfolio Blocks</h2>
              <Button variant="outline" size="sm" onClick={handleAddBlock}>
                <Plus className="w-4 h-4" />
                Add Block
              </Button>
            </div>
            
            <div className="space-y-4">
              {blocks
                .sort((a, b) => a.order - b.order)
                .map((block) => (
                  <DraggablePortfolioBlock
                    key={block.id}
                    block={block}
                    onUpdate={handleBlockUpdate}
                    onDelete={handleDeleteBlock}
                    isEditing={editingBlock === block.id}
                    onEdit={(blockId) => setEditingBlock(editingBlock === blockId ? null : blockId)}
                  />
                ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
            <Card className="p-6 h-full bg-gradient-card shadow-medium">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    Theme: {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
                  </p>
                </div>
                
                <div className="space-y-4 overflow-y-auto max-h-96">
                  {blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div key={block.id} className="p-4 bg-background rounded-lg border">
                        <h4 className="font-medium text-primary mb-2">{block.title}</h4>
                        <p className="text-sm text-muted-foreground">{block.content}</p>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      {/* AI Writing Assistant Modal */}
      {showAIAssistant && (
        <AIWritingAssistant
          onClose={() => setShowAIAssistant(false)}
          onContentGenerated={(content) => {
            // Handle AI generated content
            toast.success("Content generated! Apply it to any block.");
          }}
        />
      )}
    </div>
  );
};