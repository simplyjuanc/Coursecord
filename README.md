# Coursecord
Coursecord is an e-learning management system fully written in Typescript, where organisations can create and maintain different courses for their student audiences, which can be quickly updated via the use of an online Markdown editor.

At its current MVP level, courses are created as a managed service, but future development steps include the ability to create courses on demand, as well as refining user management.

<img width="800" alt="Screenshot 2023-12-09 at 13 55 10" src="https://github.com/simplyjuanc/Coursecord/assets/37302562/672bd6a9-2611-4d35-b229-89942a8e29d7">

## Current Features
- Multiple roles (admin, instructor, student)
- Depending on role, edit, create, and/or view syllabi, lectures.
- Admins can edit users.
- Students can submit help request.
- Instructors can attend help requests (mark them as solved).


## Setting it up
The project is a monorepo, so to install follow the guidelines below.

1. Navigate to `server` folder and run `npm i` 
  - If running it from a dev environment, you need to set up the following environment variables:
    - `DATABASE_URL`
    - `GOOGLE_ID`
    - `GOOGLE_SECRET`
2. Navigate to `client` folder and run `npm i` 
  - If running it from a dev environment, you need to set up the following environment variables:
    - `GOOGLE_ID`
    - `GOOGLE_SECRET`
    - `API_URL`
    - `NEXTAUTH_URL`
    - `NEXTAUTH_SECRET`


## Stack
- Frontend:
  - Next.js
  - NextAuth
  - Tailwind CSS
  - Redux Toolkit
  - Socket.io Client
- Backend
  - ExpressJS
  - MongoDB
  - Prisma ORM
  - Socket.io
- Testing
  - Cypress
  - Supertest


## Contributors
- [arthurjamesoncode](https://github.com/arthurjamesoncode)
- [BrunoPastorelli00](https://github.com/BrunoPastorelli00)
- [simplyjuanc](https://github.com/simplyjuanc)


