import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GripVertical, Edit3, Trash2, Save, X, User, Briefcase, Star, Phone, Award, Upload, Image } from "lucide-react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageCropper } from './ImageCropper';

interface PortfolioBlock {
  id: string;
  type: "about" | "skills" | "projects" | "testimonials" | "contact" | "custom" | "image";
  title: string;
  content: string;
  order: number;
  imageUrl?: string;
  selectedElement?: string | null;
}

interface DraggablePortfolioBlockProps {
  block: PortfolioBlock;
  onUpdate: (blockId: string, newContent: string, newTitle?: string, imageUrl?: string, selectedElement?: string | null) => void;
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
  custom: Star,
  image: Image,
};

const blockColors = {
  about: "bg-blue-50 border-blue-200 text-blue-700",
  skills: "bg-green-50 border-green-200 text-green-700", 
  projects: "bg-purple-50 border-purple-200 text-purple-700",
  testimonials: "bg-yellow-50 border-yellow-200 text-yellow-700",
  contact: "bg-pink-50 border-pink-200 text-pink-700",
  custom: "bg-gray-50 border-gray-200 text-gray-700",
  image: "bg-indigo-50 border-indigo-200 text-indigo-700",
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
  const [editedImageUrl, setEditedImageUrl] = useState(block.imageUrl || "");
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = blockIcons[block.type];
  const colorClass = blockColors[block.type];

  const handleSave = () => {
    onUpdate(block.id, editedContent, editedTitle, editedImageUrl);
    onEdit(block.id); // Close editing mode
  };

  const handleCancel = () => {
    setEditedContent(block.content);
    setEditedTitle(block.title);
    setEditedImageUrl(block.imageUrl || "");
    onEdit(block.id); // Close editing mode
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImageUrl(result);
        setShowImageCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setEditedImageUrl(croppedImageUrl);
    setShowImageCropper(false);
    // Auto-save after cropping
    setTimeout(() => {
      onUpdate(block.id, editedContent, editedTitle, croppedImageUrl);
    }, 100);
  };

  if (isEditing) {
    return (
      <Card 
        ref={setNodeRef} 
        style={style}
        className="p-4 bg-gradient-card shadow-soft border-l-4 border-l-primary animate-fade-in"
      >
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
          
          <div className="space-y-4">
            {/* Only show textarea for non-image blocks */}
            {block.type !== "image" && (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[120px] resize-none"
                placeholder="Enter your content here..."
              />
            )}
            
            {/* Image Upload Section - Only for Image blocks */}
            {block.type === "image" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload Image
                  </Button>
                  {editedImageUrl && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditedImageUrl("")}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove Image
                    </Button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {editedImageUrl && (
                  <div className="mt-2 flex justify-center">
                    <img 
                      src={editedImageUrl} 
                      alt="Preview" 
                      className="w-48 h-48 object-cover rounded-full border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
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
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`p-4 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-200 group ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
          </div>
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <IconComponent className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-2">{block.title}</h3>
          {block.type === "image" && block.imageUrl && (
            <img 
              src={block.imageUrl} 
              alt={block.title} 
              className="w-16 h-16 object-cover rounded-full mb-2 border"
            />
          )}
          {block.type !== "image" && (
            <p className="text-sm text-muted-foreground line-clamp-3">{block.content}</p>
          )}
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
      
      {/* Image Cropper Modal */}
      {showImageCropper && originalImageUrl && (
        <ImageCropper
          isOpen={showImageCropper}
          onClose={() => setShowImageCropper(false)}
          onCropComplete={handleCropComplete}
          imageUrl={originalImageUrl}
        />
      )}
    </Card>
  );
};