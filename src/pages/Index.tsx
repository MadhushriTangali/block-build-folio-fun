import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Palette, Wand2, Users, Rocket, ArrowRight, User } from "lucide-react";
import { PortfolioBuilder } from "@/components/PortfolioBuilder";
import { ThemeSelector } from "@/components/ThemeSelector";
import { AIWritingAssistant } from "@/components/AIWritingAssistant";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && showBuilder) {
      navigate("/portfolios");
    }
  }, [user, showBuilder, navigate]);

  if (showBuilder) {
    return <PortfolioBuilder onBack={() => setShowBuilder(false)} />;
  }

  const handleGetStarted = () => {
    if (user) {
      navigate("/portfolios");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Build Your Dream Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create stunning portfolios in minutes with drag-and-drop blocks, AI-powered writing, 
              and beautiful themes. No coding required!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={handleGetStarted}
              className="animate-slide-up"
            >
              <Sparkles className="w-5 h-5" />
              {user ? "My Portfolios" : "Start Building"}
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            {user ? (
              <div className="flex gap-2">
                <Button variant="outline" size="xl" onClick={() => navigate("/portfolios")} className="animate-slide-up">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="outline" size="xl" onClick={signOut} className="animate-slide-up">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="xl" onClick={() => navigate("/auth")} className="animate-slide-up">
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 animate-slide-up">
          <Card className="p-8 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Drag & Drop Builder</h3>
              <p className="text-muted-foreground">
                Build your portfolio like playing with Lego bricks. Drag, drop, and rearrange sections effortlessly.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-creative/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wand2 className="w-6 h-6 text-creative" />
              </div>
              <h3 className="text-xl font-semibold">AI Writing Assistant</h3>
              <p className="text-muted-foreground">
                Get help writing compelling content. Our AI buddy helps you craft the perfect About Me and project descriptions.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Beautiful Themes</h3>
              <p className="text-muted-foreground">
                Choose from professionally designed themes. From minimal elegance to bold creativity.
              </p>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Create Something Amazing?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of creators who've built their dream portfolios with our platform.
            </p>
          </div>
          
          <Button 
            variant="gradient" 
            size="xl" 
            onClick={handleGetStarted}
            className="animate-float"
          >
            <Rocket className="w-5 h-5" />
            {user ? "Go to Dashboard" : "Start Your Portfolio Journey"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
