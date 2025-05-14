import mongoose from 'mongoose';
import chai from 'chai';
import Challenge from '../models/challenge.js'; // Adjust path as needed

const { expect } = chai;

describe('Challenge Model', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGO_TEST_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Challenge.deleteMany({});
    });

    it('should create a valid challenge', async () => {
        const validChallenge = new Challenge({
            title: 'Two Sum',
            description: 'Find indices of two numbers that add up to a target.',
            slug: 'two-sum',
            difficulty: 'Easy',
            category: 'Arrays',
            languageIds: [71],
            boilerplateCode: { '71': 'def two_sum(nums, target):\n    pass' },
            testCases: [{
                input: { nums: [2, 7, 11, 15], target: 9 },
                output: [0, 1]
            }],
            hiddenTests: [{
                input: { nums: [3, 2, 4], target: 6 },
                output: [1, 2]
            }]
        });

        const saved = await validChallenge.save();
        expect(saved).to.have.property('_id');
        expect(saved.slug).to.equal('two-sum');
    });

    it('should fail if required fields are missing', async () => {
        const invalidChallenge = new Challenge({ title: 'Incomplete' });
        try {
            await invalidChallenge.save();
        } catch (err) {
            expect(err.errors).to.have.property('description');
            expect(err.errors).to.have.property('slug');
            expect(err.errors).to.have.property('category');
            expect(err.errors).to.have.property('boilerplateCode'); // still required
            expect(err.errors).to.have.property('difficulty');
            expect(Object.keys(err.errors)).to.include.members([
                'description',
                'slug',
                'difficulty',
                'category',
                'boilerplateCode'
            ]);
        }
    });

    it('should reject invalid difficulty value', async () => {
        const invalidDiff = new Challenge({
            title: 'Invalid Difficulty',
            description: 'Desc',
            slug: 'invalid-difficulty',
            difficulty: 'Impossible', // Not in enum
            category: 'Logic',
            languageIds: [71],
            boilerplateCode: { '71': 'code' },
            testCases: [],
            hiddenTests: []
        });

        try {
            await invalidDiff.save();
        } catch (err) {
            expect(err.errors).to.have.property('difficulty');
            expect(err.errors.difficulty.kind).to.equal('enum');
        }
    });

    it('should enforce slug uniqueness', async () => {
        const challenge1 = new Challenge({
            title: 'Duplicate Slug',
            description: 'One',
            slug: 'dup-slug',
            difficulty: 'Easy',
            category: 'Test',
            languageIds: [71],
            boilerplateCode: { '71': 'code' },
            testCases: [],
            hiddenTests: []
        });

        const challenge2 = new Challenge({
            title: 'Duplicate Slug Again',
            description: 'Two',
            slug: 'dup-slug', // Same slug
            difficulty: 'Medium',
            category: 'Test',
            languageIds: [71],
            boilerplateCode: { '71': 'code' },
            testCases: [],
            hiddenTests: []
        });

        await challenge1.save();
        try {
            await challenge2.save();
        } catch (err) {
            expect(err.code).to.equal(11000);
        }
    });
});
