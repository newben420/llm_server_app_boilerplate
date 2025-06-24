# 🚀 LLM Server App Boilerplate (Express + Expo + Groq)

This is a full-stack boilerplate project built with **Express (Node.js)** and **Expo (React Native)** to rapidly build mobile applications integrated with **Groq LLMs** or similar AI services. It offers secure, login-less device-based authentication, push notification support, localization, theming, and offline-friendly data storage.

---

## 📦 Features

### ✅ Backend (Node.js + Express)
- 🌐 **REST API with Express** — organized and scalable.
- 🔐 **JWT-based Authentication** — unique device ID per install.
- 🛡️ **Login-less Registration Flow** — auto-registration via device + push token.
- 📊 **MySQL Integration** — user/device data schema ready.
- 🤖 **Groq LLM Request Engine** — model queuing, rate limits, priority handling.
- ⚙️ **Centralized Error Logging** & graceful shutdowns on `SIGINT`/`SIGTERM`.

### 📱 Frontend (React Native + Expo)
- ✨ **Material UI with React Native Paper**.
- 🌍 **i18n Localization** — switch languages dynamically.
- 🌗 **Theming Support** — light/dark/system toggle.
- 📦 **Secure Token Storage** — using `expo-secure-store`.
- 💾 **SQLite Integration** — for offline/local data use.
- 🔔 **Push Notification Setup** — Expo-compatible.

---

## 🏗️ Project Structure

```
├── app/                     # React Native frontend
│   ├── components/          # UI components (Home, Settings)
│   ├── library/             # API wrapper, auth, db, i18n
│   ├── assets/              # App icons, splash
│   └── App.tsx              # App entry point
├── server/                  # Express backend
│   ├── src/
│   │   ├── engine/          # Groq Engine, DB connector, JWT
│   │   ├── lib/             # Utils, response helpers
│   │   └── api/             # API router (auth/register)
│   └── package.json         # Backend dependencies
├── misc/db/db.sql           # MySQL schema
├── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/newben420/llm_server_app_boilerplate.git
cd llm_server_app_boilerplate
```

---

## 🧩 Setup Instructions

### 🔧 Backend (Express)

#### 📦 Install Dependencies

```bash
cd server
npm install
```

#### ⚙️ Configure Environment

Copy and configure `.env` from the sample:

```bash
cp sample.env .env
```

#### 🛠️ Build and Run

```bash
npm run build
npm run dev
```

> Server runs on `http://localhost:3000` and handles `/api/register` for device registration.

---

### 📱 Frontend (Expo)

#### 📦 Install Dependencies

```bash
cd app
npm install
```

#### ▶️ Run the App

```bash
npm run start # OR
npx expo start
```

Choose to run on **iOS**, **Android**, or **Web** using Expo CLI.

---

## 🧠 How It Works

### 1. 📲 Device Auto Registration

* Each app install is given a **unique device ID**.
* On launch, the app sends this ID and push token to `/api/register`.
* Server returns a **JWT**, signed with a key derived from that device ID.

### 2. 🔐 JWT Authorization

* JWT is securely stored via `expo-secure-store`.
* Used for all API requests with automatic refresh support.

### 3. 🤖 Groq LLM API Engine

* Groq API access is **rate-limited and queued** per model.
* Supports model prioritization, retry logic, and token usage tracking.

---

## 🧪 Sample SQL (MySQL/MariaDB)

The database schema includes a `user` table:

```sql
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id VARCHAR(255) UNIQUE NOT NULL,
  push_token TEXT,
  reg_timestamp TEXT NOT NULL,
  last_updated TEXT NOT NULL
);
```

See [`misc/db/db.sql`](misc/db/db.sql) for full schema.

---

## 🔒 Security Highlights

* Tokens stored using `expo-secure-store` (encrypted).
* Each JWT is signed using a device-specific secret.
* Invalid or missing tokens are denied by middleware.
* JWT includes expiration and issuer validation.

---

## 🧰 Dev Tools

* TypeScript on both frontend & backend
* Nodemon + ts-node for server development
* Expo Go for quick mobile testing

---

## 📡 API Reference

### `POST /api/register`

Registers device and returns JWT token.

**Payload:**

```json
{
  "id": "device-uuid",
  "token": "expo-push-token"
}
```

**Response:**

```json
{
  "succ": true,
  "message": "<JWT_TOKEN>"
}
```

---

## 📘 TODO / Ideas

* [ ] Extend API endpoints for chat, logging, analytics
* [ ] Add image upload support
* [ ] Admin dashboard to monitor usage
* [ ] Integrate OpenAI fallback / backup model
* [ ] Add frontend chat UI

---

## 👨‍💻 Author & Credits

Built with ❤️ by [@newben420](https://github.com/newben420)  
Contributions and feedback are welcome!

---

## 🛡️ License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for more details.
