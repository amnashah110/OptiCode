import chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import sinon from 'sinon';
import axios from 'axios';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import app from '../server.mjs';
import User from '../models/user.js';

dotenv.config();
const { expect } = chai;

let axiosGetStub;
const learnerHandle = 'mockLearner';
const devHandle = 'mockDev';

describe('Auth Routes', () => {
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
      });
      console.log(`MongoDB connected for tests to ${testUri}`);
    } catch (error) {
      console.error('MongoDB connection error in tests:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    await User.deleteMany({}); // Clear entire collection
    axiosGetStub = sinon.stub(axios, 'get').resolves({
      status: 200,
      data: { login: learnerHandle },
    });

    // Create an experienced user for tests that need it
    await User.create({
      firstName: 'Mock',
      lastName: 'Dev',
      age: 30,
      githubHandle: devHandle,
      experienceLevel: 'experienced',
      password: await bcrypt.hash('DevPass123', 10),
      darkMode: true,
      dev: devHandle,
    });
  });

  afterEach(() => {
    axiosGetStub.restore();
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

  const signupUser = async (userData) => {
    return await request(app).post('/auth/signup').send(userData);
  };

  const loginUser = async (userData) => {
    return await request(app).post('/auth/login').send(userData);
  };

  // Signup Route Tests
  describe('POST /auth/signup', () => {
    it('should signup a new learner user and return a token', async () => {
      const res = await signupUser({
        firstName: 'Test',
        lastName: 'User',
        age: 22,
        githubHandle: learnerHandle,
        experienceLevel: 'learner',
        password: 'TestPass123',
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
      expect(res.body).to.have.property('token').that.is.a('string');
      expect(res.body.token.split('.').length).to.equal(3); // Basic JWT check
      expect(res.body).to.have.property('matchedDev', devHandle);

      const user = await User.findOne({ githubHandle: learnerHandle });
      expect(user).to.exist;
      expect(user.experienceLevel).to.equal('learner');
      expect(user.dev).to.equal(devHandle);
      expect(user.password).to.not.equal('TestPass123'); // Password should be hashed
    });

    it('should signup a new experienced user and return a token with self-mentoring', async () => {
      const githubHandle = 'experienceduser123';
      axiosGetStub.resolves({ status: 200, data: { login: githubHandle } });

      const res = await signupUser({
        firstName: 'Experienced',
        lastName: 'User',
        age: 28,
        githubHandle,
        experienceLevel: 'experienced',
        password: 'ExpPass456',
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
      expect(res.body).to.have.property('token').that.is.a('string');
      expect(res.body.token.split('.').length).to.equal(3);
      expect(res.body).to.have.property('matchedDev', githubHandle);

      const user = await User.findOne({ githubHandle });
      expect(user).to.exist;
      expect(user.experienceLevel).to.equal('experienced');
      expect(user.dev).to.equal(githubHandle);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await signupUser({
        firstName: 'Test',
        // Missing lastName, age, githubHandle, experienceLevel, password
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'All fields are required');
    });

    it('should return 400 for duplicate githubHandle', async () => {
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        age: 22,
        githubHandle: learnerHandle,
        experienceLevel: 'learner',
        password: await bcrypt.hash('TestPass123', 10),
        dev: devHandle, // Set dev field
      });

      const res = await signupUser({
        firstName: 'Test2',
        lastName: 'User2',
        age: 23,
        githubHandle: learnerHandle,
        experienceLevel: 'learner',
        password: 'TestPass456',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'GitHub handle already in use');
    });

    it('should return 400 for invalid GitHub handle', async () => {
      axiosGetStub.throws({ response: { status: 404 } });

      const res = await signupUser({
        firstName: 'Test',
        lastName: 'User',
        age: 22,
        githubHandle: 'invaliduser',
        experienceLevel: 'learner',
        password: 'TestPass123',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'GitHub handle does not exist');
    });

    it('should return 500 for GitHub API failure', async () => {
      axiosGetStub.throws(new Error('Network error'));

      const res = await signupUser({
        firstName: 'Test',
        lastName: 'User',
        age: 22,
        githubHandle: learnerHandle,
        experienceLevel: 'learner',
        password: 'TestPass123',
      });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'GitHub API request failed');
    });

    it('should assign self as matchedDev for learner when no experienced users exist', async () => {
      await User.deleteMany({}); // Remove the experienced user created in beforeEach

      const res = await signupUser({
        firstName: 'Test',
        lastName: 'User',
        age: 22,
        githubHandle: learnerHandle,
        experienceLevel: 'learner',
        password: 'TestPass123',
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
      expect(res.body).to.have.property('token').that.is.a('string');
      expect(res.body).to.have.property('matchedDev', learnerHandle);

      const user = await User.findOne({ githubHandle: learnerHandle });
      expect(user).to.exist;
      expect(user.dev).to.equal(learnerHandle);
    });

    it('should return 400 for invalid experienceLevel', async () => {
      const res = await signupUser({
        firstName: 'Test',
        lastName: 'User',
        age: 22,
        githubHandle: learnerHandle,
        experienceLevel: 'invalid',
        password: 'TestPass123',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Invalid experience level');
    });
  });

  // Login Route Tests
  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        age: 22,
        githubHandle: learnerHandle,
        experienceLevel: 'learner',
        password: await bcrypt.hash('TestPass123', 10),
        darkMode: false,
        dev: devHandle,
      });
    });

    it('should login a user with correct credentials and return a token', async () => {
      const res = await loginUser({
        githubHandle: learnerHandle,
        password: 'TestPass123',
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 1);
      expect(res.body).to.have.property('message', 'Login successful');
      expect(res.body).to.have.property('token').that.is.a('string');
      expect(res.body.token.split('.').length).to.equal(3); // Basic JWT check
      expect(res.body).to.have.property('user').that.is.an('object');
      expect(res.body.user).to.include({
        firstName: 'Test',
        lastName: 'User',
        githubHandle: learnerHandle,
        experienceLevel: 'learner',
        darkMode: false,
      });
      expect(res.body.user).to.have.property('dev', devHandle);
      expect(res.body.user).to.not.have.property('password'); // Sensitive field should not be returned
    });

    it('should return 400 for non-existent GitHub handle', async () => {
      const res = await loginUser({
        githubHandle: 'nonexistentuser',
        password: 'TestPass123',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'No user found for this GitHub handle');
    });

    it('should return 400 for incorrect password', async () => {
      const res = await loginUser({
        githubHandle: learnerHandle,
        password: 'WrongPass123',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Invalid Password');
    });

    it('should return 400 for missing githubHandle', async () => {
      const res = await loginUser({
        password: 'TestPass123',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'GitHub handle and password are required');
    });

    it('should return 400 for missing password', async () => {
      const res = await loginUser({
        githubHandle: learnerHandle,
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'GitHub handle and password are required');
    });
  });
});