# 📊 Campus Connect – Smart Campus Community Platform

## 🚀 Overview
Campus Connect is a full-stack campus community platform designed to connect students through events, notices, social posts, and campus resources.

Originally built as a static frontend project, it has been transformed into a **data-driven system using MongoDB and Node.js**, incorporating real-world database engineering concepts like indexing, sharding, and aggregation.

---

## ✨ Key Features

- 📅 Event management system with filtering and categorization  
- 📢 Notice board for real-time updates  
- 🌐 Social interaction page for campus engagement  
- 🗺️ Campus map integration  
- 🔍 Fast data retrieval using MongoDB indexing  
- 📊 Analytics using aggregation pipelines  
- 🗂️ Structured data storage with arrays (tags, participants, etc.)

---

## 🧠 Concepts Implemented

### 1️⃣ MongoDB Database Design
- Collections: `events`, `notices`, `users`, `posts`
- Structured schema for scalable data storage

### 2️⃣ Indexing
- Implemented indexes on fields like:
  - event date
  - status
  - priority
- Improved query performance significantly by reducing collection scan time

### 3️⃣ Sharding (Scalability Concept)
- Designed system thinking for horizontal scaling
- Data distribution across multiple shards based on event timelines / load

### 4️⃣ Arrays in MongoDB
- Used arrays to store:
  - event tags (e.g., ["hackathon", "AI", "tech"])
  - participants list
  - attachments and metadata

### 5️⃣ Aggregation Framework
- Used for analytics such as:
  - total events per month
  - most active clubs
  - participant statistics
- Similar to pivot tables in Excel

### 6️⃣ Backend (Node.js + mongosh)
- Backend server built using Node.js
- Database operations handled using `mongosh`
- CRUD operations for events, notices, and posts

---


---
CAMPUS_CONNECT/ folder structure 
│
├── backend/
│ ├── server.js
│ ├── package.json
│ ├── package-lock.json
│ └── node_modules/
│
├── data/
│ ├── events.json
│ └── notices.json
│
├── frontend files/
│ ├── index.html
│ ├── events.html
│ ├── notices.html
│ ├── social.html
│ ├── map.html
│
├── script.js
├── style.css
├── campus-map.jpg
├── thapar-logo.png
└── MIT License.md

## ⚙️ How to Run the Project
```bash
### 🔹 Step 1: Clone Repository
```bash
git clone https://github.com/your-username/campus-connect.git
cd campus-connect

**Step 2: Backend Setup**
cd backend
npm install
node server.js

** Step 3: Open Frontend**
Simply open:

index.html

In your browser OR use the Live Server extension in VS Code.

🧪 Database Setup (MongoDB)
Start MongoDB locally or use MongoDB Atlas
Import JSON files from /data folder:
mongoimport --db campus_connect --collection events --file events.json
mongoimport --db campus_connect --collection notices --file notices.json


```
Future Improvements
Authentication system (students login)
Admin dashboard for event management
Real-time chat system
Cloud deployment (AWS / Render)

Author
Aastha Deep
