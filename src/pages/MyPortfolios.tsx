import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Plus, Edit, Eye, Trash2, Copy, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Portfolio {
  id: string;
  title: string;
  theme: string;
  is_published: boolean;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export default function MyPortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPortfolios();
  }, [user, navigate]);

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("id, title, theme, is_published, slug, created_at, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      toast.error("Failed to fetch portfolios");
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async () => {
    if (!newPortfolioTitle.trim()) {
      toast.error("Please enter a portfolio title");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("portfolios")
        .insert({
          user_id: user!.id,
          title: newPortfolioTitle.trim(),
          blocks: [],
          theme: "elegant"
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Portfolio created!");
      setNewPortfolioTitle("");
      setShowCreateForm(false);
      navigate(`/builder/${data.id}`);
    } catch (error) {
      toast.error("Failed to create portfolio");
    }
  };

  const deletePortfolio = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      const { error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Portfolio deleted");
      fetchPortfolios();
    } catch (error) {
      toast.error("Failed to delete portfolio");
    }
  };

  const duplicatePortfolio = async (portfolio: Portfolio) => {
    try {
      const { data: originalData, error: fetchError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolio.id)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("portfolios")
        .insert({
          user_id: user!.id,
          title: `${originalData.title} (Copy)`,
          blocks: originalData.blocks,
          theme: originalData.theme,
          styling_options: originalData.styling_options
        });

      if (error) throw error;

      toast.success("Portfolio duplicated!");
      fetchPortfolios();
    } catch (error) {
      toast.error("Failed to duplicate portfolio");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl font-bold">My Portfolios</h1>
              <p className="text-muted-foreground">
                Manage and organize your portfolio collections
              </p>
            </div>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Portfolio
          </Button>
        </div>

        {showCreateForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Create New Portfolio</h3>
            <div className="flex gap-4">
              <Input
                placeholder="Portfolio title (e.g., Web Developer Portfolio)"
                value={newPortfolioTitle}
                onChange={(e) => setNewPortfolioTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createPortfolio()}
              />
              <Button onClick={createPortfolio}>Create</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {portfolios.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first portfolio to get started building your professional presence.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="p-6 hover:shadow-medium transition-shadow">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{portfolio.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Theme: {portfolio.theme.charAt(0).toUpperCase() + portfolio.theme.slice(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated: {new Date(portfolio.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  {portfolio.is_published && portfolio.slug && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <ExternalLink className="w-3 h-3" />
                      Published
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/builder/${portfolio.id}`)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (portfolio.slug) {
                          window.open(`/portfolio/${portfolio.slug}`, '_blank');
                        } else {
                          toast.error("Portfolio not published yet");
                        }
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => duplicatePortfolio(portfolio)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePortfolio(portfolio.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}