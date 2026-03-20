const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String },
});

const educationSchema = new mongoose.Schema({
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
});

const certificateSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // We can store themeId, but falling back to string 'Modern' for simpler default
        theme: {
            type: String,
            default: 'Modern',
        },
        title: {
            type: String,
            default: 'Untitled Resume',
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        personalInfo: {
            firstName: { type: String, default: '' },
            lastName: { type: String, default: '' },
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
            portfolioUrl: { type: String, default: '' },
            summary: { type: String, default: '' },
        },
        experience: [experienceSchema],
        education: [educationSchema],
        skills: [{ type: String }],
        certificates: [certificateSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Resume', resumeSchema);
