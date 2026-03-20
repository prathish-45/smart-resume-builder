import { ResumeData } from "@/pages/Editor";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export const ResumePreview = ({ resumeData }: ResumePreviewProps) => {
  const theme = resumeData.theme || 'Modern';

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'Minimal':
        return {
          container: 'bg-white text-gray-900 border-t-4 border-gray-900',
          header: 'bg-white text-gray-900 p-8 border-b border-gray-200',
          title: 'text-3xl font-light tracking-wide',
          sectionTitle: 'text-xl font-medium text-gray-900 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wider',
          accent: 'text-gray-600',
          timeline: 'border-l-2 border-gray-200 pl-6 relative',
          dot: 'bg-gray-400',
          badge: 'bg-gray-100 text-gray-800'
        };
      case 'Corporate':
        return {
          container: 'bg-white shadow-md border-t-8 border-slate-800',
          header: 'bg-slate-50 text-slate-800 p-8 border-b-2 border-slate-200',
          title: 'text-3xl font-serif font-bold text-slate-900',
          sectionTitle: 'text-xl font-serif font-bold text-slate-800 border-b-2 border-slate-300 pb-2 mb-6',
          accent: 'text-slate-600 font-semibold',
          timeline: 'border-l-2 border-slate-300 pl-6 relative',
          dot: 'bg-slate-500',
          badge: 'bg-slate-200 text-slate-800 rounded-none'
        };
      case 'Creative':
        return {
          container: 'bg-[#fafafa] shadow-xl',
          header: 'bg-amber-400 text-slate-900 p-8',
          title: 'text-4xl font-black tracking-tighter',
          sectionTitle: 'text-2xl font-bold text-slate-900 border-b-4 border-amber-400 pb-2 mb-6 inline-block',
          accent: 'text-amber-600 font-bold',
          timeline: 'border-l-4 border-amber-200 pl-6 relative',
          dot: 'bg-amber-500 w-4 h-4 -left-[10px]',
          badge: 'bg-amber-100 text-amber-900 rounded-full border border-amber-200'
        };
      case 'Modern':
      default:
        return {
          container: 'bg-white shadow-lg',
          header: 'bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8',
          title: 'text-3xl font-bold',
          sectionTitle: 'text-xl font-bold text-slate-800 border-b-2 border-blue-500 pb-2 mb-6',
          accent: 'text-blue-600 font-medium',
          timeline: 'border-l-2 border-slate-200 pl-6 relative',
          dot: 'bg-blue-500',
          badge: 'bg-blue-100 text-blue-800 rounded-full'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`${styles.container} max-w-2xl mx-auto print:shadow-none print:max-w-none transition-all duration-300`}>
      {/* Header */}
      <div className={`${styles.header} print:bg-slate-800 print:text-white`}>
        <h1 className={`${styles.title} mb-2`}>
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
            <h2 className={styles.sectionTitle}>
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className={styles.timeline}>
                  <div className={`absolute w-3 h-3 rounded-full -left-2 top-1 ${styles.dot}`}></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {exp.position || "Position Title"}
                      </h3>
                      <p className={styles.accent}>
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
            <h2 className={styles.sectionTitle}>
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className={styles.timeline}>
                  <div className={`absolute w-3 h-3 rounded-full -left-2 top-1 ${styles.dot}`}></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className={styles.accent}>
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
            <h2 className={styles.sectionTitle}>
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumeData.skills.map((skillCategory) => (
                <div key={skillCategory.id}>
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {skillCategory.category || "Skill Category"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, index) => {
                      const trimmedSkill = skill.trim();
                      if (!trimmedSkill) return null;
                      return (
                        <span
                          key={index}
                          className={`${styles.badge} px-3 py-1 text-sm font-medium`}
                        >
                          {trimmedSkill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {resumeData.certificates && resumeData.certificates.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>
              Licenses & Certifications
            </h2>
            <div className="space-y-6">
              {resumeData.certificates.map((cert) => (
                <div key={cert.id} className={styles.timeline}>
                  <div className={`absolute w-3 h-3 rounded-full -left-2 top-1 ${styles.dot}`}></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {cert.name || "Certificate Name"}
                      </h3>
                      <p className={styles.accent}>
                        {cert.issuer || "Issuing Organization"}
                      </p>
                      {cert.fileUrl && (
                        <div className="mt-3 text-left">
                           {(() => {
                              let baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
                              if (baseUrl && !baseUrl.startsWith('http')) {
                                baseUrl = window.location.origin + baseUrl;
                              } else if (!baseUrl) {
                                baseUrl = window.location.origin;
                              }
                              const fullUrl = `${baseUrl}${cert.fileUrl}`;
                              
                              const isPdf = cert.fileUrl.toLowerCase().endsWith('.pdf');

                              if (isPdf) {
                                return (
                                  <a 
                                    href={fullUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center"
                                  >
                                    View Credential (PDF)
                                  </a>
                                );
                              }

                              return (
                                <img 
                                  src={fullUrl} 
                                  alt={`${cert.name || 'Certificate'} Credential`} 
                                  className="mt-2 max-h-48 object-contain rounded border border-gray-200 shadow-sm"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline-flex';
                                    }
                                  }}
                                />
                              );
                           })()}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 text-right">
                      {formatDate(cert.date)}
                    </div>
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
