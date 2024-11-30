# Task Management System

This is a Task Management System built using React (Frontend) and Node.js with SQLite (Backend). The application allows users to create, view, edit, and delete tasks, with the option to filter tasks based on their status (All, Pending, Completed).

## Features

- Add new tasks with a title, description, and due date.
- View all tasks in a grid layout.
- Edit task details directly.
- Toggle task status between "Pending" and "Completed."
- Filter tasks by status.
- Delete tasks.
- Backend integration using SQLite for data storage.


## Folder Structure

The project consists of two main folders:

1. client: Contains the frontend code built with React and Tailwind CSS.
2. server: Contains the backend code built with Node.js, Express, and SQLite.


## Steps to Run the Project Locally

### 1. Clone the Repository

git clone <repository-url>
cd <repository-folder>

### 2.For the Client && server do
cd client || cd server
npm install

### 3.Run the Application
In the client folder, run:
npm run dev
This will start the frontend on http://localhost:5173.

### 4.For Server
nodemon app.js
This will start the backend on http://localhost:3000.


# The backend server provides the following RESTful API endpoints:

GET /all
Fetch all tasks stored in the database.

POST /new
Create a new task by providing title, description, and date.

PUT /updateStatus/:id
Update the status (pending or completed) of a task by its ID.

PUT /update/:id
Edit an existing task by its ID. Pass the updated title, description, and/or date.

DELETE /delete/:id
Delete a task from the database using its ID.



