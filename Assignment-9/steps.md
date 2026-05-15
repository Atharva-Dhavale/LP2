# 🚀 Complete Blog Application Deployment Guide (AWS EC2 + SCP)

## 📋 Assignment Overview
**Title:** CC- Online Blog Application Deployment  
**Objective:** Deploy a full-stack blog application (frontend, backend, and database) on AWS EC2 using SCP for direct file upload (no GitHub required).

**Features:**
- ✅ React.js Frontend with CRUD interface
- ✅ Express.js Backend REST API
- ✅ SQLite Database for persistence
- ✅ Nginx Reverse Proxy
- ✅ Direct deployment via SCP
- ✅ PM2 Process Management

---

## 📁 Project Structure
```
Assignment-9/
├── backend/                 ← Express.js REST API + SQLite
│   ├── index.js             (Main backend server)
│   ├── package.json         (Dependencies & scripts)
│   ├── blog.db              (SQLite database - auto-generated)
│   └── node_modules/        (Auto-generated, don't upload)
│
├── frontend/                ← React.js Application
│   ├── public/              (Static assets)
│   │   ├── index.html
│   │   └── ...
│   ├── src/                 (Source code)
│   │   ├── App.js
│   │   ├── index.css
│   │   └── ...
│   ├── package.json
│   ├── build/               (Production build - generated)
│   └── node_modules/        (Auto-generated, don't upload)
│
└── .gitignore              (Excludes node_modules, .db, etc)
```

---

## ⚡ PART 1: Local Development Setup

### Prerequisites
- Node.js (v18+) installed
- npm installed  
- Terminal/CLI access

### Step 1: Start Backend Server

Open **Terminal 1**:
```bash
cd Assignment-9/backend
npm install
node index.js
```

**Expected Output:**
```
✅ Backend running at http://localhost:5000
```

Backend features:
- Express.js REST API on port 5000
- SQLite database auto-initialized
- Sample post pre-populated
- CORS enabled for frontend

### Step 2: Start Frontend Application

Open **Terminal 2** (keep Terminal 1 running):
```bash
cd Assignment-9/frontend
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

### Step 3: Test Locally

Browser opens at `http://localhost:3000`:
1. ✅ View the sample post "Welcome to MyBlog!"
2. ✅ Create a new blog post
3. ✅ Edit existing posts
4. ✅ Delete posts with confirmation
5. ✅ All changes saved to SQLite database

---

## 🚀 PART 2: AWS EC2 Deployment with SCP

### Prerequisites
- AWS account (free tier eligible)
- EC2 instance running Ubuntu 22.04 LTS
- SSH key downloaded (.pem file)
- Your project ready locally (no node_modules)

---

### STEP A: AWS Console Setup

#### A1: Launch EC2 Instance

