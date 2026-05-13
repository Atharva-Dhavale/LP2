# Assignment 8 – Secure File Sharing Between Cloud Instances (AWS)

> **Goal:** Launch 2 EC2 instances, transfer a file securely using SCP, and set file permissions.

---

## STEP 1 — Launch VM1

1. Go to **AWS Console → EC2 → Launch Instance**
2. Fill in:
   - Name: `VM1`
   - AMI: `Ubuntu 22.04 LTS` (Free Tier)
   - Instance Type: `t2.micro`
   - Key Pair: **Create new** → name `mykey` → Download `mykey.pem`
   - Network: leave default (uses Default VPC)
   - Security Group: **Allow SSH (port 22) from Anywhere**
3. Click **Launch Instance**

---

## STEP 2 — Launch VM2

1. **EC2 → Launch Instance** again
2. Fill in:
   - Name: `VM2`
   - AMI: `Ubuntu 22.04 LTS`
   - Instance Type: `t2.micro`
   - Key Pair: **Select existing** → `mykey`
   - Same default security group (SSH allowed)
3. Click **Launch Instance**

---

## STEP 3 — Note the IPs

From EC2 Dashboard → copy:
- `VM1 Public IP`
- `VM2 Public IP`

---

## STEP 4 — Connect to VM1

Open terminal on your local machine:

```bash
chmod 400 mykey.pem
ssh -i mykey.pem ubuntu@<VM1_PUBLIC_IP>
```

---

## STEP 5 — Create a File on VM1

```bash
echo "Hello from VM1 - Secure File" > secret.txt
cat secret.txt
```

---

## STEP 6 — Copy Key to VM1 (needed to SCP from VM1 to VM2)

Open a **new terminal** on your local machine:

```bash
scp -i mykey.pem mykey.pem ubuntu@<VM1_PUBLIC_IP>:~/
```

---

## STEP 7 — Transfer File from VM1 → VM2

Back in the **VM1 terminal**:

```bash
chmod 400 ~/mykey.pem
scp -i ~/mykey.pem ~/secret.txt ubuntu@[IP_ADDRESS]:~/secret1.txt
```

---

## STEP 8 — Verify on VM2

Open a **new terminal** on your local machine:

```bash
ssh -i mykey.pem ubuntu@<VM2_PUBLIC_IP>
ls
cat secret.txt
```

---

## STEP 9 — Set File Permissions

```bash
# On VM2 terminal
chmod 600 secret.txt
ls -l secret.txt
# Output: -rw------- (only owner can read/write)
```

---

## Done! ✅

| Step | What happened |
|------|--------------|
| 1–2 | Launched 2 EC2 instances with same key |
| 4–5 | Created a file on VM1 |
| 6–7 | Transferred file securely using SCP |
| 8–9 | Verified file on VM2 and set permissions |

---

## Quick Viva Answers

| Q | A |
|---|---|
| What is SCP? | Secure Copy Protocol — transfers files over SSH |
| Why same key pair? | Both VMs need the same key for SSH authentication |
| What does `chmod 600` do? | Only the owner can read/write; others have no access |
| What is a Security Group? | AWS firewall that controls inbound/outbound traffic |
| Why port 22? | SSH (and SCP) uses port 22 for secure communication |
