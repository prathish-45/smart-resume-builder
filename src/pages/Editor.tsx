import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ResumeForm } from "@/components/ResumeForm";
import { ResumePreview } from "@/components/ResumePreview";
import { AISuggestions } from "@/components/AISuggestions";
import { Button } from "@/components/ui/button";
import { FileText, Download, Sparkles, Save, ChevronLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export interface ResumeData {
  _id?: string;
  theme?: string;
  title?: string;
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
    id: string; // Used locally for mapping, might be _id in DB
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
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    fileUrl: string;
  }>;
}

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState("Modern");
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
    certificates: [],
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get(`/resumes/${id}`);
        const dbResume = response.data;
        setTheme(dbResume.theme || "Modern");

        // Map DB structure to Form structure
        setResumeData({
          _id: dbResume._id,
          title: dbResume.title,
          personalInfo: {
            fullName: dbResume.personalInfo?.firstName && dbResume.personalInfo?.lastName
              ? `${dbResume.personalInfo.firstName} ${dbResume.personalInfo.lastName}`
              : dbResume.personalInfo?.firstName || "",
            email: dbResume.personalInfo?.email || "",
            phone: dbResume.personalInfo?.phone || "",
            location: dbResume.personalInfo?.portfolioUrl || "", // Reusing for location locally
            linkedin: "", // Not natively on DB model, handle appropriately based on requirements
            portfolio: "",
          },
          summary: dbResume.personalInfo?.summary || "",
          experience: dbResume.experience.map((e: any) => ({ ...e, id: e._id || Date.now().toString(), position: e.role })),
          education: dbResume.education.map((e: any) => ({ ...e, id: e._id || Date.now().toString(), field: e.fieldOfStudy, graduationDate: e.startDate ? new Date(e.startDate).toISOString().slice(0, 7) : "" })),
          skills: dbResume.skills.length ? [{ id: '1', category: 'All Skills', items: dbResume.skills }] : [],
          certificates: dbResume.certificates ? dbResume.certificates.map((c: any) => ({
            id: c._id || Date.now().toString(),
            name: c.name,
            issuer: c.issuer,
            date: c.issueDate,
            fileUrl: c.fileUrl
          })) : [],
        });
      } catch (error) {
        toast({ variant: "destructive", title: "Error loading resume" });
        navigate("/dashboard");
      }
    };

    if (id) fetchResume();
  }, [id]);

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map local form state back to MongoDB schema expectation
      const payload = {
        title: resumeData.title || "Untitled Resume",
        theme: theme,
        personalInfo: {
          firstName: resumeData.personalInfo.fullName.split(" ")[0] || "",
          lastName: resumeData.personalInfo.fullName.split(" ").slice(1).join(" ") || "",
          email: resumeData.personalInfo.email,
          phone: resumeData.personalInfo.phone,
          portfolioUrl: resumeData.personalInfo.location, // matching schema mapping
          summary: resumeData.summary
        },
        experience: resumeData.experience.map(e => ({
          company: e.company,
          role: e.position,
          startDate: e.startDate ? new Date(e.startDate) : undefined,
          endDate: e.endDate ? new Date(e.endDate) : undefined,
          current: e.current,
          description: e.description
        })),
        education: resumeData.education.map(e => ({
          institution: e.institution,
          degree: e.degree,
          fieldOfStudy: e.field,
          startDate: e.graduationDate ? new Date(e.graduationDate) : undefined
        })),
        skills: resumeData.skills.flatMap(s => s.items), // Flatten categories for the array struct
        certificates: resumeData.certificates.map(c => ({
          name: c.name,
          issuer: c.issuer,
          issueDate: c.date,
          fileUrl: c.fileUrl
        }))
      };

      await api.put(`/resumes/${id}`, payload);
      toast({ title: "Resume saved successfully!" });
    } catch (error: any) {
      console.error("Save Error:", error.response?.data || error.message);
      toast({
        variant: "destructive",
        title: "Failed to save resume",
        description: error.response?.data?.message || "Please check that all required fields are filled."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    try {
      await api.patch(`/resumes/${id}/theme`, { theme: newTheme });
      toast({ title: "Theme updated!" });
    } catch (e) {
      toast({ variant: "destructive", title: "Failed to update theme" });
    }
  };

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
              <Button variant="ghost" className="mr-2" onClick={() => navigate('/dashboard')}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Dashboard
              </Button>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Resume Editor
                </h1>
                <p className="text-sm text-slate-600">Editing: <span className="font-medium text-slate-900">{resumeData.title || "Untitled Resume"}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Modern">Modern</SelectItem>
                  <SelectItem value="Minimal">Minimal</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleAISuggestions}
                variant="outline"
                className="flex items-center space-x-2 hover:bg-blue-50 border-blue-200"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">AI Suggestions</span>
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
              <Button
                onClick={handlePDFExport}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
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
                {/* We pass the Theme context down via prop so preview reacts dynamically */}
                <ResumePreview resumeData={{ ...resumeData, theme }} />
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

export default Editor;
