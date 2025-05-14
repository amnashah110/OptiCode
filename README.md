# OptiCode 

![Opticode](https://github.com/user-attachments/assets/5b1910f3-6089-4288-9d41-f3474bbd98ab)



**Empowering developers with AI-driven code optimization and seamless collaboration.**

---

## 📖 Introduction

OptiCode is an innovative AI-powered platform that revolutionizes software development by combining **code refactoring**, **real-time collaboration**, **personalized coding challenges**, and **GitHub insights**. It helps teams produce clean, optimized, and high-quality code while fostering mentorship and skill development.

---

## ❓ Problem Statement

Traditional code analysis tools like SonarQube and Codacy rely on static analysis, lacking real-time collaboration and AI-driven mentorship. Developers need a unified solution that:
1. **Automates refactoring** with intelligent AI suggestions.
2. **Enables real-time collaboration** for code improvement.
3. **Delivers tailored daily coding challenges** to enhance skills.
4. **Provides GitHub insights** like commit trends, pull request activity, and code quality metrics.

---

## 🌟 Features

| Feature                  | OptiCode | SonarQube | GitHub Copilot | Codacy |
|--------------------------|:--------:|:---------:|:-------------:|:------:|
| **AI-Powered Refactoring** | ✅       | ❌        | ✅            | ❌     |
| **Real-Time Collaboration** | ✅       | ❌        | ❌            | ❌     |
| **Daily AI Challenges**   | ✅       | ❌        | ❌            | ❌     |
| **GitHub Insights**       | ✅       | ❌        | ❌            | ✅     |

---

## 🛠 Solution Overview

- **AI-Powered Code Refactoring**: Harnesses the Gemini API to suggest improvements, such as removing duplicates, optimizing logic, and enhancing code readability.
- **Real-Time Collaboration**: Uses WebSockets for live multi-user editing and developer-learner mentorship.
- **GitHub Repository Insights**: Analyzes repository data via GitHub API to provide metrics on commits, code complexity, and pull requests.
- **AI-Generated Daily Challenges**: Offers personalized coding exercises based on expertise and GitHub activity.

---

## 🚀 How It Works

1. **Signup & Classification**: Users register and are classified as developers or learners based on AI-analyzed GitHub activity.
2. **AI Code Refactoring**: Select repositories to receive Gemini API-driven refactoring suggestions with clear explanations.
3. **Real-Time Collaboration**: Learners join live coding sessions with developers for hands-on mentorship.
4. **GitHub Analytics**: View a dashboard with commit trends, code complexity, and pull request insights.
5. **AI Challenges**: Receive daily coding challenges tailored to your skill level to boost proficiency.

---

## 🛠 Technical Stack

- **Frontend**: React.js for a sleek, intuitive UI.
- **Backend**: Node.js with Express for robust API handling and code analysis.
- **Database**: MongoDB for storing user data, insights, and challenge history.
- **Code Analysis**: Gemini API for automated refactoring and quality suggestions.
- **Collaboration**: WebSockets for seamless live editing and pair programming.
- **Version Control Insights**: GitHub API + CNN model for deep repository analytics.

---

## 🔍 Uniqueness & Competitive Edge

OptiCode is a **hybrid platform** that integrates AI-powered refactoring, real-time collaboration, and GitHub analytics into one seamless experience. By connecting learners with skilled developers, it fosters mentorship and elevates coding standards, setting it apart from traditional code review tools.

---

## 🖼 Screenshots

| **Login** | **Home** | **Analyze** |
|-----------|----------|-------------|
| ![Login](https://github.com/user-attachments/assets/d5730c46-7d3b-4600-ba97-132184373d39) | ![Home](https://github.com/user-attachments/assets/1c121d22-40d4-4421-b14b-44b420da4b37) | ![Analyze](https://github.com/user-attachments/assets/9909379b-e396-44fa-a51d-e2b58be28df5) |

| **Metrics** | **Repositories** | **Editor** |
|-------------|------------------|------------|
| ![Metrics](https://github.com/user-attachments/assets/e123607e-c6fd-4408-ba51-5b1569147c89) | ![Repositories](https://github.com/user-attachments/assets/59c60ca2-d884-4f11-a35e-a5af2193898b) | ![Editor](https://github.com/user-attachments/assets/e0c37925-cf4c-4c44-9253-8faf2e16e9d7) |

| **About** | **Profile** | **Challenges** |
|-----------|-------------|----------------|
| ![About](https://github.com/user-attachments/assets/c4597518-980a-4fa4-b21d-d973b6d847af) | ![Profile](https://github.com/user-attachments/assets/9dcdd580-182e-48b2-a80c-999f6afe5c4a) | ![Challenges](https://github.com/user-attachments/assets/264d0a61-f3bf-4f1f-8bdb-ada4373b905a) |
---

## 🏁 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/opticode.git
   ```
2. Install dependencies:
   ```bash
   cd opticode
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     GEMINI_API_KEY=your_gemini_api_key
     GITHUB_API_TOKEN=your_github_api_token
     ```
4. Run the application:
   ```bash
   npm start
   ```
5. Access the app at `http://localhost:3000`.


