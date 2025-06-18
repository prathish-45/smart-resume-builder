
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, AlertCircle, Info } from "lucide-react";
import { ResumeData } from "@/pages/Index";

interface AISuggestionsProps {
  resumeData: ResumeData;
  onClose: () => void;
  onApplySuggestion: (field: string, suggestion: string) => void;
}

interface Suggestion {
  id: string;
  type: "improvement" | "warning" | "tip";
  field: string;
  title: string;
  description: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

export const AISuggestions = ({ resumeData, onClose, onApplySuggestion }: AISuggestionsProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Mock AI suggestions based on resume data analysis
  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    // Check summary length and quality
    if (!resumeData.summary || resumeData.summary.length < 50) {
      suggestions.push({
        id: "summary-length",
        type: "warning",
        field: "summary",
        title: "Professional Summary Too Short",
        description: "Your professional summary should be 2-3 sentences highlighting your key achievements.",
        suggestion: "Expand your summary to include specific achievements, years of experience, and key skills that make you stand out.",
        priority: "high"
      });
    }

    // Check for action verbs in experience
    if (resumeData.experience.length > 0) {
      const hasWeakDescriptions = resumeData.experience.some(exp => 
        exp.description && !exp.description.match(/\b(achieved|managed|led|developed|implemented|improved|increased|reduced|created|designed|launched)\b/i)
      );
      
      if (hasWeakDescriptions) {
        suggestions.push({
          id: "action-verbs",
          type: "improvement",
          field: "experience",
          title: "Use Stronger Action Verbs",
          description: "Your experience descriptions could benefit from more impactful action verbs.",
          suggestion: "Start bullet points with strong action verbs like 'achieved', 'managed', 'led', 'developed', 'implemented', or 'improved' to demonstrate impact.",
          priority: "medium"
        });
      }
    }

    // Check for quantifiable achievements
    if (resumeData.experience.length > 0) {
      const hasQuantifiableResults = resumeData.experience.some(exp => 
        exp.description && exp.description.match(/\d+%|\$\d+|\d+\+|increased|decreased|improved/i)
      );
      
      if (!hasQuantifiableResults) {
        suggestions.push({
          id: "quantify-achievements",
          type: "improvement",
          field: "experience",
          title: "Add Quantifiable Achievements",
          description: "Include specific numbers, percentages, or metrics to demonstrate your impact.",
          suggestion: "Add metrics like '25% increase in sales', '$50K cost savings', or 'managed team of 10' to show concrete results.",
          priority: "high"
        });
      }
    }

    // Check contact information completeness
    const missingContacts = [];
    if (!resumeData.personalInfo.email) missingContacts.push("email");
    if (!resumeData.personalInfo.phone) missingContacts.push("phone");
    if (!resumeData.personalInfo.location) missingContacts.push("location");

    if (missingContacts.length > 0) {
      suggestions.push({
        id: "contact-info",
        type: "warning",
        field: "personalInfo",
        title: "Complete Contact Information",
        description: `Missing ${missingContacts.join(", ")} in your contact information.`,
        suggestion: "Ensure all essential contact information is included so employers can easily reach you.",
        priority: "high"
      });
    }

    // Check skills section
    if (resumeData.skills.length === 0) {
      suggestions.push({
        id: "skills-section",
        type: "warning",
        field: "skills",
        title: "Add Skills Section",
        description: "A skills section helps recruiters quickly identify your capabilities.",
        suggestion: "Add relevant technical skills, software proficiencies, and industry-specific competencies.",
        priority: "medium"
      });
    }

    // General tips
    suggestions.push({
      id: "keywords-tip",
      type: "tip",
      field: "general",
      title: "Include Industry Keywords",
      description: "Use keywords from job descriptions to pass through ATS systems.",
      suggestion: "Review job postings in your field and incorporate relevant keywords naturally throughout your resume.",
      priority: "low"
    });

    return suggestions;
  };

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const newSuggestions = generateSuggestions();
      setSuggestions(newSuggestions);
      setLoading(false);
    }, 2000);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "improvement":
        return <Sparkles className="w-5 h-5 text-blue-500" />;
      case "tip":
        return <Info className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span>AI Resume Suggestions</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {suggestions.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Get AI-Powered Resume Insights
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Our AI will analyze your resume and provide personalized suggestions to improve your chances of landing interviews.
              </p>
              <Button
                onClick={handleGenerateSuggestions}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  {suggestions.length} Suggestions Found
                </h3>
                <Button
                  onClick={handleGenerateSuggestions}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Refresh Analysis
                </Button>
              </div>

              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getIconForType(suggestion.type)}
                        <div>
                          <CardTitle className="text-base">{suggestion.title}</CardTitle>
                          <p className="text-sm text-slate-600 mt-1">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(suggestion.priority)}
                      >
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">{suggestion.suggestion}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApplySuggestion(suggestion.field, suggestion.suggestion)}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Apply Suggestion</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
