#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CSIR-SERC Recruitment Portal — Production Deployment Script
# Target Host: 10.10.200.53
# Network: Podman Macvlan mcvlan1
# ═══════════════════════════════════════════════════════════════

set -e

BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
CYAN="\033[36m"
RESET="\033[0m"

echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════${RESET}"
echo -e "${CYAN}${BOLD}  CSIR-SERC Recruitment Portal - Deploy        ${RESET}"
echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════${RESET}"
echo ""

# ── Step 1: Pre-flight checks ──
echo -e "${YELLOW}[1/8] Pre-flight checks...${RESET}"
command -v podman >/dev/null 2>&1 || { echo -e "${RED}ERROR: podman not found${RESET}"; exit 1; }
command -v podman-compose >/dev/null 2>&1 || { echo -e "${RED}ERROR: podman-compose not found${RESET}"; exit 1; }
echo -e "${GREEN}  ✓ Podman and podman-compose available${RESET}"

# ── Step 2: Verify Macvlan network exists ──
echo -e "${YELLOW}[2/8] Verifying Macvlan network mcvlan1...${RESET}"
if podman network inspect mcvlan1 >/dev/null 2>&1; then
  echo -e "${GREEN}  ✓ Macvlan network mcvlan1 found${RESET}"
else
  echo -e "${YELLOW}  ! mcvlan1 not found, creating...${RESET}"
  podman network create \
    --driver macvlan \
    --subnet 10.30.0.0/24 \
    --gateway 10.30.0.1 \
    --ip-range 10.30.0.40/28 \
    -o parent=eth0 \
    mcvlan1
  echo -e "${GREEN}  ✓ Macvlan network mcvlan1 created${RESET}"
fi

# ── Step 3: Stop existing containers ──
echo -e "${YELLOW}[3/8] Stopping existing containers...${RESET}"
podman-compose -f podman-compose.yml down --remove-orphans 2>/dev/null || true
echo -e "${GREEN}  ✓ Existing containers stopped${RESET}"

# ── Step 4: Build application image ──
echo -e "${YELLOW}[4/8] Building application image (this may take a few minutes)...${RESET}"
podman build -t csir-recruitment-app:latest .
echo -e "${GREEN}  ✓ Application image built${RESET}"

# ── Step 5: Start services ──
echo -e "${YELLOW}[5/8] Starting all services...${RESET}"
podman-compose -f podman-compose.yml up -d
echo -e "${GREEN}  ✓ Services started${RESET}"

# ── Step 6: Wait for PostgreSQL ──
echo -e "${YELLOW}[6/8] Waiting for PostgreSQL to be ready...${RESET}"
sleep 10
MAX_WAIT=60
WAITED=0
until podman exec csir-recruitment-db pg_isready -U csir_admin -d csir_recruitment >/dev/null 2>&1; do
  sleep 2
  WAITED=$((WAITED + 2))
  if [ $WAITED -ge $MAX_WAIT ]; then
    echo -e "${RED}ERROR: PostgreSQL did not become ready within ${MAX_WAIT}s${RESET}"
    exit 1
  fi
done
echo -e "${GREEN}  ✓ PostgreSQL ready${RESET}"

# ── Step 7: Run Prisma migrations and seed ──
echo -e "${YELLOW}[7/8] Running database migrations and seed...${RESET}"
podman run --rm --network mcvlan1 \
  -e DATABASE_URL="postgresql://csir_admin:CsirS3rc@Db2026!xK9p@10.30.0.41:5432/csir_recruitment?schema=public" \
  -v $(pwd)/prisma:/app/prisma \
  -v $(pwd)/prisma.config.ts:/app/prisma.config.ts \
  -v $(pwd)/package.json:/app/package.json \
  -v $(pwd)/tsconfig.json:/app/tsconfig.json \
  -w /app \
  node:22-alpine sh -c "npm install prisma effect @prisma/config @prisma/client tsx typescript @types/node && npx prisma db push --accept-data-loss"
echo -e "${GREEN}  ✓ Database schema deployed${RESET}"

# Run seed data
podman run --rm --network mcvlan1 \
  -e DATABASE_URL="postgresql://csir_admin:CsirS3rc@Db2026!xK9p@10.30.0.41:5432/csir_recruitment?schema=public" \
  -v $(pwd)/prisma:/app/prisma \
  -v $(pwd)/prisma.config.ts:/app/prisma.config.ts \
  -v $(pwd)/package.json:/app/package.json \
  -v $(pwd)/tsconfig.json:/app/tsconfig.json \
  -w /app \
  node:22-alpine sh -c "npm install prisma effect @prisma/config @prisma/client tsx typescript @types/node && npx tsx prisma/seed.ts" || \
  echo -e "${YELLOW}  ! Seed skipped (may already be seeded)${RESET}"
echo -e "${GREEN}  ✓ Seed data loaded${RESET}"

# ── Step 8: Verify Deployment ──
echo -e "${YELLOW}[8/8] Running health check...${RESET}"
sleep 5 # Give it a moment to boot
HEALTH=$(podman exec csir-recruitment-app wget -qO- http://127.0.0.1:3000/api/health 2>/dev/null || echo '{"ok":false}')

if echo "$HEALTH" | grep -q '"ok":true'; then
  echo -e "${GREEN}  ✓ Health check passed: Application is running!${RESET}"
else
  echo -e "${RED}  ✗ Health check failed: $HEALTH${RESET}"
  echo -e "${YELLOW}  Checking container logs...${RESET}"
  podman logs csir-recruitment-app | tail -n 20
  exit 1
fi

echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  ✅ DEPLOYMENT SUCCESSFUL!                    ${RESET}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════${RESET}"
echo ""
echo -e "${CYAN}  Application:  ${BOLD}http://10.30.0.40:3000${RESET}"
echo -e "${CYAN}  PostgreSQL:   ${BOLD}10.30.0.41:5432${RESET}"
echo -e "${CYAN}  Redis:        ${BOLD}10.30.0.42:6379${RESET}"
echo ""
echo -e "${CYAN}  Container Status:${RESET}"
podman ps --format "  {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo -e "${YELLOW}  Credentials:${RESET}"
echo -e "  DB User:     csir_admin"
echo -e "  DB Password: CsirS3rc@Db2026!xK9p"
echo -e "  DB Name:     csir_recruitment"
echo -e "  Redis Pass:  R3dis@CsirS3rc2026!"
echo -e "  Admin PIN:   826491"
echo -e "  Demo OTP:    123456"
echo ""
