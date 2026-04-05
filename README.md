
# EMPLOYEE DATA MANAGEMENT SYSTEM Using MERNSTACK



This repository is attached the following files:
  1. Project Documentation (.docx)
  2. Project Presentation (.pptx)
  3. Project Documentation (.pdf)
  4. Project Presentation (.pdf)
  5. Explanation Video (Youtube Uploaded) - https://youtu.be/PPCCry138xY
  6. Detailed Explanation in the form of Readme file for Implementation steps and the modules been in the Repo...

# How to Run the MERN Project

This guide provides step-by-step instructions on how to run both the backend server and the frontend React application locally and open the project in your browser.

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
Ensure you have MongoDB running locally or have a valid MongoDB connection string in your backend `.env` file if necessary.

## 1. Start the Backend Server

The backend runs on Node.js/Express and connects to your database.

1. Open a new terminal window at the root of the project.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Install the backend dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *Note: This uses `nodemon` to automatically restart the server on code changes.* The server typically runs on `http://localhost:5000`.

## 2. Start the Frontend Application

The frontend is a modern React application built with Vite.

1. Open a **second** new terminal window at the root of the project.
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install the frontend dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 3. Open in the Browser

After running the frontend development server, the Vite output in your terminal will display a local URL.

1. Open your preferred web browser.
2. Navigate to the URL listed in the frontend terminal, which is usually:
   ```
   http://localhost:5173
   ```

You should now see the application running in your browser and it should be connected to the locally running backend!
