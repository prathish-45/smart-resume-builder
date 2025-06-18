
import { useState } from "react";
import { ResumeForm } from "@/components/ResumeForm";
import { ResumePreview } from "@/components/ResumePreview";
import { AISuggestions } from "@/components/AISuggestions";
import { Button } from "@/components/ui/button";
import { FileText, Download, Sparkles } from "lucide-react";

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
}

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handlePDFExport = () => {
    // Create a new window with only the resume content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const resumeElement = document.getElementById('resume-preview');
      if (resumeElement) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Resume - ${resumeData.personalInfo.fullName || 'Resume'}</title>
              <style>
                ${Array.from(document.styleSheets)
                  .map(stylesheet => {
                    try {
                      return Array.from(stylesheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('\n');
                    } catch (e) {
                      return '';
                    }
                  })
                  .join('\n')}
                
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                
                @media print {
                  body { 
                    margin: 0; 
                    padding: 0; 
                  }
                  .print-resume {
                    box-shadow: none !important;
                    margin: 0 !important;
                    max-width: none !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="print-resume">
                ${resumeElement.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Wait for styles to load, then print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const handleAISuggestions = () => {
    setShowSuggestions(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Smart Resume Builder
                </h1>
                <p className="text-sm text-slate-600">AI-powered resume optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleAISuggestions}
                variant="outline"
                className="flex items-center space-x-2 hover:bg-blue-50 border-blue-200"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Suggestions</span>
              </Button>
              <Button
                onClick={handlePDFExport}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Resume Information</span>
              </h2>
              <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Live Preview</h2>
              <div id="resume-preview">
                <ResumePreview resumeData={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      {showSuggestions && (
        <AISuggestions
          resumeData={resumeData}
          onClose={() => setShowSuggestions(false)}
          onApplySuggestion={(field, suggestion) => {
            // Handle applying suggestions to resume data
            console.log("Applying suggestion:", field, suggestion);
          }}
        />
      )}
    </div>
  );
};

export default Index;
