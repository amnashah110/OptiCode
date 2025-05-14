import chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import app from '../server.mjs';
import User from '../models/user.js';

dotenv.config();
const { expect } = chai;

const testGithubHandle = 'testUser';

describe('Preference Routes', () => {
  before(async function () {
    this.timeout(30000);
    const testUri = process.env.MONGO_TEST_URI;
    if (!testUri) {
      throw new Error('MONGO_TEST_URI is not defined');
    }
    try {
      await mongoose.connect(testUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log(`MongoDB connected for tests to ${testUri}`);
    } catch (error) {
      console.error('MongoDB connection error in tests:', error);
      throw error;
    }
  });

  beforeEach(async function () {
    this.timeout(15000);
    await User.deleteMany({}); // Clear entire collection
    // Create a test user
    await User.create({
      firstName: 'Test',
      lastName: 'User',
      age: 25,
      githubHandle: testGithubHandle,
      experienceLevel: 'learner',
      password: await bcrypt.hash('TestPass123', 10),
      darkMode: false,
      dev: 'mockDev',
    });
  });

  afterEach(async function () {
    this.timeout(15000);
    await User.deleteMany({});
  });

  after(async function () {
    this.timeout(30000);
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw error;
    }
  });

  const updateTheme = async (data) => {
    return await request(app).put('/pref/updateTheme').send(data); // Updated path
  };

  describe('PUT /pref/updateTheme', () => {
    it('should update darkMode to true for an existing user', async function () {
      this.timeout(15000);
      const res = await updateTheme({
        githubHandle: testGithubHandle,
        darkMode: true,
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Dark mode updated successfully');
      expect(res.body).to.have.property('darkMode', true);

      const user = await User.findOne({ githubHandle: testGithubHandle });
      expect(user).to.exist;
      expect(user.darkMode).to.equal(true);
    });

    it('should update darkMode to false for an existing user', async function () {
      this.timeout(15000);
      await User.updateOne({ githubHandle: testGithubHandle }, { darkMode: true });

      const res = await updateTheme({
        githubHandle: testGithubHandle,
        darkMode: false,
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Dark mode updated successfully');
      expect(res.body).to.have.property('darkMode', false);

      const user = await User.findOne({ githubHandle: testGithubHandle });
      expect(user).to.exist;
      expect(user.darkMode).to.equal(false);
    });

    it('should return 404 for non-existent user', async function () {
      this.timeout(15000);
      const res = await updateTheme({
        githubHandle: 'nonexistentuser',
        darkMode: true,
      });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'User not found');
    });

    it('should return 400 for missing githubHandle', async function () {
      this.timeout(15000);
      const res = await updateTheme({
        darkMode: true,
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'githubHandle and darkMode are required');
    });

    it('should return 400 for missing darkMode', async function () {
      this.timeout(15000);
      const res = await updateTheme({
        githubHandle: testGithubHandle,
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'githubHandle and darkMode are required');
    });

    it('should return 400 for invalid darkMode type', async function () {
      this.timeout(15000);
      const res = await updateTheme({
        githubHandle: testGithubHandle,
        darkMode: 'invalid',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'darkMode must be a boolean');
    });
  });
});