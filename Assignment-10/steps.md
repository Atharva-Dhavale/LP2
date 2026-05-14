# Deployment Steps: Student Management App on AWS EC2

## Stack Overview
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (file-based, `database.sqlite`)
- **Port:** 3000
- **Key file:** `awskey.pem`

---

## Step 1: Launch an EC2 Instance (AWS Console)

1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2) → **Launch Instance**
2. Choose **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (Free Tier eligible)
3. Select instance type: **t2.micro** (Free Tier)
4. Under **Key pair**, select or create a key pair — use `awskey.pem` (already available)
5. Under **Network settings → Security Group**, add the following inbound rules:

   | Type        | Protocol | Port | Source    |
   |-------------|----------|------|-----------|
   | SSH         | TCP      | 22   | My IP     |
   | Custom TCP  | TCP      | 3000 | 0.0.0.0/0 |

6. Click **Launch Instance** and wait for the instance state to show **Running**
7. Note the **Public IPv4 address** of the instance (e.g., `3.91.x.x`)

---

## Step 2: Set Permissions on the PEM Key (Local Machine)

```bash
chmod 400 awskey.pem
```

---

## Step 3: SSH into the EC2 Instance

```bash
ssh -i awskey.pem ubuntu@65.1.134.217
```

Replace `<YOUR_EC2_PUBLIC_IP>` with the actual public IP from Step 1.

---

## Step 4: Install Node.js on EC2

```bash
# Update package list
sudo apt update

# Install Node.js (v18 LTS via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

---

## Step 5: Transfer the App to EC2 (From Local Machine)

Open a **new terminal on your local machine** (keep the SSH session open in the other tab).

```bash
scp -i awskey.pem -r /Users/apple/Desktop/Work/LP2/Assignment-10/student-management-app ubuntu@65.1.134.217:~/student-management-app
```

---

## Step 6: Install Dependencies on EC2

Back in the SSH session:

```bash
cd ~/student-management-app
npm install
```

This installs `express`, `sqlite3`, and `cors` as defined in `package.json`.

---

## Step 7: Run the App

### Option A — Run directly (stops when SSH session closes)

```bash
node server.js
```

### Option B — Run with PM2 (recommended, keeps app alive after logout)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app
pm2 start server.js --name student-management-app

# Save PM2 process list so it restarts on reboot
pm2 save
pm2 startup
# Run the command that pm2 startup prints out
```

---

## Step 8: Access the App

Open your browser and navigate to:

```
http://65.1.134.217:3000
```

You should see the Student Management App running.

---

## Step 9: Stop / Restart the App (PM2 Commands)

```bash
pm2 list                          # View running processes
pm2 stop student-management-app   # Stop the app
pm2 restart student-management-app # Restart the app
pm2 logs student-management-app   # View logs
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Permission denied (publickey)` | Run `chmod 400 awskey.pem` and ensure you're using the correct key |
| App not accessible in browser | Check Security Group inbound rule allows TCP port 3000 from `0.0.0.0/0` |
| `sqlite3` install fails on EC2 | Run `sudo apt install -y build-essential python3` then `npm install` again |
| Port 3000 already in use | Run `sudo lsof -i :3000` and kill the conflicting process |

---

## Notes

- The SQLite database file (`database.sqlite`) is created automatically on first run inside the app directory.
- To use port 80 instead of 3000, either set `PORT=80` environment variable or add an Nginx reverse proxy.
- For production, consider using **Nginx** as a reverse proxy and enabling **HTTPS** via Let's Encrypt.
