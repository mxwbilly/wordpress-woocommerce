# WordPress WooCommerce Framework Design

## Goal

Build a WordPress + WooCommerce foundation separated from the existing static site, inside `wordpress-woocommerce/`, and publish it on a dedicated Git branch.

## Scope

The framework provides a local Docker development environment and a production-oriented VPS Docker template. It does not migrate existing static pages, products, orders, payment gateways, shipping rules, or final theme design.

## Architecture

The project lives in `wordpress-woocommerce/` so it can coexist with the current static site repository. Local development runs WordPress, MariaDB, and phpMyAdmin through Docker Compose. Production deployment uses a separate Compose file with WordPress, MariaDB, and Caddy for HTTPS reverse proxy.

Persistent application state is stored in Docker volumes for WordPress files and database data. Project-owned customizations live under `wp-content/themes/custom-storefront/` and `wp-content/plugins/`.

## Components

- `docker-compose.yml`: Local WordPress, MariaDB, and phpMyAdmin environment.
- `docker-compose.prod.yml`: VPS-oriented WordPress, MariaDB, and Caddy environment.
- `Caddyfile`: Production reverse proxy and HTTPS configuration.
- `.env.example`: Local configuration template.
- `.env.prod.example`: Production configuration template.
- `uploads.ini`: PHP upload and execution limits.
- `wp-content/themes/custom-storefront/`: Minimal child-ready custom theme scaffold.
- `README.md`: Setup, startup, WooCommerce installation, deployment, and backup notes.

## Data Flow

Browser traffic reaches WordPress through Apache locally and Caddy in production. WordPress connects to MariaDB using environment variables from the Compose stack. WordPress content, plugins, themes, uploads, and database files persist in named Docker volumes.

## Error Handling

Compose health checks verify database availability before WordPress starts. Environment templates separate secrets from committed files. Production notes keep phpMyAdmin out of the public stack by default.

## Verification

Validate the Compose syntax with `docker compose config` for both local and production files. Verify Git only stages the new framework and documentation files, not the existing static-site deletions.
