const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a theme name'],
            unique: true,
            enum: ['Modern', 'Minimal', 'Corporate', 'Creative'],
        },
        config: {
            fontBody: { type: String, default: 'Inter' },
            fontHeading: { type: String, default: 'Inter' },
            primaryColor: { type: String, default: '#3b82f6' }, // blue-500
            secondaryColor: { type: String, default: '#64748b' }, // slate-500
            layoutType: { type: String, default: 'single-column' },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Theme', themeSchema);
