# NodeForge

A simple Node.js + Express + Mongoose CRUD application, fully Dockerized.

## Project Structure

```
my-app/
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── db.js
│   └── app.js
├── settings/
│   |── default.json
|   └── .env
├── node_modules/
├── .gitignore
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Features

* Basic CRUD operations for a User model
* MongoDB database with Mongoose
* RESTful API with Express.js
* Dockerized for easy deployment

---

## Installation (Local)

1. Clone the repository:

```
git clone <repo-url>
cd my-app
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydatabase or (CLOUD URI)
```

4. Start the app:

```
npm start
```

API runs at: `http://localhost:5000`

---

## Using Docker

1. Build and run containers:

```
docker-compose up --build
```

2. Access the API:

```
http://localhost:5000/notes/
```

MongoDB runs at:

```
mongodb://localhost:27017/mydatabase
```

---