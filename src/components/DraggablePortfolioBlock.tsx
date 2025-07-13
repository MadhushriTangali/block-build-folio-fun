import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GripVertical, Edit3, Trash2, Save, X, User, Briefcase, Star, Phone, Award } from "lucide-react";

interface PortfolioBlock {
  id: string;
  type: "about" | "skills" | "projects" | "testimonials" | "contact";
  title: string;
  content: string;
  order: number;
}

interface DraggablePortfolioBlockProps {
  block: PortfolioBlock;
  onUpdate: (blockId: string, newContent: string) => void;
  onDelete: (blockId: string) => void;
  isEditing: boolean;
  onEdit: (blockId: string) => void;
}

const blockIcons = {
  about: User,
  skills: Award,
  projects: Briefcase,
  testimonials: Star,
  contact: Phone,
};

const blockColors = {
  about: "bg-blue-50 border-blue-200 text-blue-700",
  skills: "bg-green-50 border-green-200 text-green-700", 
  projects: "bg-purple-50 border-purple-200 text-purple-700",
  testimonials: "bg-yellow-50 border-yellow-200 text-yellow-700",
  contact: "bg-pink-50 border-pink-200 text-pink-700",
};

export const DraggablePortfolioBlock = ({
  block,
  onUpdate,
  onDelete,
  isEditing,
  onEdit,
}: DraggablePortfolioBlockProps) => {
  const [editedContent, setEditedContent] = useState(block.content);
  const [editedTitle, setEditedTitle] = useState(block.title);

  const IconComponent = blockIcons[block.type];
  const colorClass = blockColors[block.type];

  const handleSave = () => {
    onUpdate(block.id, editedContent);
    onEdit(block.id); // Close editing mode
  };

  const handleCancel = () => {
    setEditedContent(block.content);
    setEditedTitle(block.title);
    onEdit(block.id); // Close editing mode
  };

  if (isEditing) {
    return (
      <Card className="p-4 bg-gradient-card shadow-soft border-l-4 border-l-primary animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="font-medium"
              placeholder="Section title"
            />
          </div>
          
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[120px] resize-none"
            placeholder="Enter your content here..."
          />
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(block.id)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-200 group cursor-move">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <IconComponent className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-2">{block.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{block.content}</p>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(block.id)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};