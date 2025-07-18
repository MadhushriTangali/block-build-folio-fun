import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Palette, Eye, Save, Wand2, Type, Download, Link, Share } from "lucide-react";
import { DraggablePortfolioBlock } from "@/components/DraggablePortfolioBlock";
import { ThemeSelector } from "@/components/ThemeSelector";
import { AIWritingAssistant } from "@/components/AIWritingAssistant";
import { StyleCustomizer } from "@/components/StyleCustomizer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface PortfolioBuilderProps {
  onBack?: () => void;
}

interface StylingOptions {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  primaryColor: string;
}

interface PortfolioBlock {
  id: string;
  type: "about" | "skills" | "projects" | "testimonials" | "contact" | "custom" | "image";
  title: string;
  content: string;
  order: number;
  imageUrl?: string;
  selectedElement?: string | null;
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

const blockTypeLabels = {
  about: "About Me",
  skills: "Skills",
  projects: "Projects",
  testimonials: "Testimonials",
  contact: "Contact",
  custom: "Custom Section",
  image: "Image"
};

const getThemeStyles = (theme: string) => {
  const themeMap = {
    elegant: 'bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200',
    colorful: 'bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-lg border border-purple-200',
    dark: 'bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 text-white',
    modern: 'bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200',
    soft: 'bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200',
  };
  return themeMap[theme as keyof typeof themeMap] || themeMap.elegant;
};

export const PortfolioBuilder = ({ onBack }: PortfolioBuilderProps) => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [blocks, setBlocks] = useState<PortfolioBlock[]>(defaultBlocks);
  const [selectedTheme, setSelectedTheme] = useState("elegant");
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showStyleCustomizer, setShowStyleCustomizer] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [portfolioTitle, setPortfolioTitle] = useState("My Portfolio");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stylingOptions, setStylingOptions] = useState<StylingOptions>({
    fontFamily: "Inter",
    fontSize: "medium",
    fontWeight: "400",
    fontStyle: "normal",
    primaryColor: "#6366f1"
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (portfolioId) {
      loadPortfolio();
    } else {
      setLoading(false);
    }
  }, [user, portfolioId, navigate]);

  const loadPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolioId)
        .single();

      if (error) throw error;

      setPortfolioTitle(data.title);
      setBlocks((data.blocks as unknown as PortfolioBlock[]) || defaultBlocks);
      setSelectedTheme(data.theme || "elegant");
      setStylingOptions((data.styling_options as unknown as StylingOptions) || stylingOptions);
    } catch (error) {
      toast.error("Failed to load portfolio");
      navigate("/portfolios");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!portfolioId || !user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("portfolios")
        .update({
          blocks: blocks as any,
          theme: selectedTheme,
          styling_options: stylingOptions as any,
        })
        .eq("id", portfolioId);

      if (error) throw error;
      toast.success("Portfolio saved successfully! 🎉");
    } catch (error) {
      toast.error("Failed to save portfolio");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    toast.info("Opening preview in new tab...");
  };

  const handleBlockUpdate = (blockId: string, newContent: string, newTitle?: string, imageUrl?: string, selectedElement?: string | null) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { 
        ...block, 
        content: newContent,
        ...(newTitle && { title: newTitle }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(selectedElement !== undefined && { selectedElement })
      } : block
    ));
  };

  const handleAddBlock = (type: PortfolioBlock["type"] = "about") => {
    const newBlock: PortfolioBlock = {
      id: Date.now().toString(),
      type,
      title: blockTypeLabels[type],
      content: "Add your content here...",
      order: blocks.length,
      selectedElement: null,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleAddGeneralBlock = () => {
    const blockTypes: PortfolioBlock["type"][] = ["skills", "projects", "testimonials", "contact", "custom"];
    const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    const customNames = ["Experience", "Education", "Achievements", "Interests", "Biography"];
    const randomName = customNames[Math.floor(Math.random() * customNames.length)];
    
    const newBlock: PortfolioBlock = {
      id: Date.now().toString(),
      type: blockType,
      title: blockType === "custom" ? randomName : blockTypeLabels[blockType],
      content: "Add your content here...",
      order: blocks.length,
      selectedElement: null,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const handleDownload = () => {
    const portfolioHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: ${stylingOptions.fontFamily}, sans-serif;
            font-size: ${stylingOptions.fontSize === "small" ? "14px" : stylingOptions.fontSize === "large" ? "18px" : "16px"};
            font-weight: ${stylingOptions.fontWeight};
            font-style: ${stylingOptions.fontStyle};
            line-height: 1.6;
            color: #333;
            background: #ffffff;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .portfolio-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid ${stylingOptions.primaryColor};
            padding-bottom: 20px;
        }
        .portfolio-title {
            font-size: 2.5em;
            font-weight: bold;
            color: ${stylingOptions.primaryColor};
            margin-bottom: 10px;
        }
        .portfolio-block {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 8px;
            background: #f8f9fa;
            border-left: 4px solid ${stylingOptions.primaryColor};
        }
        .block-title {
            font-size: 1.5em;
            font-weight: 600;
            color: ${stylingOptions.primaryColor};
            margin-bottom: 15px;
        }
        .block-content {
            color: #555;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="portfolio-header">
        <h1 class="portfolio-title">${portfolioTitle}</h1>
    </div>
    
    ${blocks
      .sort((a, b) => a.order - b.order)
      .map(block => `
        <div class="portfolio-block">
            <h2 class="block-title">${block.title}</h2>
            <div class="block-content">${block.content}</div>
        </div>
    `).join('')}
    
    <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
</body>
</html>`;

    const blob = new Blob([portfolioHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolioTitle.replace(/[^a-z0-9]/gi, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Portfolio downloaded successfully!");
  };

  const handleGenerateLink = async () => {
    if (!portfolioId) return;
    
    try {
      const slug = `portfolio-${Date.now()}`;
      const { error } = await supabase
        .from("portfolios")
        .update({
          is_published: true,
          slug: slug
        })
        .eq("id", portfolioId);

      if (error) throw error;
      
      const shareUrl = `${window.location.origin}/portfolio/${slug}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Portfolio link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to generate share link");
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/portfolios");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBackClick}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">{portfolioTitle}</h1>
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
                variant="outline"
                onClick={() => setShowStyleCustomizer(true)}
              >
                <Type className="w-4 h-4" />
                Style
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
              
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4" />
                Download
              </Button>
              
              <Button variant="outline" onClick={handleGenerateLink}>
                <Share className="w-4 h-4" />
                Share
              </Button>
              
              <Button variant="default" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
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
              <div className="flex gap-2 flex-wrap">
                <Button variant="default" size="sm" onClick={handleAddGeneralBlock}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddBlock("about")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add About
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddBlock("skills")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skills
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddBlock("projects")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Projects
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddBlock("testimonials")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Testimonials
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddBlock("contact")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Contact
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddBlock("image")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Image
                </Button>
              </div>
            </div>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={blocks.sort((a, b) => a.order - b.order).map(block => block.id)}
                strategy={verticalListSortingStrategy}
              >
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
              </SortableContext>
            </DndContext>
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
                
                <div 
                  className={`space-y-4 overflow-y-auto max-h-96 ${getThemeStyles(selectedTheme)}`}
                  style={{
                    fontFamily: stylingOptions.fontFamily,
                    fontSize: stylingOptions.fontSize === "small" ? "14px" : stylingOptions.fontSize === "large" ? "18px" : "16px",
                    fontWeight: stylingOptions.fontWeight,
                    fontStyle: stylingOptions.fontStyle,
                    color: stylingOptions.primaryColor,
                  }}
                >
                  {blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                        <div key={block.id} className="p-4 bg-background rounded-lg border">
                           {block.type === "image" && block.imageUrl ? (
                             <div className="flex justify-end">
                               <img 
                                 src={block.imageUrl} 
                                 alt={block.title} 
                                 className="w-48 h-48 object-cover rounded-full border"
                               />
                             </div>
                           ) : (
                            <>
                              <h4 
                                className="font-medium mb-2"
                                style={{ color: stylingOptions.primaryColor }}
                              >
                                {block.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">{block.content}</p>
                            </>
                          )}
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

      {/* Style Customizer Modal */}
      {showStyleCustomizer && (
        <StyleCustomizer
          onClose={() => setShowStyleCustomizer(false)}
          currentOptions={stylingOptions}
          onOptionsChange={setStylingOptions}
        />
      )}
    </div>
  );
};