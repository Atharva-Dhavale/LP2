# Student Record Management Application

A simple, easy-to-deploy web application built with Node.js, Express, and SQLite for managing student records. This project is specifically designed to be easily deployable on AWS (like EC2) for a college practical assignment.

## Features
- Add new student records (Name, Roll Number, Course, Grade)
- View all student records in a dynamic table
- Edit existing student records
- Delete student records
- Premium, responsive UI
- Zero-configuration SQLite database

## Running Locally

1. **Install Node.js**: Ensure you have Node.js installed on your machine.
2. **Install Dependencies**: Open your terminal in this directory and run:
   \`\`\`bash
   npm install
   \`\`\`
3. **Start the Server**: Run the following command:
   \`\`\`bash
   npm start
   \`\`\`
4. **Access the App**: Open your browser and go to \`http://localhost:3000\`

---

## Deploying to AWS (EC2)

Deploying this application to an AWS EC2 instance is very straightforward because it uses SQLite. You don't need to set up RDS or a separate database server. The database is simply a file (\`database.sqlite\`) created automatically in the project folder.

### Step 1: Launch an EC2 Instance
1. Log in to your AWS Management Console.
2. Go to **EC2** and click **Launch Instance**.
3. **Name**: Give it a name like "Student-App".
4. **OS Image (AMI)**: Select **Ubuntu Server** (e.g., Ubuntu 22.04 LTS or 24.04 LTS).
5. **Instance Type**: \`t2.micro\` (Free tier eligible) is perfect.
6. **Key Pair**: Create a new key pair or use an existing one to SSH into the server. Download the \`.pem\` file.
7. **Network Settings**:
   - Check **Allow SSH traffic** (Port 22) from anywhere (or your IP).
   - Check **Allow HTTP traffic** (Port 80) from the internet.
8. Click **Launch Instance**.

### Step 2: Connect to your EC2 Instance
Open your terminal (or Command Prompt/PowerShell) and use SSH to connect using your key pair:
\`\`\`bash
# Replace 'your-key.pem' and 'your-ec2-ip' with your actual file name and public IP.
# If on Mac/Linux, ensure your key has the right permissions first:
# chmod 400 your-key.pem
ssh -i "your-key.pem" ubuntu@your-ec2-ip
\`\`\`

### Step 3: Install Node.js on EC2
Once connected, run these commands to install Node.js and npm:
\`\`\`bash
# Update package list
sudo apt update

# Install Node.js from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

### Step 4: Transfer Your Project to EC2
You have two options:

**Option A (Using Git - Recommended):**
1. Push your project to a GitHub repository.
2. On your EC2 instance, run: \`git clone <your-repo-url>\`
3. \`cd\` into the cloned directory.

**Option B (Using SCP to copy directly from your computer):**
Run this from your *local computer's terminal*, not the EC2 terminal:
\`\`\`bash
# Zip the project folder (excluding node_modules)
zip -r student-app.zip . -x "node_modules/*"

# Copy the zip to EC2
scp -i "your-key.pem" student-app.zip ubuntu@your-ec2-ip:~

# Back on the EC2 terminal, unzip it:
sudo apt install unzip
unzip student-app.zip -d student-app
cd student-app
\`\`\`

### Step 5: Install Dependencies and Run
Inside your project folder on the EC2 instance:
\`\`\`bash
# Install the required packages
npm install

# Start the application
npm start
\`\`\`

*Note: Your app is now running on port 3000.*

### Step 6: Expose the App (Optional but Recommended)
By default, the app runs on port 3000. AWS security groups usually only open port 80 for web traffic.

**Quick fix (Port Forwarding):**
Route port 80 traffic to port 3000 using iptables on your EC2:
\`\`\`bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
\`\`\`
Now you can access your app simply by typing your EC2 instance's Public IPv4 address in your browser: \`http://your-ec2-ip\`

**(Alternative) Keep it running in the background:**
If you use \`npm start\`, it will stop when you close the terminal. Use PM2 to keep it running forever:
\`\`\`bash
sudo npm install -g pm2
pm2 start server.js --name "student-app"
pm2 save
pm2 startup
\`\`\`
