import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

interface Portfolio {
  id: string;
  title: string;
  blocks: PortfolioBlock[];
  theme: string;
  styling_options: StylingOptions;
}

const PublicPortfolio = () => {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPortfolio();
    }
  }, [slug]);

  const loadPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;

      setPortfolio({
        id: data.id,
        title: data.title,
        blocks: (data.blocks as unknown as PortfolioBlock[]) || [],
        theme: data.theme || "elegant",
        styling_options: (data.styling_options as unknown as StylingOptions) || {
          fontFamily: "Inter",
          fontSize: "medium",
          fontWeight: "400",
          fontStyle: "normal",
          primaryColor: "#6366f1"
        }
      });
    } catch (error) {
      toast.error("Portfolio not found");
    } finally {
      setLoading(false);
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

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground">The portfolio you're looking for doesn't exist or isn't published.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        fontFamily: portfolio.styling_options.fontFamily,
        fontSize: portfolio.styling_options.fontSize === "small" ? "14px" : portfolio.styling_options.fontSize === "large" ? "18px" : "16px",
        fontWeight: portfolio.styling_options.fontWeight,
        fontStyle: portfolio.styling_options.fontStyle,
      }}
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: portfolio.styling_options.primaryColor }}
          >
            {portfolio.title}
          </h1>
          <div 
            className="w-24 h-1 mx-auto rounded"
            style={{ backgroundColor: portfolio.styling_options.primaryColor }}
          ></div>
        </div>

        {/* Blocks */}
        <div className="space-y-8">
          {portfolio.blocks
            .sort((a, b) => a.order - b.order)
            .map((block) => (
              <Card key={block.id} className="p-8 shadow-lg">
                {block.type === "image" && block.imageUrl ? (
                  <div className="flex justify-center">
                    <img 
                      src={block.imageUrl} 
                      alt={block.title} 
                      className="w-48 h-48 object-cover rounded-full border-2"
                      style={{ borderColor: portfolio.styling_options.primaryColor }}
                    />
                  </div>
                ) : (
                  <>
                    <h2 
                      className="text-2xl font-semibold mb-4"
                      style={{ color: portfolio.styling_options.primaryColor }}
                    >
                      {block.title}
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {block.content}
                      </p>
                    </div>
                  </>
                )}
              </Card>
            ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Created with ❤️ using Portfolio Builder
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;