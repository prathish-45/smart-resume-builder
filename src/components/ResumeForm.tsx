
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { ResumeData } from "@/pages/Index";

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

export const ResumeForm = ({ resumeData, setResumeData }: ResumeFormProps) => {
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  const updateSummary = (value: string) => {
    setResumeData({
      ...resumeData,
      summary: value,
    });
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience],
    });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation],
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkillCategory = () => {
    const newSkillCategory = {
      id: Date.now().toString(),
      category: "",
      items: [],
    };
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkillCategory],
    });
  };

  const updateSkillCategory = (id: string, field: string, value: string | string[]) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkillCategory = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((skill) => skill.id !== id),
    });
  };

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <Input
                  id="portfolio"
                  value={resumeData.personalInfo.portfolio}
                  onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
                  placeholder="johndoe.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={resumeData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Write a compelling professional summary that highlights your key achievements and career objectives..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="experience" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <Button onClick={addExperience} size="sm" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </Button>
        </div>

        {resumeData.experience.map((exp, index) => (
          <Card key={exp.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Experience {index + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    disabled={exp.current}
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                  placeholder="Describe your key responsibilities and achievements..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="education" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Education</h3>
          <Button onClick={addEducation} size="sm" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </Button>
        </div>

        {resumeData.education.map((edu, index) => (
          <Card key={edu.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Education {index + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    placeholder="Bachelor of Science"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <Label>Graduation Date</Label>
                  <Input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="skills" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Skills</h3>
          <Button onClick={addSkillCategory} size="sm" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Button>
        </div>

        {resumeData.skills.map((skill, index) => (
          <Card key={skill.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Skill Category {index + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSkillCategory(skill.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  value={skill.category}
                  onChange={(e) => updateSkillCategory(skill.id, "category", e.target.value)}
                  placeholder="Technical Skills, Languages, etc."
                />
              </div>
              <div>
                <Label>Skills (comma-separated)</Label>
                <Textarea
                  value={skill.items.join(", ")}
                  onChange={(e) => updateSkillCategory(skill.id, "items", e.target.value.split(", ").filter(Boolean))}
                  placeholder="JavaScript, React, Node.js, Python, SQL"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};
