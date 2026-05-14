# Deploy Blog App on EC2

## 1. Launch EC2 Instance
- Go to AWS Console → EC2 → Launch Instance
- AMI: **Ubuntu 22.04 LTS**
- Instance type: **t2.micro**
- Create a key pair, download the `.pem` file
- Security Group: Allow **SSH (22)** and **Custom TCP (3000)** from Anywhere

---

## 2. Open Port 3000 in AWS Security Group

Follow these steps inside the AWS EC2 Console:

### Step 1 — Open EC2 Dashboard
- Search **EC2** in the AWS search bar
- Click to open the EC2 service

### Step 2 — Click "Instances"
- In the left sidebar, click **Instances**
- You will see your running instance listed

### Step 3 — Select Your Instance
- Click the **checkbox** beside your instance to select it

### Step 4 — Open the Security Tab
- In the bottom section that appears, click the **Security** tab

### Step 5 — Click the Security Group Link
- You will see a link like `sg-0a12345....`
- Click that **blue link** to open the Security Group

### Step 6 — Click "Edit Inbound Rules"
- On the Security Group page, click the **Edit inbound rules** button

### Step 7 — Add a New Rule
- Click **Add rule**
- Fill in the fields:

  | Field      | Value           |
  |------------|-----------------|
  | Type       | Custom TCP      |
  | Port range | 3000            |
  | Source     | Anywhere-IPv4   |

  > Source will automatically be set to `0.0.0.0/0`

### Step 8 — Save
- Click **Save rules**

---

## 3. Connect to EC2
```bash
chmod 400 awskey.pem
ssh -i awskey.pem ubuntu@13.232.146.252
```

---

## 4. Install Node.js
```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:
```bash
node -v
npm -v
```

---

## 5. Upload Project Files
Run this on your **local machine**:
```bash
scp -i awskey.pem -r ./blog-app ubuntu@13.232.146.252:~/
```

---

## 6. Install Dependencies
```bash
cd ~/blog-app
npm install
```

---

## 7. Install pm2 and Start the App
```bash
# Install pm2 globally
sudo npm install -g pm2

# Start the app
pm2 start server.js --name blog-app

# Auto-restart on reboot
pm2 startup
pm2 save
```

---

## 8. Access the App
Open in browser:
```
http://13.232.146.252:3000
```

---

## Troubleshooting

**Check if app is running:**
```bash
pm2 list
```

**View logs for errors:**
```bash
pm2 logs blog-app
```

**Confirm port 3000 is active:**
```bash
sudo ss -tlnp | grep 3000
```
You should see `0.0.0.0:3000` in the output. If not, the app is not running.

**Rebuild sqlite3 if app crashes:**
```bash
npm rebuild sqlite3
```
