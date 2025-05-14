import mongoose from 'mongoose';
const { Schema } = mongoose;

const challengeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    languageIds: {
        type: [Number],
        required: true
    },
    boilerplateCode: {
        type: Map,
        of: String,
        required: true
    },
    testCases: [{
        input: {
            nums: {
                type: [Number],
                required: true
            },
            target: {
                type: Number,
                required: true
            }
        },
        output: {
            type: [Number],
            required: true
        }
    }],
    hiddenTests: [{
        input: {
            nums: {
                type: [Number],
                required: true
            },
            target: {
                type: Number,
                required: true
            }
        },
        output: {
            type: [Number],
            required: true
        }
    }]
});

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