1. Go to **[AWS Console](https://console.aws.amazon.com/)**
2. Navigate to **EC2 Dashboard** → **Launch Instances**
3. **Select AMI:** Ubuntu Server 22.04 LTS (Free tier)
4. **Instance Type:** t2.micro (Free tier)
5. **Storage:** 30 GB (Free tier)
6. **Tags:** Name = `blog-app-server`
7. **Review & Launch**

#### A2: Create Security Group

1. **Security Group Name:** `blog-app-sg`
2. **Inbound Rules:**
   ```
   Protocol | Port | Source
   ---------|------|----------
   SSH      | 22   | YOUR_IP/32
   HTTP     | 80   | 0.0.0.0/0
   HTTPS    | 443  | 0.0.0.0/0
   ```
3. **Outbound Rules:** Allow All (default)

#### A3: Create/Download Key Pair

1. Create new key pair: `blog-app-key`
2. Format: `.pem`
3. Download the file
4. Save securely and set permissions:
   ```bash
   chmod 400 blog-app-key.pem
   ```

#### A4: Launch & Note Public IP

- Wait for instance to reach "Running" state
- Copy the **Public IPv4 Address** (e.g., `54.123.45.67`)

---

### STEP B: Upload Project via SCP (Local Machine)

#### B1: Prepare Project for Upload

```bash
# Navigate to project parent directory
cd /path/to/parent  # e.g., ~/Desktop/sppu/LP2/

# Optional: Remove node_modules to reduce upload size
rm -rf Assignment-9/backend/node_modules
rm -rf Assignment-9/frontend/node_modules

# Check project size
du -sh Assignment-9/
```

#### B2: Upload Using SCP

**Replace `YOUR_EC2_PUBLIC_IP` with actual IP (e.g., 54.123.45.67)**

```bash
# Upload entire project
scp -i mykey.pem -r . ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/

# Alternative: Upload to existing directory
scp -i blog-app-key.pem -r .ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/blog-app/

# Upload backend only
scp -i blog-app-key.pem -r Assignment-9/backend ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/blog-app/

# Upload frontend only
scp -i blog-app-key.pem -r Assignment-9/frontend ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/blog-app/
```

```bash
IMPPPPPP USe this for file uploading(under dir Assignment-9)

scp -i mykey.pem -r backend frontend ubuntu@98.93.192.158:/home/ubuntu/
```


**Verify Upload:**
```bash
scp -i blog-app-key.pem ubuntu@YOUR_EC2_PUBLIC_IP:ls /home/ubuntu/Assignment-9
```

---

### STEP C: EC2 Server Setup (SSH into EC2)

#### C1: Connect to EC2

```bash
ssh -i blog-app-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Expected prompt:
```
ubuntu@ip-172-31-xx-xx:~$
```

#### C2: Install System Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js & npm (v18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
pm2 startup
pm2 save
```

#### C3: Setup Backend

```bash
# Navigate to backend
cd /home/ubuntu/Assignment-9/backend  # or /backend

if(install not work){
   sudo apt update
   sudo apt install build-essential -y
   rm -rf node_modules package-lock.json
   npm install
}


# Install dependencies
npm install

# Start backend with PM2
pm2 start index.js --name "blog-backend"
pm2 save

# Verify backend is running
pm2 list
pm2 logs blog-backend
```

**Test Backend:**
```bash
curl http://localhost:5000/api/posts
# Should return JSON array with posts
```

#### C4: Setup Frontend

```bash
# Navigate to frontend
cd ..
cd /home/ubuntu/Assignment-9/frontend  # or /frontend

# Install dependencies
npm install

# Build production version
npm run build

# Verify build
ls -la build/
# Should contain index.html and other assets
```

#### C5: Configure Nginx Reverse Proxy

```bash
# Backup original config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

# Create new Nginx config
sudo tee /etc/nginx/sites-available/default > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;
    client_max_body_size 100M;
    
    # Serve React frontend from build folder
    location / {
        /home/ubuntu/frontend/build;
        try_files $uri /index.html;
        
        # Cache static assets
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy API requests to Express backend
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

#### C6: Test & Enable Nginx

```bash
# Test Nginx configuration
sudo nginx -t
# Expected: "nginx: configuration file test is successful"

# Enable and restart Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# Verify status
sudo systemctl status nginx
```

---

### STEP D: Verify Deployment

#### D1: Check Services

```bash
# Backend status
pm2 list

# Nginx status
sudo systemctl status nginx

# Test backend locally
curl http://localhost:5000/api/posts

# Test through Nginx
curl http://localhost/api/posts
```

#### D2: Get Public IP

```bash
# Get your EC2 public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

#### D3: Access Application

Open in browser:
```
http://YOUR_EC2_PUBLIC_IP
```

You should see the blog interface!

#### D4: Test CRUD Operations

1. ✅ **Create** - Add new blog post
2. ✅ **Read** - View all posts
3. ✅ **Update** - Edit existing post
4. ✅ **Delete** - Remove post (with confirmation)

---

## 📡 API Endpoints Reference

**Base URL:** `http://YOUR_EC2_PUBLIC_IP/api` (or `/api` if on same server)

| Method | Endpoint    | Description              |
|--------|-------------|--------------------------|
| GET    | `/posts`    | Get all posts            |
| GET    | `/posts/:id` | Get single post          |
| POST   | `/posts`    | Create new post          |
| PUT    | `/posts/:id` | Update post              |
| DELETE | `/posts/:id` | Delete post              |

**Example POST Request:**
```json
{
  "title": "My First Blog Post",
  "author": "John Doe",
  "content": "This is an amazing blog post!"
}
```

---

## 🔄 Update Process (After Initial Deployment)

### To Update Backend Code

```bash
# 1. From local machine, upload updated backend
scp -i blog-app-key.pem -r Assignment-9/backend ubuntu@YOUR_EC2_IP:/home/ubuntu/Assignment-9/

# 2. SSH into EC2
ssh -i blog-app-key.pem ubuntu@YOUR_EC2_IP

# 3. Update backend
cd /home/ubuntu/Assignment-9/backend
npm install  # Only if package.json changed
pm2 restart blog-backend
```

### To Update Frontend Code

```bash
# 1. From local machine, upload updated frontend
scp -i blog-app-key.pem -r Assignment-9/frontend ubuntu@YOUR_EC2_IP:/home/ubuntu/Assignment-9/

# 2. SSH into EC2
ssh -i blog-app-key.pem ubuntu@YOUR_EC2_IP

# 3. Update frontend
cd /home/ubuntu/Assignment-9/frontend
npm install  # Only if package.json changed
npm run build
sudo systemctl reload nginx
```

---

## 🛠️ Tech Stack

| Component  | Technology    | Purpose                    |
|------------|---------------|----------------------------|
| Frontend   | React.js 19   | User interface             |
| Backend    | Express.js 5  | REST API server            |
| Database   | SQLite        | Data persistence           |
| Server     | Nginx         | Reverse proxy & load balancer |
| Process    | PM2           | Process management         |
| Runtime    | Node.js 18    | JavaScript runtime         |

---

## 📝 Key Features Implemented

✅ **CRUD Operations** - Create, read, update, delete posts  
✅ **REST API** - Full API endpoints with proper methods  
✅ **Database** - SQLite for persistent storage  
✅ **Frontend UI** - React with form and post display  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Auto-timestamps** - Posts get creation date  
✅ **CORS Support** - Frontend-backend communication  
✅ **Reverse Proxy** - Nginx for serving frontend & proxying API  
✅ **Process Management** - PM2 keeps backend running  

---

## 🔍 Troubleshooting

### SCP Upload Issues

| Problem | Solution |
|---------|----------|
| "Permission denied (publickey)" | `chmod 400 blog-app-key.pem` |
| "No such file" | `ssh ... mkdir -p /home/ubuntu/Assignment-9/` |
| "Connection refused" | Check EC2 is running and security group allows port 22 from your IP |
| Slow upload | Remove node_modules: `rm -rf Assignment-9/*/node_modules` |

### Backend Issues

| Problem | Solution |
|---------|----------|
| Backend not responding | `pm2 logs blog-backend` to check errors |
| Port 5000 in use | `sudo lsof -i :5000` to find process |
| Database errors | Delete `blog.db` and restart: `pm2 restart blog-backend` |
| Module not found | Run `npm install` in backend directory |

### Frontend Issues

| Problem | Solution |
|---------|----------|
| Blank page | Open browser DevTools (F12) to check console errors |
| API not connecting | Verify API_URL uses `/api/posts` (relative path) |
| 502 Bad Gateway | Backend not running: `pm2 list` and check logs |
| Build not created | Run `npm run build` and verify `build/` folder exists |

### Nginx Issues

| Problem | Solution |
|---------|----------|
| Nginx won't start | `sudo nginx -t` to check configuration |
| Static files 404 | Verify path in config: `/home/ubuntu/Assignment-9/frontend/build` |
| CORS errors | Check API location block in Nginx config |

### Network/Access Issues

| Problem | Solution |
|---------|----------|
| Can't access public IP | Check security group allows port 80 from 0.0.0.0/0 |
| Timeout | EC2 might be down or network issue |
| Domain not resolving | Wait for DNS propagation (5-30 min) if using domain |

---

## 📋 Common Commands

### Monitor & Troubleshoot

```bash
# Backend status and logs
pm2 list
pm2 logs blog-backend
pm2 status blog-backend

# Nginx status and logs
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Test API
curl http://localhost:5000/api/posts
curl http://localhost/api/posts

# Check disk space
df -h

# View running processes
pm2 list
ps aux | grep node
```

### Restart Services

```bash
# Restart backend
pm2 restart blog-backend

# Restart Nginx
sudo systemctl restart nginx

# Restart all
pm2 restart all
sudo systemctl restart nginx
```

### Database Management

```bash
# Backup database
cp /home/ubuntu/Assignment-9/backend/blog.db ~/blog.db.backup

# Download to local
scp -i blog-app-key.pem ubuntu@IP:/home/ubuntu/Assignment-9/backend/blog.db ~/Downloads/

# View database records
sqlite3 /home/ubuntu/Assignment-9/backend/blog.db
sqlite> SELECT * FROM posts;
sqlite> .quit
```

### Stop/Start Services

```bash
# Stop services
pm2 stop blog-backend
sudo systemctl stop nginx

# Start services
pm2 start index.js --name blog-backend
sudo systemctl start nginx

# Delete PM2 process
pm2 delete blog-backend
```

---

## 🔐 Security Best Practices

### SSH Key Management
```bash
# Set correct permissions (CRITICAL!)
chmod 400 blog-app-key.pem

# Move to safe location
mv blog-app-key.pem ~/.ssh/
chmod 700 ~/.ssh/

# Never commit or share key
echo "*.pem" >> .gitignore
```

### Security Group Rules
```
SSH (22):    YOUR_IP/32       ← Only your IP
HTTP (80):   0.0.0.0/0        ← Anyone
HTTPS (443): 0.0.0.0/0        ← Anyone (if using SSL)
```

### System Hardening
```bash
# Update system regularly
sudo apt update && sudo apt upgrade -y

# Monitor logs
sudo tail -f /var/log/auth.log

# Check failed login attempts
grep "Failed password" /var/log/auth.log
```

---

## 💾 Backup & Maintenance

### Backup Database

```bash
# Manual backup
cp /home/ubuntu/Assignment-9/backend/blog.db ~/blog.db.$(date +%Y%m%d_%H%M%S)

# Create backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p "$BACKUP_DIR"
cp /home/ubuntu/Assignment-9/backend/blog.db "$BACKUP_DIR/blog.db.$(date +%Y%m%d_%H%M%S)"
find "$BACKUP_DIR" -type f -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add line: 0 2 * * * /home/ubuntu/backup.sh
```

---

## 💰 Cost Information

### AWS Free Tier (12 months)
- **EC2 t2.micro:** FREE (750 hours/month)
- **Storage 30GB:** FREE
- **Data transfer:** FREE (within limits)
- **Total:** **$0/month**

### After Free Tier
- **EC2 t2.micro:** ~$10-15/month
- **Storage 30GB:** ~$1-2/month
- **Total:** ~$12-17/month

### Cost Optimization
✅ Use free tier while available  
✅ Right-size instances (t2.micro for blog)  
✅ Set billing alerts  
✅ Stop instance when not needed  
✅ Use Reserved Instances for long-term  

---

## ✅ Deployment Verification Checklist

**Local Development:**
- [ ] Backend runs on port 5000
- [ ] Frontend runs on port 3000
- [ ] Can create blog post
- [ ] Can view all posts
- [ ] Can edit posts
- [ ] Can delete posts
- [ ] No errors in console/terminal

**AWS Setup:**
- [ ] EC2 instance running
- [ ] SSH key permissions set (400)
- [ ] Security group configured
- [ ] Can SSH into EC2

**File Upload:**
- [ ] Project uploaded via SCP
- [ ] Files visible on EC2: `ls /home/ubuntu/Assignment-9`
- [ ] No upload errors

**Server Setup:**
- [ ] Node.js installed
- [ ] npm installed
- [ ] Nginx installed
- [ ] PM2 installed

**Backend:**
- [ ] Dependencies installed
- [ ] Backend running with PM2
- [ ] `curl http://localhost:5000/api/posts` returns posts
- [ ] No errors in PM2 logs

**Frontend:**
- [ ] Dependencies installed
- [ ] Build completed
- [ ] `build/` folder contains index.html
- [ ] Files exist: `ls /home/ubuntu/Assignment-9/frontend/build/`

**Nginx:**
- [ ] Configuration valid: `sudo nginx -t`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] Can access frontend: `curl http://localhost/`
- [ ] Can access API: `curl http://localhost/api/posts`

