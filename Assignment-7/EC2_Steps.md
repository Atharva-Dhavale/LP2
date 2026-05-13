# Assignment 7 — Deploy Static Website on AWS EC2

> **CC:** Design and deploy a static website on a cloud virtual machine/instance.  
> Configure the server and networking settings so that the website is **publicly accessible** and can be **updated remotely**.

---

## 📁 Files in This Assignment

| File | Purpose |
|------|---------|
| `index.html` | Main webpage (Portfolio) |
| `style.css` | Styling (dark theme, animations) |
| `script.js` | Interactivity (scroll, fade-in, typing) |
| `EC2_Steps.md` | This guide |

---

## 🌐 Architecture Overview

```
Your Browser
    │
    ▼  HTTP (Port 80)
┌──────────────────────────────┐
│   AWS EC2 Instance           │
│   OS: Ubuntu 22.04 LTS       │
│   Web Server: Nginx          │
│   Public IP: <Elastic IP>    │
│   Security Group: port 22,80 │
└──────────────────────────────┘
```

---

## STEP 1 — Create an AWS Account

1. Go to [https://aws.amazon.com](https://aws.amazon.com)
2. Click **Create an AWS Account**
3. Enter email, password, account name
4. Add payment info (Free Tier available — no charges for t2.micro)
5. Verify phone number → Select **Free Basic Support** → Done

---

## STEP 2 — Launch an EC2 Instance

1. Log in to **AWS Management Console** → [https://console.aws.amazon.com](https://console.aws.amazon.com)
2. Search for **EC2** in the top search bar → Click **EC2**
3. Click **"Launch Instance"** (orange button)

### Fill in the settings:

| Setting | Value |
|---------|-------|
| **Name** | `MyStaticWebsite` |
| **AMI (OS)** | Ubuntu Server 22.04 LTS (Free tier eligible) |
| **Instance Type** | `t2.micro` (Free Tier — 1 vCPU, 1 GB RAM) |
| **Key Pair** | Create new → Name: `my-key` → RSA → `.pem` → Download & Save |
| **Network Settings** | Allow SSH (22), Allow HTTP (80) |
| **Storage** | 8 GB gp2 (default) |

4. Click **"Launch Instance"** → Wait 1-2 minutes for it to start

---

## STEP 3 — Configure Security Group (Networking)

> Security Groups act as a firewall for your EC2 instance.

1. Go to **EC2 Dashboard** → Left sidebar → **Security Groups**
2. Find the security group attached to your instance
3. Click on it → **Inbound Rules** tab → **Edit Inbound Rules**

Add these rules:

| Type | Protocol | Port | Source |
|------|----------|------|--------|
| SSH | TCP | 22 | My IP (for security) |
| HTTP | TCP | 80 | Anywhere (0.0.0.0/0) |

4. Click **Save Rules**

---

## STEP 4 — Connect to EC2 via SSH

### On Mac/Linux:

```bash
# 1. Navigate to where your key file is saved
cd ~/Downloads

# 2. Fix key permissions (REQUIRED — otherwise SSH will reject it)
chmod 400 my-key.pem

# 3. Connect to EC2 (replace <PUBLIC-IP> with your instance's Public IPv4)
ssh -i my-key.pem ubuntu@<PUBLIC-IP>
```

### Example:
```bash
ssh -i my-key.pem ubuntu@54.123.45.67
```

> 💡 Find your Public IP: EC2 Dashboard → Instances → Click your instance → Copy **Public IPv4 address**

### On Windows:
- Use **PuTTY** or **Windows Terminal**
- Convert `.pem` to `.ppk` using PuTTYgen, then connect using PuTTY

---

## STEP 5 — Install Nginx Web Server

Run these commands **inside your EC2 terminal** (after SSH):

```bash
# Update package list
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Start Nginx service
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check Nginx status (should say: active (running))
sudo systemctl status nginx
```

**Test:** Open browser → go to `http://<YOUR-PUBLIC-IP>` → You should see the **Nginx Welcome Page** ✅

---

## STEP 6 — Upload Your Website Files

Nginx serves files from `/var/www/html/` directory by default.

### Method A — Direct copy via SCP (from your local machine):

```bash
# From your LOCAL machine terminal (not EC2)
# Replace <PUBLIC-IP> with your instance IP

# Upload all files at once from the Assignment-7 folder
scp -i my-key.pem index.html style.css script.js ubuntu@[IP_ADDRESS]:/home/ubuntu/
```

### Then on EC2 — move files to web root:

```bash
# SSH into EC2 first
ssh -i my-key.pem ubuntu@<PUBLIC-IP>

# Remove the default Nginx welcome page
sudo rm /var/www/html/index.nginx-debian.html

# Move uploaded files to Nginx web root
sudo mv /home/ubuntu/index.html /var/www/html/
sudo mv /home/ubuntu/style.css  /var/www/html/
sudo mv /home/ubuntu/script.js  /var/www/html/
```

### Method B — Create files directly on EC2:

```bash
# SSH into EC2
ssh -i my-key.pem ubuntu@<PUBLIC-IP>

# Create and edit index.html directly on EC2
sudo nano /var/www/html/index.html
# (Paste the HTML content → Ctrl+O to save → Ctrl+X to exit)

sudo nano /var/www/html/style.css
sudo nano /var/www/html/script.js
```

---

## STEP 7 — Set File Permissions

```bash
# Give Nginx ownership of the web files
sudo chown -R www-data:www-data /var/www/html/

# Set correct permissions
sudo chmod -R 755 /var/www/html/
```

---

## STEP 8 — Configure Nginx Server Block (Optional but Good Practice)

> Nginx uses **server blocks** (like Apache's virtual hosts) to configure sites.  
> The default config at `/etc/nginx/sites-available/default` already serves `/var/www/html/`.  
> You can verify or customize it:

```bash
# View the default Nginx config
sudo cat /etc/nginx/sites-available/default
```

The key section should look like this:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

```bash
# Test Nginx configuration for syntax errors
sudo nginx -t

# If output says "test is successful", reload Nginx
sudo systemctl reload nginx
```

---

## STEP 9 — Restart Nginx & Test

```bash
# Restart Nginx to apply changes
sudo systemctl restart nginx
```

**Test in Browser:**
```
http://<YOUR-EC2-PUBLIC-IP>
```
Example: `http://54.123.45.67`

You should see your **Portfolio Website** live on the internet! ✅

---

## STEP 10 — Allocate Elastic IP (Optional but Recommended)

> By default, EC2's Public IP changes every time you stop/start the instance.  
> An **Elastic IP** gives you a **permanent static IP**.

1. EC2 Dashboard → Left sidebar → **Elastic IPs**
2. Click **"Allocate Elastic IP Address"** → Click **Allocate**
3. Select the new IP → **Actions** → **Associate Elastic IP Address**
4. Select your EC2 instance → Click **Associate**

Now your site will always be at the same IP! ✅

---

## STEP 11 — Update Website Remotely

To update your website files later:

```bash
# From local machine — upload updated files
scp -i my-key.pem index.html style.css script.js ubuntu@<PUBLIC-IP>:/home/ubuntu/

# SSH into EC2
ssh -i my-key.pem ubuntu@<PUBLIC-IP>

# Move updated files to web root
sudo mv /home/ubuntu/index.html /var/www/html/
sudo mv /home/ubuntu/style.css  /var/www/html/
sudo mv /home/ubuntu/script.js  /var/www/html/

# Reload Nginx (no downtime)
sudo systemctl reload nginx
```

The changes are live immediately! ✅

---

## 🔍 Useful Commands (Quick Reference)

```bash
# Check Nginx status
sudo systemctl status nginx

# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx (brief downtime)
sudo systemctl restart nginx

# Reload Nginx (no downtime — preferred for config changes)
sudo systemctl reload nginx

# Test Nginx config for syntax errors
sudo nginx -t

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs (see who visited)
sudo tail -f /var/log/nginx/access.log

# Check what's in web root
ls -la /var/www/html/

# Check instance public IP from inside EC2
curl ifconfig.me
```

---

## 🧪 Viva / Theory Questions

### Q1. What is EC2?
**A:** Amazon Elastic Compute Cloud (EC2) is a web service that provides resizable compute capacity (virtual machines) in the AWS cloud. It allows users to run applications on virtual servers called **instances**.

### Q2. What is a Security Group?
**A:** A Security Group acts as a **virtual firewall** for an EC2 instance. It controls **inbound** and **outbound** traffic by defining rules based on protocol, port, and IP address.

### Q3. What is Nginx?
**A:** Nginx (pronounced "engine-x") is a high-performance, open-source **web server** and **reverse proxy** software. It serves static HTML/CSS/JS files over HTTP, listens on **port 80** by default, and serves content from `/var/www/html/`. It is faster and more resource-efficient than Apache for serving static content.

### Q4. What is the difference between `nginx -t`, `reload`, and `restart`?
**A:**  
- `nginx -t` — **Tests** the config file for syntax errors without affecting the running server.  
- `systemctl reload nginx` — **Gracefully reloads** config with zero downtime (existing connections not dropped).  
- `systemctl restart nginx` — **Fully restarts** Nginx; briefly drops all connections.

### Q5. What is the difference between Public IP and Elastic IP?
**A:** A **Public IP** is dynamically assigned and changes each time you stop/start an instance. An **Elastic IP** is a **static, permanent IP** that stays the same even after restart.

### Q6. What is a Key Pair (.pem file)?
**A:** A key pair is used for **secure SSH authentication** to your EC2 instance. The `.pem` file is the **private key** stored on your local machine. AWS holds the corresponding **public key** on the EC2 instance.

### Q7. What is SCP?
**A:** SCP (Secure Copy Protocol) is a command-line tool that uses SSH to securely **transfer files** between your local machine and a remote server (like EC2).

### Q8. Why do we use port 80?
**A:** Port 80 is the **default port for HTTP** (web traffic). When you type a URL in a browser without specifying a port, the browser automatically connects to port 80.

### Q9. What is a static website?
**A:** A static website consists of **fixed HTML, CSS, and JavaScript files** that are the same for every visitor. Unlike dynamic websites, they don't require a database or server-side processing.

### Q10. What is a Nginx Server Block?
**A:** A **server block** in Nginx is a configuration unit (similar to Apache's Virtual Host) that defines how Nginx handles requests for a specific domain or IP. It specifies the root directory, index file, and URL routing rules.

---

## ✅ Summary

| Step | Action |
|------|--------|
| 1 | Create AWS account |
| 2 | Launch EC2 (Ubuntu, t2.micro) |
| 3 | Configure Security Group (ports 22, 80) |
| 4 | SSH into EC2 using .pem key |
| 5 | Install Nginx web server |
| 6 | Upload HTML/CSS/JS files to `/var/www/html/` |
| 7 | Set file permissions (`www-data`) |
| 8 | Verify/configure Nginx server block (`nginx -t`) |
| 9 | Access site at `http://<PUBLIC-IP>` |
| 10 | (Optional) Assign Elastic IP for permanent address |
| 11 | Update files remotely via SCP + SSH + `nginx reload` |

---

*Assignment 7 — LP-II | Savitribai Phule Pune University | CC: Cloud Computing*
