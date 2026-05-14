# Deploying Event Registration App to AWS EC2

## Stack Overview
- **Frontend**: React + Vite (built as static files, served by Express)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (remote)
- **Server**: AWS EC2 (Ubuntu)

---

## Prerequisites
- AWS account with an EC2 key pair (`.pem` file — you already have `awskey.pem`)
- MongoDB Atlas cluster already set up (URI provided)

---

## Step 1: Launch an EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Choose **Ubuntu Server 22.04 LTS (Free Tier eligible)**
3. Instance type: **t2.micro** (free tier) or higher
4. Key pair: Select or upload your existing key pair (`awskey.pem`)
5. **Security Group — add these inbound rules:**

   | Type        | Protocol | Port | Source    |
   |-------------|----------|------|-----------|
   | SSH         | TCP      | 22   | My IP     |
   | HTTP        | TCP      | 80   | Anywhere  |
   | Custom TCP  | TCP      | 3000 | Anywhere  |

6. Click **Launch Instance**
7. Note the **Public IPv4 address** of your instance (e.g., `54.x.x.x`)

---

## Step 2: Connect to EC2 via SSH

On your local machine (from the folder containing `awskey.pem`):

```bash
chmod 400 awskey.pem
ssh -i awskey.pem ubuntu@3.111.219.1
```

---

## Step 3: Install Node.js and npm on EC2

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

---

## Step 4: Install Git and Clone the Repository

```bash
sudo apt install -y git

# Clone your project (replace with your actual repo URL)
git clone https://github.com/<your-username>/Event-Registration.git

# Navigate into the project
cd Event-Registration
```

> **If you don't have a GitHub repo**, you can copy files using `scp` from your local machine:
> ```bash
> # Run this on your LOCAL machine
> scp -i awskey.pem -r "./Event-Registration-main" ubuntu@3.111.219.1:~/
> ```

---

## Step 5: Create the `.env` File

```bash
# Inside the project root on EC2
nano .env
```

Paste the following content:

```
MONGO_URI=mongodb+srv://atharvadhavale5:Atharva6013@clusterone.owvrs.mongodb.net/event-registration?retryWrites=true&w=majority&appName=ClusterOne
PORT=3000
```

Save and exit: `Ctrl+O` → `Enter` → `Ctrl+X`

---

## Step 6: Allow EC2 IP in MongoDB Atlas

1. Go to **MongoDB Atlas → Network Access**
2. Click **Add IP Address**
3. Add your EC2 public IP: `<YOUR_EC2_PUBLIC_IP>/32`
   - Or click **Allow Access from Anywhere** (`0.0.0.0/0`) for simplicity (less secure)
4. Click **Confirm**

---

## Step 7: Install Dependencies and Build the App

```bash
# Install backend dependencies
npm install

# Install frontend dependencies and build
cd client
npm install
npm run build
cd ..
```

This builds the React app into `client/dist/`, which Express will serve as static files.

---

## Step 8: Start the Server

```bash
node server.js
```

You should see:
```
🔥 MongoDB Connected
🚀 Server running on port 3000
```

Test it by visiting: `http://<YOUR_EC2_PUBLIC_IP>:3000`

---

## Step 9: Keep the App Running with PM2

Without PM2, the app stops when you close the SSH session.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app with PM2
pm2 start server.js --name "event-registration"

# Save PM2 process list so it restarts on reboot
pm2 save
pm2 startup
# Run the command that pm2 startup outputs (it will look like: sudo env PATH=... pm2 startup ...)
```

### Useful PM2 commands:
```bash
pm2 status              # Check running processes
pm2 logs event-registration   # View logs
pm2 restart event-registration
pm2 stop event-registration
```

---

## Step 10: (Optional) Serve on Port 80 with Nginx

By default the app runs on port 3000. To serve it on the standard HTTP port 80:

```bash
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/event-registration
```

Paste this config:

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

```bash
# Enable the config
sudo ln -s /etc/nginx/sites-available/event-registration /etc/nginx/sites-enabled/

# Test and reload Nginx
sudo nginx -t
sudo systemctl restart nginx
```

Now your app is accessible at: `http://<YOUR_EC2_PUBLIC_IP>` (no port needed)

---

## Quick Reference: Full Command Sequence

```bash
# 1. SSH into EC2
chmod 400 awskey.pem
ssh -i awskey.pem ubuntu@<YOUR_EC2_PUBLIC_IP>

# 2. Setup
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# 3. Get the code
git clone https://github.com/<your-username>/Event-Registration.git
cd Event-Registration

# 4. Create .env
echo 'MONGO_URI=mongodb+srv://atharvadhavale5:Atharva6013@clusterone.owvrs.mongodb.net/event-registration?retryWrites=true&w=majority&appName=ClusterOne' > .env
echo 'PORT=3000' >> .env

# 5. Build and start
npm install
cd client && npm install && npm run build && cd ..
sudo npm install -g pm2
pm2 start server.js --name "event-registration"
pm2 save && pm2 startup
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` on MongoDB | Add EC2 IP to MongoDB Atlas Network Access |
| Port 3000 not accessible | Check EC2 Security Group inbound rules |
| App stops after SSH disconnect | Use PM2 (Step 9) |
| `Missing MONGO_URI` error | Verify `.env` file exists in project root |
| Build fails on EC2 | Ensure Node.js 18+ is installed (`node -v`) |
