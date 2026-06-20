# Restaurant POS Backend - Authentication System

## Overview
Complete Node.js + Express authentication system with JWT tokens and MongoDB integration.

## Project Structure
```
cafe/
├── models/
│   ├── User.js              (User schema with validation)
│   └── Product.js
├── controllers/
│   ├── authController.js    (signup & login logic)
│   └── (other controllers)
├── routes/
│   ├── authRoutes.js        (auth endpoints)
│   └── productRoutes.js
├── middleware/
│   └── authMiddleware.js    (JWT verification)
├── config/
│   └── db.js
├── server.js
├── .env
└── package.json
```

## User Model (models/User.js)

### Fields:
- **name** (String, required): User's full name (min 2 characters)
- **email** (String, required, unique): Valid email address with regex validation
- **password** (String, required): Hashed with bcryptjs (min 6 characters), not returned by default
- **role** (String, enum: "staff"/"manager"/"admin"): Default is "staff"
- **timestamps**: Auto-generated createdAt and updatedAt

## API Endpoints

### 1. User Signup
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

**Error Responses:**
- 400: Missing required fields, invalid email format, password too short
- 409: User with email already exists

---

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff"
  }
}
```

**Error Responses:**
- 400: Missing email or password
- 401: Invalid email or password

---

## Protected Routes

### How to Use JWT Token
Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Or simply:
```
Authorization: YOUR_JWT_TOKEN_HERE
```

### Example Protected Request
```bash
curl -X GET http://localhost:5000/api/products/all \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Environment Variables (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://cafeadmin:cafe123@cluster0.5jsc97r.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_here
```

**Note:** 
- Change `JWT_SECRET` to a strong random string in production
- Token expiration: 24 hours

## Authentication Middleware (authMiddleware.js)

### Features:
- Verifies JWT token from Authorization header
- Supports both "Bearer token" and plain token formats
- Distinguishes between token expiration and invalid token errors
- Attaches decoded user data to `req.user`

### Responses:
- 401: Missing authorization header
- 401: No token provided
- 401: Invalid token (includes specific error: expired, malformed, etc.)
- 500: Server error

## Auth Controller (authController.js)

### Signup Function:
1. Validates input (name, email, password required)
2. Checks email uniqueness
3. Validates email format with regex
4. Hashes password with bcryptjs (salt rounds: 10)
5. Saves user to MongoDB
6. Returns success with user data (no password)

### Login Function:
1. Validates input (email, password required)
2. Finds user by email (case-insensitive)
3. Compares passwords using bcryptjs
4. Generates JWT token with user ID, email, and role
5. Returns token and user data

## Error Handling

### Status Codes:
- **201**: User successfully created
- **200**: Login successful
- **400**: Bad request (validation errors)
- **401**: Unauthorized (invalid credentials or token)
- **409**: Conflict (email already exists)
- **500**: Server error

### Unique Constraints:
- Email must be unique (MongoDB enforces with `unique: true`)
- Duplicate email attempts return 409 status

## Security Features

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **JWT Tokens**: 24-hour expiration
3. **Input Validation**: Email format, password length, required fields
4. **Error Messages**: Generic messages to prevent user enumeration
5. **Email Normalization**: Lowercase stored and queried
6. **Password Field**: Not returned in queries (select: false)

## Testing with Postman

### Step 1: Signup
```
POST http://localhost:5000/api/auth/signup
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test1234"
}
```

### Step 2: Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "test1234"
}
```
Response will include a `token`.

### Step 3: Use Token to Access Protected Route
```
GET http://localhost:5000/api/products/all
Headers:
Authorization: Bearer <your_token_from_login>
```

## Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation and verification
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables management

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Future Enhancements
- Refresh token implementation
- Password reset functionality
- Email verification on signup
- Two-factor authentication
- Role-based access control (RBAC) in middleware
- Rate limiting for login attempts
- Audit logging for auth events
