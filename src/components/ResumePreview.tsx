
import { ResumeData } from "@/pages/Index";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export const ResumePreview = ({ resumeData }: ResumePreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="bg-white shadow-lg max-w-2xl mx-auto print:shadow-none print:max-w-none">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8 print:bg-slate-800">
        <h1 className="text-3xl font-bold mb-2">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          {resumeData.personalInfo.email && (
            <span>{resumeData.personalInfo.email}</span>
          )}
          {resumeData.personalInfo.phone && (
            <span>{resumeData.personalInfo.phone}</span>
          )}
          {resumeData.personalInfo.location && (
            <span>{resumeData.personalInfo.location}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm mt-2 opacity-90">
          {resumeData.personalInfo.linkedin && (
            <span>{resumeData.personalInfo.linkedin}</span>
          )}
          {resumeData.personalInfo.portfolio && (
            <span>{resumeData.personalInfo.portfolio}</span>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Professional Summary */}
        {resumeData.summary && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-4">
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-6">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-slate-200 pl-6 relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2 top-1"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {exp.position || "Position Title"}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {exp.company || "Company Name"}
                      </p>
                    </div>
                    <div className="text-sm text-slate-600 text-right">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-slate-700 leading-relaxed">
                      {exp.description.split('\n').map((line, index) => (
                        <p key={index} className="mb-1">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-6">
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-slate-200 pl-6 relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2 top-1"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {edu.institution || "Institution Name"}
                      </p>
                      {edu.gpa && (
                        <p className="text-sm text-slate-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      {formatDate(edu.graduationDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-6">
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumeData.skills.map((skillCategory) => (
                <div key={skillCategory.id}>
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {skillCategory.category || "Skill Category"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
