# Deploying the E-Commerce MERN App on AWS EC2

## Prerequisites
- AWS account with EC2 access
- Your `.pem` key file (`awskey.pem`)
- MongoDB Atlas cluster already running (connection string ready)

---

## Step 1: Launch an EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Choose **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
3. Select instance type: **t2.micro** (free tier eligible)
4. Create or select an existing key pair — use `awskey.pem`
5. Under **Security Group**, add the following inbound rules:

   | Type        | Protocol | Port Range | Source    |
   |-------------|----------|------------|-----------|
   | SSH         | TCP      | 22         | My IP     |
   | HTTP        | TCP      | 80         | 0.0.0.0/0 |
   | Custom TCP  | TCP      | 3000       | 0.0.0.0/0 |

6. Click **Launch Instance** and wait for it to reach the **running** state
7. Note down the **Public IPv4 address** of the instance

---

## Step 2: Connect to the EC2 Instance

Open your terminal and run:

```bash
chmod 400 awskey.pem
ssh -i "awskey.pem" ubuntu@3.109.216.60
```

Replace `<your-ec2-public-ip>` with the actual IP from the EC2 dashboard.

---

## Step 3: Update the System and Install Node.js

```bash
sudo apt update && sudo apt upgrade -y

# Install Node.js 22.x (required by Vite 5+)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
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
git clone https://github.com/<your-username>/E-commerce-app-main.git

cd E-commerce-app-main
```

> If you don't have a GitHub repo, use `scp` to upload the project folder directly:
> ```bash
> # Run this from your LOCAL machine
> scp -i "awskey.pem" -r ./E-commerce-app-main ubuntu@3.109.216.60:~/
> ```

---

## Step 5: Create the .env File on the Server

```bash
nano .env
```

Paste the following content:

```
MONGO_URI=mongodb+srv://atharvadhavale5:Atharva6013@clusterone.owvrs.mongodb.net/FirstTodoApplication?retryWrites=true&w=majority&appName=ClusterOne
PORT=3000
```

Save and exit: `Ctrl+O` → `Enter` → `Ctrl+X`

---

## Step 6: Allow MongoDB Atlas Access from EC2

1. Go to **MongoDB Atlas → Network Access → Add IP Address**
2. Add your EC2 instance's **Public IPv4 address**
   - Or use `0.0.0.0/0` to allow all IPs (not recommended for production)
3. Click **Confirm**

---

## Step 7: Install Dependencies and Build the Client

```bash
npm install
```

This runs the `postinstall` script automatically, which:
- Installs client dependencies (`cd client && npm install`)
- Builds the React frontend (`npm run build`)

---

## Step 8: Start the Application

### Option A — Run directly (temporary, stops when SSH session ends)

```bash
npm start
```

### Option B — Run with PM2 (recommended, persists after logout)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app
pm2 start server.js --name ecommerce-app

# Save PM2 process list so it restarts on reboot
pm2 save
pm2 startup
# Run the command that pm2 startup outputs
```

---

## Step 9: Access the Application

Open your browser and navigate to:

```
http://3.109.216.60:3000
```

You should see the E-Commerce app running and connected to MongoDB Atlas.

---

## Step 10: (Optional) Serve on Port 80 with Nginx

```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/ecommerce
```

Paste the following Nginx config:

```nginx
server {
    listen 80;
    server_name <your-ec2-public-ip>;

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
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Now the app is accessible at:

```
http://<your-ec2-public-ip>
```

(No port number needed)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `MONGO_URI is not defined` | Make sure `.env` file exists in the project root |
| MongoDB connection refused | Add EC2 IP to MongoDB Atlas Network Access |
| Port 3000 not accessible | Check EC2 Security Group inbound rules |
| App stops after SSH logout | Use PM2 (`pm2 start server.js`) |
| `npm: command not found` | Re-run the Node.js installation step |
