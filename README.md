# NoteMe

#### Author: Ángel Alberto de los Ríos Navarro (https://github.com/angel-dev-projects)

## Project Description

NoteMe is a note management web application that allows you to take and save notes in a simple and friendly format. With an intuitive and elegant interface, NoteMe is designed to provide a smooth and efficient note-taking experience.

Explore NoteMe and start organizing your notes in an efficient and personalized way!

Note: The app uses a basic authentication system to allow access to private notes. It is recommended not to use this application to store sensitive or confidential information.

## Main Features

- Register and login: Create a user to access the application by logging in.
- Profile configuration: Change your user data.
- Note Creation: Create new custom notes with a title, content, color and options to mark as favorites and or privates.
- Edition and Deletion: Modify the content of your notes and delete those that you no longer need.
- User Search: Find another users easily using the search by username.
- Access to public user notes: You can see the notes that are not private from other users
- Filtering: Quickly access your favorite and/or private notes.
- Responsive and Attractive: The application adapts to different devices and offers a friendly and visually attractive user experience.

## Used technology

- Angular: The frontend of the application is developed with Angular, a modern and powerful framework for building web applications.
- Node.js and Express: The backend of the application is built with Node.js and Express, providing a robust and secure API to manage notes and users.
- MongoDB: The NoSQL MongoDB database is used to store user notes and information.
- Bootstrap and CSS: Bootstrap and custom CSS are used to style and design the user interface.

## Requirements

- Node.js
- Angular CLI
- MongoDB Cluster

## Installation and Use

1. Clone this repository to your local machine.
2. Navigate to the NoteMe-Backend directory using the `cd` command
3. Install the dependencies using the `npm install` command.
4. The same with the NoteMe-Frontend directory, navigate to it using the `cd` command
5. Install the dependencies using the `npm install` command.
6. In the root of the NoteMe-Backend directory, create an .env file and add the variables DB_URI (connection to the database using a MongoDB cluster), PORT (port on which the server will run) and JWT_SECRET (password for encryption of JWT tokens)
7. Run the backend server with the `npm run dev` command in the root of the NoteMe-Backend directory.
8. Run the frotend server with the `ng serve` command in the root of the NoteMe-Frontend directory.
9. Open your browser and go to http://localhost:4200 to access the NoteMe application.

## Project Structure

- NoteMe-Backend
  - src
    - helpers
    - models
    - routes
    - validators
- NoteMe-Frontend
  - .vscode
  - src
    - app
      - components
        - toast
      - environments
      - helpers
      - interceptors
      - interfaces
      - services
      - shared
        - header
        - spinner
      - views
        - change-password
        - dashboard
        - note
        - profile
        - signin
        - signup
        - user
    - assets
        - icons
        - imgs