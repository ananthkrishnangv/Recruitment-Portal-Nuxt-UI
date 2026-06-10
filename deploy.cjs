const { NodeSSH } = require('node-ssh');
const fs = require('fs');

const ssh = new NodeSSH();

async function deploy() {
  console.log("Connecting to remote server...");
  try {
    await ssh.connect({
      host: '10.10.200.53',
      username: 'root',
      password: 'Dda5a3d52a#4815'
    });
    console.log("Connected successfully.");

    await ssh.execCommand('mkdir -p /root/recruitment-portal');
    
    console.log("Transferring deploy.tar.gz...");
    await ssh.putFile('./deploy.tar.gz', '/root/recruitment-portal/deploy.tar.gz');
    console.log("File transferred.");

    const script = `
      cd /root/recruitment-portal
      # Clean old files to prevent context contamination
      rm -rf .next public prisma package.json Dockerfile deploy.zip .dockerignore
      # Extract
      echo "Extracting..."
      tar -xzf deploy.tar.gz
      
      echo "Writing Production Dockerfile..."
      cat << 'EOF' > Dockerfile
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Add non-root user
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs

COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY package.json ./
RUN rm -rf node_modules
RUN npm install --omit=dev
RUN npm install tsx --no-save
# Set permissions
RUN mkdir -p storage/uploads && chown -R nextjs:nodejs storage && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD npx prisma generate && npx prisma db push --accept-data-loss && npx tsx prisma/seed.ts && node server.js
EOF
      
      echo "Building container image..."
      podman build -t recruitment-portal .
      
      echo "Stopping old container..."
      podman stop recruitment-portal-app || true
      podman rm recruitment-portal-app || true
      
      echo "Stopping PostgreSQL database container..."
      podman stop recruitment-portal-db || true
      podman rm recruitment-portal-db || true
      podman volume rm recruitment-db-data || true
      
      # Generate a random password for the database
      DB_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
      
      podman run -d \\
        --name recruitment-portal-db \\
        --network mcvlan1 \\
        --ip 10.30.0.100 \\
        -e POSTGRES_USER=sercadmin \\
        -e POSTGRES_PASSWORD=$DB_PASSWORD \\
        -e POSTGRES_DB=recruitment_portal \\
        -v recruitment-db-data:/var/lib/postgresql/data \\
        --restart unless-stopped \\
        postgres:15-alpine

      echo "Waiting for database to initialize..."
      sleep 10
      
      echo "Database initialized."
      echo "Starting new application container..."
      # Use macvlan: mcvlan1 with IP 10.30.0.99
      podman run -d \\
        --name recruitment-portal-app \\
        --network mcvlan1 \\
        --ip 10.30.0.99 \\
        -p 3000:3000 \\
        -e DATABASE_URL="postgresql://sercadmin:$DB_PASSWORD@10.30.0.100:5432/recruitment_portal" \\
        --restart unless-stopped \\
        recruitment-portal
        
      echo "Deployment successful."
      echo "DATABASE_URL=postgresql://sercadmin:$DB_PASSWORD@10.30.0.100:5432/recruitment_portal" > /root/recruitment-portal/db_credentials.txt
    `;

    console.log("Executing remote script...");
    const result = await ssh.execCommand(script);
    console.log("STDOUT:", result.stdout);
    console.log("STDERR:", result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error("Error during deployment:", err);
    ssh.dispose();
  }
}

deploy();
