import chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import sinon from 'sinon';
import axios from 'axios';
import dotenv from 'dotenv';
import app from '../server.mjs';

dotenv.config();
const { expect } = chai;

describe('Compile Routes', () => {
  let axiosPostStub;

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
    axiosPostStub = sinon.stub(axios, 'post');
  });

  afterEach(async function () {
    this.timeout(15000);
    axiosPostStub.restore();
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

  const compileCode = async (data) => {
    return await request(app).post('/code/compile').send(data);
  };

  describe('POST /compile', () => {
    it('should compile code successfully and return result', async function () {
      this.timeout(15000);
      const mockResponse = {
        stdout: 'Hello, World!',
        stderr: null,
        status_id: 3, // Accepted
        compile_output: null,
        message: null,
      };
      axiosPostStub.resolves({ data: mockResponse });

      const res = await compileCode({
        source_code: 'print("Hello, World!")',
        language_id: 71, // Python 3
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('result').that.deep.equals(mockResponse);
      expect(axiosPostStub.calledOnce).to.be.true;
      expect(axiosPostStub.firstCall.args[0]).to.equal('https://judge0-ce.p.rapidapi.com/submissions');
      expect(axiosPostStub.firstCall.args[1]).to.deep.equal({
        source_code: 'print("Hello, World!")',
        language_id: 71,
      });
    });

    it('should return 400 for missing source_code', async function () {
      this.timeout(15000);
      const res = await compileCode({
        language_id: 71,
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Missing source code or language id');
      expect(axiosPostStub.notCalled).to.be.true;
    });

    it('should return 400 for missing language_id', async function () {
      this.timeout(15000);
      const res = await compileCode({
        source_code: 'print("Hello, World!")',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Missing source code or language id');
      expect(axiosPostStub.notCalled).to.be.true;
    });

    it('should return 400 for empty source_code', async function () {
      this.timeout(15000);
      const res = await compileCode({
        source_code: '',
        language_id: 71,
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('error', 'Missing source code or language id');
      expect(axiosPostStub.notCalled).to.be.true;
    });

    it('should return 500 for Judge0 API failure', async function () {
      this.timeout(15000);
      axiosPostStub.rejects(new Error('Judge0 API error'));

      const res = await compileCode({
        source_code: 'print("Hello, World!")',
        language_id: 71,
      });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to compile code');
      expect(axiosPostStub.calledOnce).to.be.true;
    });

    it('should return 500 for invalid language_id', async function () {
      this.timeout(15000);
      axiosPostStub.rejects({ response: { data: { error: 'Invalid language ID' } } });

      const res = await compileCode({
        source_code: 'print("Hello, World!")',
        language_id: 999, // Invalid language ID
      });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to compile code');
      expect(axiosPostStub.calledOnce).to.be.true;
    });
  });
});