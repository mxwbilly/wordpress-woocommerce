# WordPress + WooCommerce Framework

This directory contains an isolated WordPress + WooCommerce foundation. It is separate from the existing static site files in the repository root.

## Requirements

- Docker Desktop for local development
- Docker Compose v2
- Git

## Local Setup

Copy the local environment template:

```powershell
Copy-Item .env.example .env
```

Start WordPress, MariaDB, and phpMyAdmin:

```powershell
docker compose up -d
```

Open WordPress:

```text
http://localhost:8080
```

Open phpMyAdmin:

```text
http://localhost:8081
```

Use these database values during WordPress installation if prompted:

```text
Database name: wordpress
Database user: wordpress
Database password: change-me-local-password
Database host: db
Table prefix: wp_
```

## Install WooCommerce

After WordPress is running:

1. Log in to the WordPress admin dashboard.
2. Go to Plugins > Add New.
3. Search for WooCommerce.
4. Install and activate WooCommerce.
5. Complete the WooCommerce onboarding wizard.

## Custom Theme

The starter theme is in:

```text
wp-content/themes/custom-storefront
```

Activate it from Appearance > Themes after WordPress is installed.

## Local Commands

Stop containers:

```powershell
docker compose down
```

Stop containers and remove local Docker volumes:

```powershell
docker compose down -v
```

View logs:

```powershell
docker compose logs -f wordpress
```

Validate the local Compose file:

```powershell
docker compose --env-file .env.example config
```

## VPS Deployment

Prepare a VPS with Docker and Docker Compose v2 installed. Point your domain DNS `A` record to the VPS IP address before starting Caddy.

Copy the production template:

```bash
cp .env.prod.example .env.prod
```

Edit `.env.prod`:

```text
DOMAIN=your-domain.com
ACME_EMAIL=admin@your-domain.com
WORDPRESS_DB_PASSWORD=<strong password>
MYSQL_ROOT_PASSWORD=<strong root password>
```

Start production services:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

Validate the production Compose file:

```bash
docker compose --env-file .env.prod.example -f docker-compose.prod.yml config
```

## Backup

Back up the database:

```bash
docker compose exec db mariadb-dump -u root -p wordpress > backup.sql
```

Back up WordPress content:

```bash
tar -czf wp-content-backup.tar.gz wp-content
```

## Restore

Restore database backup:

```bash
docker compose exec -T db mariadb -u root -p wordpress < backup.sql
```

Restore content backup:

```bash
tar -xzf wp-content-backup.tar.gz
```

## Notes

- Do not commit `.env` or `.env.prod`.
- Keep phpMyAdmin for local development only.
- Put custom business logic in a dedicated plugin under `wp-content/plugins/` when it grows beyond theme presentation concerns.
