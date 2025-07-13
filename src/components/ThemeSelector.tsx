import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Check } from "lucide-react";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  onClose: () => void;
}

const themes = [
  {
    id: "elegant",
    name: "Elegant Minimal",
    description: "Clean and professional",
    preview: "bg-gradient-to-br from-slate-50 to-slate-100",
    accent: "bg-slate-900",
  },
  {
    id: "colorful", 
    name: "Bold & Colorful",
    description: "Vibrant and creative",
    preview: "bg-gradient-to-br from-purple-100 to-pink-100",
    accent: "bg-purple-600",
  },
  {
    id: "dark",
    name: "Dark Mode Pro", 
    description: "Sleek and modern",
    preview: "bg-gradient-to-br from-gray-800 to-gray-900",
    accent: "bg-blue-500",
  },
  {
    id: "modern",
    name: "Clean & Modern",
    description: "Minimalist approach",
    preview: "bg-gradient-to-br from-blue-50 to-indigo-50", 
    accent: "bg-blue-600",
  },
  {
    id: "soft",
    name: "Feminine Soft",
    description: "Gentle and warm",
    preview: "bg-gradient-to-br from-rose-50 to-pink-50",
    accent: "bg-rose-500",
  },
];

export const ThemeSelector = ({ selectedTheme, onThemeChange, onClose }: ThemeSelectorProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 bg-background shadow-strong animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Theme</h2>
            <p className="text-muted-foreground">Pick a style that matches your personality</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedTheme === theme.id ? "ring-2 ring-primary shadow-medium" : ""
              }`}
              onClick={() => onThemeChange(theme.id)}
            >
              <Card className="p-4 bg-gradient-card border-0 shadow-soft">
                {/* Theme Preview */}
                <div className={`h-32 rounded-lg mb-4 ${theme.preview} relative overflow-hidden`}>
                  <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${theme.accent}`}></div>
                      <div className="space-y-1">
                        <div className="w-16 h-2 bg-foreground/20 rounded"></div>
                        <div className="w-12 h-1 bg-foreground/10 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-20 h-2 bg-foreground/20 rounded"></div>
                      <div className="w-16 h-1 bg-foreground/10 rounded"></div>
                      <div className="w-12 h-1 bg-foreground/10 rounded"></div>
                    </div>
                  </div>
                  
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onClose}>
            Apply Theme
          </Button>
        </div>
      </Card>
    </div>
  );
};