# 🚀 Redis Rate Limiting API

A production-ready **Express.js + TypeScript** API server with **Redis-based rate limiting** using the Fixed Window algorithm. Built with modern best practices including request validation, correlation IDs for distributed tracing, and structured logging.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7+-DC382D?style=flat-square&logo=redis&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🛡️ **Fixed Window Rate Limiting** | Redis-backed rate limiting (10 requests/60 seconds per user) |
| 🔍 **Correlation IDs** | UUID-based request tracking for distributed tracing |
| ✅ **Request Validation** | Schema validation using Zod |
| 📝 **Structured Logging** | Winston logger with daily rotating log files |
| 🔧 **TypeScript** | Full type safety with modern TypeScript |
| 🔥 **Hot Reload** | Development with Nodemon |

---

## 📁 Project Structure

```
Redis_learning/
├── src/
│   ├── config/              # Configuration files
│   │   ├── index.ts         # Server config (PORT, etc.)
│   │   ├── redis.config.ts  # Redis client setup
│   │   └── logger.config.ts # Winston logger setup
│   ├── controllers/         # Route handlers
│   │   └── ping.controller.ts
│   ├── middlewares/         # Express middlewares
│   │   ├── FixedWindow.ts   # Rate limiting middleware
│   │   ├── correlation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routers/             # API routes
│   │   ├── v1/              # Version 1 API
│   │   └── v2/              # Version 2 API
│   ├── validators/          # Zod schemas
│   │   └── ping.validator.ts
│   ├── utils/               # Utility functions
│   └── server.ts            # App entry point
├── logs/                    # Log files (auto-generated)
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **Redis** server running locally (default: `localhost:6379`)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Siranjeevi123/Express-Typescript-Starter-Template.git <Project Name>
   cd <Project Name>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```bash
   echo "PORT=3000" > .env
   ```

4. **Start Redis server**

   Make sure Redis is running locally:

   ```bash
   # Using Homebrew (macOS)
   brew services start redis

   # Or run directly
   redis-server
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3000` 🎉

---

## 📡 API Endpoints

### Health Check

```http
GET /api/v1/ping/health
```

**Response:** `200 OK`

```
OK
```

---

### Ping (Rate Limited)

```http
GET /api/v1/ping
```

**Headers:**

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_id` | string | ✅ Yes | Unique user identifier for rate limiting |
| `Content-Type` | string | ✅ Yes | Must be `application/json` |

**Request Body:**

```json
{
  "message": "Ping"
}
```

**Success Response:** `200 OK`

```json
{
  "message": "Pong!"
}
```

**Error Responses:**

| Status | Response | Reason |
|--------|----------|--------|
| `400` | `missing user_id` | `user_id` header not provided |
| `429` | `rate limit exceeded` | Exceeded 10 requests in 60 seconds |

---

## 🛡️ Rate Limiting

This API implements the **Fixed Window** rate limiting algorithm using Redis.

### How It Works

| Parameter | Value |
|-----------|-------|
| Window Size | 60 seconds |
| Max Requests | 10 per window |
| Identifier | `user_id` header |

```
┌────────────────────────────────────────────────┐
│                  60 Second Window              │
│                                                │
│   Request 1 ✅  Request 5 ✅  Request 10 ✅   │
│   Request 2 ✅  Request 6 ✅  Request 11 ❌   │
│   Request 3 ✅  Request 7 ✅  Request 12 ❌   │
│   Request 4 ✅  Request 8 ✅       ...        │
│               Request 9 ✅                    │
│                                                │
│   After 60s → Window resets → Requests allowed │
└────────────────────────────────────────────────┘
```

---

## 🧪 Testing with cURL

```bash
# Health check
curl http://localhost:3000/api/v1/ping/health

# Ping with rate limiting
curl -X GET http://localhost:3000/api/v1/ping \
  -H "Content-Type: application/json" \
  -H "user_id: user123" \
  -d '{"message": "Ping"}'

# Test rate limiting (run 11+ times quickly)
for i in {1..12}; do
  echo "Request $i:"
  curl -s http://localhost:3000/api/v1/ping \
    -H "Content-Type: application/json" \
    -H "user_id: test_user" \
    -d '{"message": "Ping"}'
  echo ""
done
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |

---

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |

### Rate Limiting (in `src/middlewares/FixedWindow.ts`)

```typescript
const NUMBER_OF_REQUEST_ALLOWED = 10  // Max requests per window
const WINDOW = 60                      // Window size in seconds
```

---

## 📚 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Express 5](https://expressjs.com/) | Web framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [ioredis](https://github.com/redis/ioredis) | Redis client |
| [Zod](https://zod.dev/) | Schema validation |
| [Winston](https://github.com/winstonjs/winston) | Logging |
| [Nodemon](https://nodemon.io/) | Hot reload |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Siranjeevi123">Siranjeevi</a>
</p>
