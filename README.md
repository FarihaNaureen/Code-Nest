<div align="center">

# 🏰 CodeNest

### A Gamified Data Structures & Algorithms Learning Platform

Learn Data Structures and Algorithms through an immersive RPG-inspired adventure where every coding challenge unlocks new worlds, rewards, and achievements.

![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=springboot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js&logoColor=white)

</div>

---

# 📖 About

**CodeNest** is a full-stack gamified learning platform designed to make **Data Structures and Algorithms (DSA)** engaging and interactive.

Instead of solving problems on a traditional coding website, learners progress through fantasy-themed worlds, complete coding challenges, earn experience points, unlock achievements, and improve their programming skills in a game-like environment.

The platform combines modern web technologies with Spring Boot to deliver a secure, scalable, and enjoyable learning experience.

---

# ✨ Features

- 🔐 Secure User Authentication (JWT + HTTP-only Cookies)
- 📧 OTP Email Verification
- 🎮 RPG-inspired DSA Learning Experience
- 🗺️ Four Interactive Learning Worlds
- ⚔️ 40+ Coding Challenges
- ⭐ XP, Gold, Gems & Achievement System
- 🏆 Leaderboard & User Progress Tracking
- 👤 Student Profile Management
- 🛠️ Admin Dashboard
- 🌙 Light & Dark Theme
- 📱 Responsive Design
- 🎨 Interactive 2D Game Interface
- 🧙 3D Character Viewer

---

# 🌍 Learning Worlds

| World | Topics Covered |
|--------|----------------|
| 🏰 Arrays & Strings Kingdom | Arrays, Strings |
| 🏜 Linked List Desert | Linked Lists |
| 🏛 Stacks & Queues Vault | Stacks, Queues |
| 🔍 Searching Realm | Linear Search, Binary Search |

---

# 🛠️ Tech Stack

## Backend

- Java 17
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data MongoDB
- JWT Authentication
- WebSocket
- Spring Mail
- Maven

## Frontend

- HTML5
- CSS3
- JavaScript
- Vite
- Thymeleaf
- Canvas API
- Three.js

## Database

- MongoDB Atlas

## Development Tools

- Spring Tools Suite (STS)
- Git
- GitHub
- Maven

---

# 🏗️ Project Architecture

```text
                Browser
                   │
        HTML • CSS • JavaScript
                   │
             Spring Boot MVC
                   │
      Spring Security + JWT
                   │
          Spring Data MongoDB
                   │
            MongoDB Atlas
```

---

# 📂 Project Structure

```text
Code-Nest
│
├── GAME/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/codenest/
│       │       ├── controller/
│       │       ├── service/
│       │       ├── repository/
│       │       ├── model/
│       │       ├── config/
│       │       └── security/
│       │
│       ├── resources/
│       │   ├── static/
│       │   ├── templates/
│       │   └── application.properties
│       │
│       └── test/
│
├── pom.xml
├── mvnw
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Java 17
- Maven
- Node.js & npm
- MongoDB Atlas
- Git

---

## Clone the Repository

```bash
git clone https://github.com/FarihaNaureen/Code-Nest.git
```

```bash
cd Code-Nest
```

---

## Configure Environment Variables

Create your own configuration and provide:

- MongoDB Connection URI
- JWT Secret Key
- Email Username
- Email Password

Store sensitive credentials using **environment variables** instead of hardcoding them into the project.

---

## Build the Frontend

```bash
cd GAME
npm install
npm run build
```

---

## Run the Backend

Using Maven:

```bash
mvn spring-boot:run
```

or simply run the Spring Boot application from **Spring Tools Suite (STS)**.

---

# 🎮 Gameplay

1. Register a new account
2. Verify your email using OTP
3. Login to CodeNest
4. Explore different learning worlds
5. Solve coding challenges
6. Earn XP & rewards
7. Unlock new levels
8. Compete on the leaderboard

---

# 📸 Screenshots

> Add screenshots here after completing the UI.

- Home Page
- Login Page
- Dashboard
- World Map
- Coding Challenge
- Leaderboard
- Admin Dashboard

---

# 🔒 Security

- JWT Authentication
- HTTP-only Cookies
- Password Encryption
- OTP Email Verification
- Secure MongoDB Integration

---

# 🚧 Future Enhancements

- Judge0 Code Execution
- AI Coding Assistant
- Multiplayer Coding Battles
- Guild & Team System
- Daily Coding Challenges
- Coding Contests
- Voice Chat During Multiplayer
- Mobile Application

---

# 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create a new feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👩‍💻 Author

**Fariha Naureen**

- GitHub: https://github.com/FarihaNaureen

---

<div align="center">

**Built with ❤️, Java, Spring Boot & a passion for making DSA learning fun.**

</div>