**Production Access:**
- [ ] Application accessible: `http://YOUR_EC2_PUBLIC_IP`
- [ ] CRUD operations work
- [ ] No 502 errors
- [ ] Database persists data

---

## 📚 Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [SCP Manual](https://man.openbsd.org/scp)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.io/docs/)
- [SQLite Database](https://www.sqlite.org/docs.html)

---

## 📞 Support

If you encounter issues:

1. **Check logs first:**
   ```bash
   pm2 logs blog-backend
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Test connectivity:**
   ```bash
   curl http://localhost:5000/api/posts
   curl http://localhost/api/posts
   ```

3. **Verify services:**
   ```bash
   pm2 list
   sudo systemctl status nginx
   ```

4. **Review this guide** - Most issues are covered above

---

**Last Updated:** May 2026  
**Tested on:** Ubuntu 22.04 LTS with Node.js 18.x  
**Deployment Method:** SCP (No GitHub)  
**Status:** Production Ready ✅

## 📡 API Endpoints Reference

Base URL: `http://localhost:5000/api` (local) or `https://blog-backend-xxx.onrender.com/api` (production)

| Method | Endpoint           | Description              | Request Body                                          |
|--------|--------------------|--------------------------|----------------------------------------------------|
| GET    | `/posts`           | Get all posts            | None                                               |
| GET    | `/posts/:id`       | Get single post by ID    | None                                               |
| POST   | `/posts`           | Create new post          | `{ title, author, content }`                      |
| PUT    | `/posts/:id`       | Update a post            | `{ title, author, content }`                      |
| DELETE | `/posts/:id`       | Delete a post            | None                                               |

**Example POST Request:**
```json
{
  "title": "My First Blog Post",
  "author": "John Doe",
  "content": "This is an amazing blog post about web development!"
}
```

---

## 🛠️ Tech Stack

| Component  | Technology          | Purpose                        |
|------------|-------------------|--------------------------------|
| **Frontend**   | React.js 19.2      | UI framework for user interface |
| **Backend**    | Express.js 5.2     | REST API server                |
| **Database**   | SQLite 3           | Lightweight database           |
| **Middleware** | CORS               | Cross-origin request handling  |
| **Runtime**    | Node.js 14+        | JavaScript runtime             |
| **Build Tool** | React Scripts 5.0  | Frontend build and dev server  |

---

## 📝 Features Implemented

✅ **Create** - Users can create new blog posts with title, author, and content  
✅ **Read** - Display all posts in reverse chronological order (newest first)  
✅ **Update** - Edit existing posts with edit functionality  
✅ **Delete** - Remove posts with confirmation dialog  
✅ **Database** - SQLite stores posts persistently  
✅ **API** - RESTful backend API with CRUD operations  
✅ **Frontend** - Responsive React interface with form and post list  
✅ **Timestamps** - Auto-generated creation timestamps for each post  
✅ **CORS** - Cross-origin support for frontend-backend communication  

---

## 🔍 Troubleshooting

### Backend Issues (Local & AWS)
| Issue | Solution |
|-------|----------|
| Port 5000 already in use | Kill: `lsof -ti:5000 \| xargs kill -9` OR use different port |
| Database errors | Delete `blog.db` and restart: `pm2 restart blog-backend` |
| CORS errors | Check `cors()` middleware is enabled in `index.js` |
| Module not found | Run `npm install` in backend folder |
| API returns 404 | Check routes in `index.js` and verify endpoints |

### Frontend Issues (Local & AWS)
| Issue | Solution |
|-------|----------|
| Port 3000 already in use (local) | Use: `PORT=3001 npm start` |
| Blank page | Check browser console (F12) for errors |
| API not connecting | Verify backend URL in `App.js` matches backend server |
| Build fails | Run `npm install` and clear cache: `npm cache clean --force` |

### AWS EC2 Specific Issues
| Issue | Solution |
|-------|----------|
| Can't connect via SSH | Check security group allows port 22 from your IP; verify .pem file permissions: `chmod 400 blog-app-key.pem` |
| Backend not accessible | Check PM2 status: `pm2 list` and `pm2 logs blog-backend` |
| Nginx returns 502 Bad Gateway | Verify backend is running: `curl http://localhost:5000/api/posts` |
| Static files not loading | Check path in Nginx config: `/home/ubuntu/blog-app/frontend/build` exists and contains `index.html` |
| CORS errors on production | Update API URL to `/api/posts` instead of `http://localhost:5000/api/posts` |
| Cannot access on public IP | Check security group inbound rules allow port 80 from 0.0.0.0/0 |
| PM2 process keeps crashing | Check logs: `pm2 logs blog-backend` and verify Node.js modules are installed |
| Database locked error | Restart backend: `pm2 restart blog-backend` or reboot instance: `sudo reboot` |
| Nginx config syntax error | Test config: `sudo nginx -t` before restarting |

### Network & Connectivity
| Issue | Solution |
|-------|----------|
| "Connection refused" | Backend might be down; check: `pm2 status` |
| Timeout errors | Security group might block traffic; check inbound rules |
| Domain not resolving | Wait for DNS propagation (5-30 min) or verify A record in domain provider |
| SSL certificate issues | Renew cert: `sudo certbot renew --force-renewal` |

---

## 📋 Quick AWS EC2 Deployment Checklist

- [ ] AWS account created with EC2 free tier eligible
- [ ] EC2 instance launched (Ubuntu 22.04 LTS, t2.micro)
- [ ] Security group created with proper inbound rules (SSH, HTTP, HTTPS)
- [ ] Key pair created and downloaded (.pem file)
- [ ] Connected to EC2 via SSH successfully
- [ ] System dependencies installed (Node.js, npm, Nginx, Git, PM2)
- [ ] GitHub repository cloned to EC2
- [ ] Backend installed and running with PM2
- [ ] Frontend built and ready
- [ ] Nginx configured with reverse proxy rules
- [ ] Nginx tested and restarted successfully
- [ ] Application accessible via public IP (http://YOUR_IP)
- [ ] CRUD operations tested in browser
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate installed (if using domain)
- [ ] Backup script configured
- [ ] Monitoring and logging verified

---

## ✅ Verification Checklist

### Local Development
- [ ] Backend starts without errors on `localhost:5000`
- [ ] Frontend starts without errors on `localhost:3000`
- [ ] Can create a new blog post
- [ ] Can view all posts
- [ ] Can edit existing posts
- [ ] Can delete posts with confirmation

### GitHub & Code Repository
- [ ] Code is pushed to GitHub
- [ ] Repository is public/accessible
- [ ] All files are committed

### AWS EC2 Deployment
- [ ] EC2 instance is running and accessible
- [ ] SSH connection works
- [ ] Node.js and npm are installed
- [ ] Backend is running with PM2
- [ ] Frontend is built and in `/home/ubuntu/blog-app/frontend/build`
- [ ] Nginx is configured and running
- [ ] Application is accessible via public IP
- [ ] CRUD operations work on production
- [ ] Logs show no errors
- [ ] Security group allows proper ports
- [ ] PM2 process monitored

---

## 📚 Additional Resources

**Express.js & Backend:**
- [Express.js Documentation](https://expressjs.com/)
- [better-sqlite3 Guide](https://github.com/WiseLibs/better-sqlite3)
- [CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)

**React & Frontend:**
- [React Documentation](https://react.dev/)
- [React Hooks Guide](https://react.dev/reference/react)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

**Database:**
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQL Tutorial](https://www.w3schools.com/sql/)

**Deployment:**
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.io/docs/usage/quick-start/)
- [Certbot (SSL/TLS)](https://certbot.eff.org/)
- [Render Deployment Guide](https://render.com/docs)

**DevOps & Best Practices:**
- [RESTful API Best Practices](https://www.restapitutorial.com/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

---

## 📝 Important Notes

### General
- The database file `blog.db` is auto-generated and should NOT be committed to GitHub
- Add `blog.db` to `.gitignore` to prevent accidental commits
- For production, consider using PostgreSQL instead of SQLite for better performance
- Implement proper authentication and authorization for real applications
- Add input validation and error handling for production use

### AWS EC2 Specific
- **Free Tier:** AWS EC2 t2.micro is free for 12 months (up to 750 hours/month)
- **After Free Tier:** You will be charged for the instance if you don't stop/terminate it
- **Backup:** Regularly backup your `blog.db` file; use the provided backup script
- **Static IP:** Consider using Elastic IP if you need a permanent public IP
- **Monitoring:** Use CloudWatch to monitor instance metrics
- **Auto-scaling:** For production, use Auto Scaling Groups and Load Balancers
- **Database:** Migrate to RDS (Relational Database Service) for production use
- **Logging:** Configure CloudWatch Logs for centralized logging
- **Security Groups:** Regularly review and update security group rules

### Performance Optimization
- Enable caching headers for static assets (already in Nginx config)
- Use CDN (CloudFront) for static content delivery
- Implement pagination for large datasets
- Add database indexing for faster queries
- Use PM2 clustering for multi-core performance

### Common Deployment Mistakes to Avoid
- ❌ Forgetting to update API URL before frontend deployment
- ❌ Not setting proper database permissions
- ❌ Using `localhost` URLs in production
- ❌ Leaving SSH open to 0.0.0.0/0 (security risk)
- ❌ Not having a backup strategy
- ❌ Ignoring server logs and monitoring
- ❌ Using default/weak credentials

---

## 📞 Support & Troubleshooting

If you encounter issues:

1. **Check logs first:**
   ```bash
   # Backend logs
   pm2 logs blog-backend
   
   # System logs
   sudo tail -f /var/log/syslog
   
   # Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Verify services are running:**
   ```bash
   pm2 list
   sudo systemctl status nginx
   ```

3. **Test connectivity:**
   ```bash
   # Local backend test
   curl http://localhost:5000/api/posts
   
   # Check Nginx
   sudo nginx -t
   ```

4. **Restart services:**
   ```bash
   pm2 restart blog-backend
   sudo systemctl restart nginx
   ```

---

## 🎯 Next Steps After Deployment

1. **Add More Features:**
   - User authentication (JWT)
   - Comments/replies system
   - Search functionality
   - Post categories/tags

2. **Improve Performance:**
   - Add caching layer (Redis)
   - Implement pagination
   - Optimize database queries
   - Use CDN for static assets

3. **Enhance Security:**
   - Add rate limiting
   - Implement CSRF protection
   - Input validation and sanitization
   - API key authentication

4. **Monitoring & Maintenance:**
   - Set up alerting
   - Automated backups
   - Performance monitoring
   - Regular security updates

5. **Scale Your Application:**
   - Load balancing
   - Database replication
   - Microservices architecture
   - Container orchestration (Docker/Kubernetes)
