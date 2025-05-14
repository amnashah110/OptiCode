import mongoose from 'mongoose'; 
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 13 
    },
    githubHandle: {
        type: String,
        unique: true,
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ["learner", "experienced"],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    darkMode: {
        type: Boolean,
        default: false,
    },
    dev: {
        type: String,
    },
    assignedLearners: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }]
});

const User = mongoose.model('User', userSchema);

export default User;

