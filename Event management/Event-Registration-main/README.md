Alright, now we do this clean, production-style but still practical-friendly. No chaos, no guessing.

You already have:

* ✅ MongoDB Atlas URI
* ✅ GitHub repo
* ✅ Ubuntu EC2

Let’s deploy step-by-step like a machine.

⸻

⚠️ First — fix your MongoDB URI (important)

Your current:

mongodb+srv://abhirampict_db_user:12345@cluster0.mcde3lm.mongodb.net/?appName=Cluster0

👉 This is incomplete (no DB name)

Use:

mongodb+srv://abhirampict_db_user:12345@cluster0.mcde3lm.mongodb.net/eventdb?retryWrites=true&w=majority

⸻

🚀 FULL DEPLOYMENT COMMANDS (COPY STEP BY STEP)

⸻

🟢 1. Connect to EC2

ssh -i your-key.pem ubuntu@your-public-ip

⸻

🟢 2. Update system

sudo apt update -y

⸻

🟢 3. Install Node.js (latest clean way)

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

⸻

🟢 4. Verify

node -v
npm -v

(should show Node 20)

⸻

🟢 5. Go to home directory

cd ~

⸻

🟢 6. Clone your project

git clone https://github.com/AbhiDevOps369/Event-Registration.git
cd Event-Registration

⸻

🟢 7. Install dependencies

npm install

⸻

🟢 8. Set environment variable (VERY IMPORTANT)

nano .env

Paste:

MONGO_URI=mongodb+srv://abhirampict_db_user:12345@cluster0.mcde3lm.mongodb.net/eventdb?retryWrites=true&w=majority
PORT=3000

Save:

* CTRL + X
* Y
* ENTER

⸻

🟢 9. Build frontend (if React present)

cd client
npm install
npm run build
cd ..

⸻

🟢 10. Run app

npm start

⸻

🌐 11. Open in browser

http://YOUR_PUBLIC_IP:3000

⸻

🔥 12. IMPORTANT (if not loading)

👉 Go AWS → Security Group → Inbound Rules

Add:

Type: Custom TCP
Port: 3000
Source: 0.0.0.0/0

⸻

⚡ OPTIONAL (run in background like pro)

Instead of npm start, do:

npm install -g pm2
pm2 start server.js
pm2 save

⸻

🧠 FINAL FLOW (understand this)

EC2 (Node server)
        ↓
Express API
        ↓
MongoDB Atlas (cloud DB)
        ↓
React frontend

⸻

🧨 Common mistakes you WILL avoid now

* ❌ No DB name in URI
* ❌ Not opening port 3000
* ❌ Running from wrong folder
* ❌ Old Node version

⸻

🎯 Viva one-liner

“The application is deployed on AWS EC2, backend runs on Node.js, database is hosted on MongoDB Atlas, and frontend is served from the same instance.”

⸻

If anything breaks:
👉 send terminal screenshot, I’ll debug instantly
No guessing, no wasting time.
