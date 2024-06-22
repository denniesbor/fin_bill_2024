#!/bin/bash
set -e

# Check if the user already exists and grant superuser privileges
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (
            SELECT
            FROM   pg_catalog.pg_roles
            WHERE  rolname = 'django') THEN
            CREATE USER django WITH PASSWORD 'mydjangopassword';
        END IF;
        ALTER USER django WITH SUPERUSER;
    END
    \$\$;
EOSQL

# Check if the database already exists and create it if not
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (
            SELECT FROM pg_database WHERE datname = 'django_postgis') THEN
            CREATE DATABASE django_postgis;
            GRANT ALL PRIVILEGES ON DATABASE django_postgis TO django;
        END IF;
    END
    \$\$;
EOSQL

# Create the PostGIS extension in the database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "django_postgis" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS postgis;
EOSQL

# Optionally revoke superuser privileges from the django user
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    ALTER USER django WITH NOSUPERUSER;
EOSQL
