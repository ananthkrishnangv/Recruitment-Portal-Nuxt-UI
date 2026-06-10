#!/bin/bash
# ═══════════════════════════════════════════════════
# CSIR-SERC Recruitment Portal — Database Init Script
# Runs automatically on first PostgreSQL container start
# ═══════════════════════════════════════════════════

set -e

echo "══ CSIR-SERC Database Initialization ══"

# Enable required extensions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable full-text search extensions
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION IF NOT EXISTS unaccent;

    -- Confirm extensions
    SELECT extname, extversion FROM pg_extension WHERE extname IN ('pg_trgm', 'unaccent');

    -- Log initialization
    DO \$\$
    BEGIN
        RAISE NOTICE 'CSIR-SERC Database initialized with pg_trgm and unaccent extensions at %', now();
    END
    \$\$;
EOSQL

echo "══ Database extensions installed successfully ══"
