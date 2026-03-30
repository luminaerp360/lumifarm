# LumiFarm — DigitalOcean Deployment Guide

**Server IP:** 64.23.162.220  
**Backend domain:** https://farmapi.lumina360.tech  
**Frontend domain:** https://farm.lumina360.tech  
**GitHub repo:** git@github.com:luminaerp360/lumifarm.git  
**Deploy path on server:** /opt/lumifarm

---

## PART 1 — First-time Server Setup

SSH into your droplet first:

```
ssh root@64.23.162.220
```

---

### STEP 1 — Update the server

```bash
apt-get update && apt-get upgrade -y
```

---

### STEP 2 — Install Docker

```bash
curl -fsSL https://get.docker.com | sh
```

Verify it installed:

```bash
docker --version
docker compose version
```

---

### STEP 3 — Install Nginx, Certbot, Git, Curl

```bash
apt-get install -y nginx certbot python3-certbot-nginx curl git
```

---

### STEP 4 — Configure Firewall

**Important:** Only run these — do NOT reset the firewall as other projects are already deployed.

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw status
```

---

### STEP 5 — Generate GitHub Deploy Key

```bash
ssh-keygen -t ed25519 -f /root/.ssh/lumifarm_deploy -N "" -C "lumifarm-deploy-key"
```

Print the public key (you will copy this to GitHub):

```bash
cat /root/.ssh/lumifarm_deploy.pub
```

You will see something like:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... lumifarm-deploy-key
```

**Copy this entire line.**

---

### STEP 6 — Configure SSH to use the deploy key

```bash
cat >> /root/.ssh/config << 'EOF'
Host github-lumifarm
    HostName github.com
    User git
    IdentityFile /root/.ssh/lumifarm_deploy
    StrictHostKeyChecking no
EOF
```

```bash
chmod 600 /root/.ssh/config
```

---

### STEP 7 — Add the deploy key to GitHub (do this in your browser)

1. Open this URL in your browser (log in as luminaerp360@gmail.com):
   ```
   https://github.com/luminaerp360/lumifarm/settings/keys
   ```
2. Click **"Add deploy key"**
3. Title: `lumifarm-digitalocean-droplet`
4. Key: paste the public key you copied in Step 5
5. Do NOT tick "Allow write access"
6. Click **"Add key"**

---

### STEP 8 — Test the GitHub connection from the server

```bash
ssh -T git@github.com -i /root/.ssh/lumifarm_deploy
```

Expected response:

```
Hi luminaerp360/lumifarm! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### STEP 9 — Clone the repository

```bash
cd /opt
git clone git@github-lumifarm:luminaerp360/lumifarm.git lumifarm
```

Verify it cloned:

```bash
ls /opt/lumifarm
```

You should see: `lumifarm-backend/  lumifarm-frontend/  deploy/`

---

### STEP 10 — Verify git remote is correct

```bash
cd /opt/lumifarm
git remote -v
```

Expected output:

```
origin  git@github-lumifarm:luminaerp360/lumifarm.git (fetch)
origin  git@github-lumifarm:luminaerp360/lumifarm.git (push)
```

If it shows `git@github.com:...` instead, fix it with:

```bash
git remote set-url origin git@github-lumifarm:luminaerp360/lumifarm.git
```

---

### STEP 11 — Create the backend .env file

```bash
nano /opt/lumifarm/lumifarm-backend/.env
```

Paste and fill in your real values:

```
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/lumifarm?retryWrites=true&w=majority

# JWT Secret (use a long random string — minimum 64 characters)
JWT_SECRET=change-this-to-a-long-random-secret-at-least-64-characters-long

# Google OAuth (leave blank if not using Google login)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://farmapi.lumina360.tech/api/auth/google/callback

# SMTP Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Frontend URL
FRONTEND_URL=https://farm.lumina360.tech

# Port (do not change this)
PORT=3400
```

Save and exit: press `Ctrl+X`, then `Y`, then `Enter`

---

### STEP 12 — Create the Docker network

```bash
docker network inspect lumifarm-net >/dev/null 2>&1 || docker network create lumifarm-net
```

---

### STEP 13 — Get SSL certificates

Run these one at a time (nginx must be running — it is installed from Step 3):

```bash
certbot --nginx --non-interactive --agree-tos \
  --email luminaerp360@gmail.com \
  -d farmapi.lumina360.tech
```

```bash
certbot --nginx --non-interactive --agree-tos \
  --email luminaerp360@gmail.com \
  -d farm.lumina360.tech
