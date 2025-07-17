import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Type, Palette } from "lucide-react";

interface StylingOptions {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  primaryColor: string;
  selectedElement?: string | null;
}

interface StyleCustomizerProps {
  onClose: () => void;
  currentOptions: StylingOptions;
  onOptionsChange: (options: StylingOptions) => void;
}

const fontFamilies = [
  { label: "Inter", value: "Inter" },
  { label: "Roboto", value: "Roboto" },
  { label: "Poppins", value: "Poppins" },
  { label: "Playfair Display", value: "Playfair Display" },
  { label: "Open Sans", value: "Open Sans" },
  { label: "Lato", value: "Lato" },
  { label: "Montserrat", value: "Montserrat" },
];

const fontSizes = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

const fontWeights = [
  { label: "Light", value: "300" },
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
];

const colors = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#1f2937"
];

export const StyleCustomizer = ({ onClose, currentOptions, onOptionsChange }: StyleCustomizerProps) => {
  const [options, setOptions] = useState(currentOptions);
  const [elementSelection, setElementSelection] = useState<"all" | "selected">("all");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleChange = (key: keyof StylingOptions, value: string) => {
    const newOptions = { 
      ...options, 
      [key]: value,
      selectedElement: elementSelection === "selected" ? selectedElementId : null
    };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const handleElementSelectionChange = (value: "all" | "selected") => {
    setElementSelection(value);
    if (value === "all") {
      setSelectedElementId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Style Customizer</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Apply Changes To</Label>
            <Select value={elementSelection} onValueChange={handleElementSelectionChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="selected">Selected Element Only</SelectItem>
              </SelectContent>
            </Select>
            {elementSelection === "selected" && (
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">
                  Note: Click on an element in the preview to select it, then apply styling changes
                </Label>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select value={options.fontFamily} onValueChange={(value) => handleChange("fontFamily", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select value={options.fontSize} onValueChange={(value) => handleChange("fontSize", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Font Weight</Label>
            <Select value={options.fontWeight} onValueChange={(value) => handleChange("fontWeight", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontWeights.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    <span style={{ fontWeight: weight.value }}>{weight.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Font Style</Label>
            <Select value={options.fontStyle} onValueChange={(value) => handleChange("fontStyle", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="italic">
                  <span style={{ fontStyle: "italic" }}>Italic</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-md border-2 transition-all ${
                    options.primaryColor === color ? "border-foreground scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange("primaryColor", color)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={onClose} className="w-full">
            Apply Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};