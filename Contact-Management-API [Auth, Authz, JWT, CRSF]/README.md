# Contact Management API

A secure backend API built with **Node.js, Express, and MongoDB** that supports:

* JWT authentication with **access & refresh tokens**
* **Refresh token rotation** and **reuse detection**
* CSRF protection
* CRUD operations for user-specific contacts
* Production-ready cookie handling

---

## 🔹 Features

* **User Authentication**

  * Register & login
  * Short-lived access tokens (10 min)
  * Long-lived refresh tokens (7 days)
  * Token rotation and reuse detection
  * Logout functionality

* **Security**

  * HTTP-only cookies for refresh tokens
  * CSRF protection using double-submit cookie pattern
  * JWT issuer verification
  * Rate limiting to prevent brute-force attacks

* **Contacts Module**

  * Create, read, update, and delete contacts
  * Each user only has access to their own contacts
  * Input validation for required fields
  * Timestamps for created & updated records

* **Tech Stack**

  * Node.js & Express
  * MongoDB & Mongoose
  * JWT for authentication
  * bcrypt for password hashing
  * dotenv for environment variables

---

## 🔹 Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

Example `.env`:

```env
MONGOOSE_URI=mongodb://localhost:27017/contactDatabase
PORT=3000
HOST_NAME="localhost"
NODE_ENV="development"
ACCESS_TOKEN_SECRET=<your-strong-access-token-secret>
REFRESH_TOKEN_SECRET=<your-strong-refresh-token-secret>
```

4. **Start the server**

* Development mode:

```bash
npm run dev
```

* Production mode:

```bash
npm start
```

---

## 🔹 API Endpoints

### Auth Routes

| Method | Endpoint                  | Description                                 |
| ------ | ------------------------- | ------------------------------------------- |
| POST   | `/api/auth/register`      | Register a new user                         |
| POST   | `/api/auth/login`         | Login and receive tokens                    |
| POST   | `/api/auth/refresh-token` | Rotate refresh token & get new access token |
| DELETE | `/api/auth/logout`        | Logout and invalidate refresh token         |

### Contact Routes (Protected)

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/api/contacts`     | Get all contacts for user |
| GET    | `/api/contacts/:id` | Get single contact by ID  |
| POST   | `/api/contacts`     | Create new contact        |
| PUT    | `/api/contacts/:id` | Update contact by ID      |
| DELETE | `/api/contacts/:id` | Delete contact by ID      |

> ⚠️ All contact routes require a valid **access token** in the `Authorization: Bearer <token>` header.

---

## 🔹 Security Notes

* **Access tokens** expire in 10 minutes; refresh tokens expire in 7 days.
* **Refresh token rotation** ensures stolen tokens cannot be reused.
* **CSRF protection** requires sending the `csrfToken` cookie value in the `x-csrf-token` header.
* Cookies are configured as:

  * Refresh token: HTTP-only, secure (HTTPS), SameSite strict
  * CSRF token: readable by frontend JS, secure, SameSite strict

---

## 🔹 Frontend Usage Example (Refresh Token)

```js
// Get CSRF token from cookie
const csrfToken = document.cookie
  .split("; ")
  .find(row => row.startsWith("csrfToken="))
  ?.split("=")[1];

fetch("/api/auth/refresh-token", {
  method: "POST",
  credentials: "include",
  headers: {
    "x-csrf-token": csrfToken
  }
});
```
Perfect! Let’s expand your **frontend usage examples** so it covers all the main interactions with your API — login, refresh token, access protected routes, and CRUD for contacts — with proper CSRF handling and cookies.

Here’s a **full example set**:


```js
// Login
const login = async (email, password) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include", // allows cookies
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  
  console.log("Access token:", data.data.accessToken);

  // CSRF token is stored in cookie automatically
};
```

```js
// Refresh Token
const refreshAccessToken = async () => {
  // Read CSRF token from cookie
  const csrfToken = document.cookie
    .split("; ")
    .find(row => row.startsWith("csrfToken="))
    ?.split("=")[1];

  const res = await fetch("/api/auth/refresh-token", {
    method: "POST",
    credentials: "include", // send refresh token cookie
    headers: {
      "x-csrf-token": csrfToken
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to refresh token");

  console.log("New access token:", data.accessToken);
  return data.accessToken;
};
```

```js
// Logout
const logout = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Logout failed");

  console.log(data.message);
};
```

```js
// Access Protected Route (Get All Contacts)
const getContacts = async (accessToken) => {
  const res = await fetch("/api/contacts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch contacts");

  console.log("Contacts:", data.data);
};
```

```js
// Create a Contact
const createContact = async (accessToken, contact) => {
  const res = await fetch("/api/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(contact)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create contact");

  console.log(data.message, data.data);
};

// Example usage
createContact(accessToken, {
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  message: "Hello!"
});
``` 

```js
// Update a Contact
const updateContact = async (accessToken, contactId, updatedData) => {
  const res = await fetch(`/api/contacts/${contactId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update contact");

  console.log(data.message, data.data);
};
```

```js
// Delete a Contact
const deleteContact = async (accessToken, contactId) => {
  const res = await fetch(`/api/contacts/${contactId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete contact");

  console.log(data.message);
};
```
---

## 🔹 Environment Setup

* **Node.js version >= 18 recommended**
* MongoDB running locally or via MongoDB Atlas
* `.env` file required for secrets & DB connection
* Use HTTPS in production to secure cookies

---

## 🔹 Scripts

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

---

## 🔹 Improvements Can Made For Your Projects

* Hash refresh tokens in DB for zero-trust security
* Multi-device login/session management
* Pagination and search for contacts
* Advanced logging & monitoring
* Rate limiting per user

---