```

---

### STEP 14 — Install Nginx config files

Copy the upstream config:

```bash
cp /opt/lumifarm/deploy/nginx/lumifarm-upstreams.conf /etc/nginx/conf.d/lumifarm-upstreams.conf
```

Copy and enable the site configs:

```bash
cp /opt/lumifarm/deploy/nginx/farmapi.lumina360.tech /etc/nginx/sites-available/farmapi.lumina360.tech
cp /opt/lumifarm/deploy/nginx/farm.lumina360.tech    /etc/nginx/sites-available/farm.lumina360.tech
```

```bash
ln -sf /etc/nginx/sites-available/farmapi.lumina360.tech /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/farm.lumina360.tech    /etc/nginx/sites-enabled/
```

Remove the default nginx site:

```bash
rm -f /etc/nginx/sites-enabled/default
```

Test the config and reload:

```bash
nginx -t
nginx -s reload
```

Expected output from `nginx -t`:

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

### STEP 15 — Run the first deployment

```bash
cd /opt/lumifarm
bash deploy/deploy.sh both
```

This will:

1. Pull the latest code from GitHub
2. Build the backend Docker image (blue stack)
3. Build the frontend Docker image (blue stack)
4. Run health checks on both containers
5. Switch Nginx to point to the new containers
6. Print "Deploy finished successfully"

---

### STEP 16 — Verify everything is working

Check backend API:

```bash
curl -I https://farmapi.lumina360.tech/docs
```

Check frontend:

```bash
curl -I https://farm.lumina360.tech
```

Both should return `HTTP/2 200`.

Check running containers:

```bash
docker ps
```

You should see `lumifarm-backend-blue` and `lumifarm-frontend-blue` running.

---

## PART 2 — Ongoing Deployment (every time you push code)

### Deploy everything (most common)

```bash
ssh root@64.23.162.220
cd /opt/lumifarm
bash deploy/deploy.sh
```

### Deploy backend only

```bash
ssh root@64.23.162.220
cd /opt/lumifarm
bash deploy/deploy.sh backend
```

### Deploy frontend only

```bash
ssh root@64.23.162.220
cd /opt/lumifarm
bash deploy/deploy.sh frontend
```

---

## PART 3 — Rollback Commands

If something goes wrong after a deployment, rollback to the previous version instantly:

### Rollback everything

```bash
bash deploy/deploy.sh rollback
```

### Rollback backend only

```bash
bash deploy/deploy.sh rollback backend
```

### Rollback frontend only

```bash
bash deploy/deploy.sh rollback frontend
```

---

## PART 4 — Useful Maintenance Commands

### View running containers

```bash
docker ps
```

### View backend logs (live)

```bash
docker logs -f lumifarm-backend-blue
# or if green is active:
docker logs -f lumifarm-backend-green
```

### View frontend logs

```bash
docker logs -f lumifarm-frontend-blue
```

### Restart a container without deploying

```bash
docker restart lumifarm-backend-blue
```

### Check Nginx status

```bash
systemctl status nginx
```

### Reload Nginx config

```bash
nginx -t && nginx -s reload
```

### Renew SSL certificates (auto-renewal is set up by certbot, but manual if needed)

```bash
certbot renew --nginx
```

### Check disk space (you have 50GB total)

```bash
df -h
```

### Check memory usage (you have 2GB RAM)

```bash
free -h
```

### Clean up old Docker images to free space

```bash
docker image prune -f
```

---

## PART 5 — How Blue/Green Works

```
First deploy:  → builds BLUE  → nginx points to BLUE  (port 3401/4001)
Second deploy: → builds GREEN → health check → nginx switches to GREEN (port 3402/4002) → stops BLUE
Third deploy:  → rebuilds BLUE → health check → nginx switches to BLUE → stops GREEN
... and so on
```

- If a health check fails → the old container keeps running, new one is stopped
- Old containers are `stopped` (not deleted) so `rollback` can restart them instantly
- Nginx switch is atomic (< 1 second) — zero downtime

---

## PART 6 — File Locations on Server

| What                | Path                                                          |
| ------------------- | ------------------------------------------------------------- |
| Project root        | `/opt/lumifarm`                                               |
| Backend env file    | `/opt/lumifarm/lumifarm-backend/.env`                         |
| Deploy script       | `/opt/lumifarm/deploy/deploy.sh`                              |
| Nginx upstream conf | `/etc/nginx/conf.d/lumifarm-upstreams.conf`                   |
| Nginx API site      | `/etc/nginx/sites-enabled/farmapi.lumina360.tech`             |
| Nginx Frontend site | `/etc/nginx/sites-enabled/farm.lumina360.tech`                |
| SSL certificates    | `/etc/letsencrypt/live/`                                      |
| Active stack state  | `/opt/lumifarm/deploy/.active-backend` and `.active-frontend` |
