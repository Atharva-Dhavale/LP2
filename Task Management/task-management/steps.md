# Deploying Task Management App on AWS EC2

This is a MERN stack application (MongoDB Atlas + Express + React + Node.js).  
The Express server serves the built React frontend as static files — so only **one EC2 instance and one port (3000)** are needed.

---

## Prerequisites

- An AWS account with EC2 access
- A MongoDB Atlas cluster with a connection URI
- Your `.pem` key file (e.g., `awskey.pem`)
- The app code pushed to a GitHub repository (or you can SCP it)

---

## Step 1 — Launch an EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Choose **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
3. Select instance type: **t2.micro** (free tier) or larger
4. Under **Key pair**, select or create a key pair — download the `.pem` file
5. Under **Network settings → Security Group**, add the following inbound rules:

   | Type        | Protocol | Port | Source    |
   |-------------|----------|------|-----------|
   | SSH         | TCP      | 22   | My IP     |
   | Custom TCP  | TCP      | 3000 | 0.0.0.0/0 |

6. Click **Launch Instance**

---

## Step 2 — Connect to the EC2 Instance

On your local machine, set the correct permissions on your key file and SSH in:

```bash
chmod 400 awskey.pem
ssh -i awskey.pem ubuntu@15.206.125.172

```

Replace `<YOUR_EC2_PUBLIC_IP>` with the **Public IPv4 address** from the EC2 console.

---

## Step 3 — Install Node.js and npm

```bash
# Update package list
sudo apt update

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

---

## Step 4 — Install Git and Clone the Repository

```bash
sudo apt install -y git

git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/task-management
```

> If you are not using GitHub, copy the project using `scp`:
> ```bash
> scp -i awskey.pem -r ./task-management ubuntu@<YOUR_EC2_PUBLIC_IP>:~/
> ```

---

## Step 5 — Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Update the file with your actual values:

```env
MONGO_URI=mongodb+srv://atharvadhavale5:Atharva6013@clusterone.owvrs.mongodb.net/task-management?retryWrites=true&w=majority&appName=ClusterOne
PORT=3000
```

Save and exit: `Ctrl+O`, `Enter`, `Ctrl+X`

> **MongoDB Atlas Network Access:** Make sure your EC2 instance's public IP is whitelisted in  
> **MongoDB Atlas → Network Access → Add IP Address**.  
> You can also use `0.0.0.0/0` to allow all IPs (not recommended for production).

---

## Step 6 — Install Dependencies and Build the Frontend

Run each step separately to avoid directory issues with `npm start`:

```bash
# 1. Install backend dependencies (from project root)
npm install

# 2. Install frontend dependencies and build the React app
cd client
npm install
npm run build
cd ..

# 3. Start the Express server from the project root
node server.js
```

This builds the Vite/React app into `client/dist/`, which Express then serves as static files.

---

## Step 7 — Verify the Application

Open a browser and navigate to:

```
http://15.206.125.172:3000
```

You should see the Task Management application running.

---

## Step 8 — Keep the App Running with PM2

Without a process manager, the app stops when you close the SSH session. Use **PM2** to keep it alive:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Build the client first (one time, if not already done)
cd client && npm install && npm run build
cd ..

# Start the server with PM2 from the project root
pm2 start server.js --name task-management

# Save the process list so it restarts on reboot
pm2 save
pm2 startup
```

Run the `sudo env ...` command that `pm2 startup` outputs to enable auto-start on reboot.

### Useful PM2 commands

```bash
pm2 status              # Check running processes
pm2 logs task-management  # View live logs
pm2 restart task-management
pm2 stop task-management
```

---

## Step 9 — (Optional) Use Port 80 with Nginx

If you want to access the app on the standard HTTP port (80) instead of 3000:

```bash
sudo apt install -y nginx
```

Create a reverse proxy config:

```bash
sudo nano /etc/nginx/sites-available/task-management
```

Paste the following:

```nginx
server {
    listen 80;
    server_name <YOUR_EC2_PUBLIC_IP>;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/task-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Add port **80** to your EC2 Security Group inbound rules, then access the app at:

```
http://<YOUR_EC2_PUBLIC_IP>
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Permission denied (publickey)` | Check `.pem` file permissions: `chmod 400 awskey.pem` |
| `MongoDB connection error` | Verify `MONGO_URI` in `.env` and whitelist EC2 IP in Atlas |
| App not accessible in browser | Check EC2 Security Group has port 3000 (or 80) open |
| Port 3000 already in use | Run `sudo lsof -i :3000` and kill the process |
| `client/dist` not found | Run `cd client && npm install && npm run build` manually |
