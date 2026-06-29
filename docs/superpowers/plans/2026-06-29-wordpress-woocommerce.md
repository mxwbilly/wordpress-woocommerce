# WordPress WooCommerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an isolated WordPress + WooCommerce Docker framework in `wordpress-woocommerce/` and push it to a dedicated remote branch.

**Architecture:** Keep the framework in a subdirectory so the existing static site remains separate. Use Docker Compose for local WordPress, MariaDB, and phpMyAdmin, with a production Compose template that adds Caddy for VPS HTTPS reverse proxy.

**Tech Stack:** WordPress Docker image, MariaDB, phpMyAdmin, Caddy, Docker Compose, Git.

---

### Task 1: Branch and Documentation

**Files:**
- Create: `docs/superpowers/specs/2026-06-29-wordpress-woocommerce-design.md`
- Create: `docs/superpowers/plans/2026-06-29-wordpress-woocommerce.md`

- [ ] **Step 1: Create the branch**

Run: `git switch -c codex/wordpress-woocommerce`

Expected: Git switches to a new branch named `codex/wordpress-woocommerce`.

- [ ] **Step 2: Write the design spec**

Create `docs/superpowers/specs/2026-06-29-wordpress-woocommerce-design.md` with the approved architecture, component list, data flow, error handling, and verification requirements.

- [ ] **Step 3: Write this implementation plan**

Create `docs/superpowers/plans/2026-06-29-wordpress-woocommerce.md` with exact files, commands, and verification steps.

### Task 2: Local Docker Framework

**Files:**
- Create: `wordpress-woocommerce/docker-compose.yml`
- Create: `wordpress-woocommerce/.env.example`
- Create: `wordpress-woocommerce/uploads.ini`
- Create: `wordpress-woocommerce/.gitignore`

- [ ] **Step 1: Add the local Compose stack**

Create `wordpress-woocommerce/docker-compose.yml` with `wordpress`, `db`, and `phpmyadmin` services. Use named volumes for WordPress and database persistence. Mount `wp-content` and `uploads.ini`.

- [ ] **Step 2: Add local environment template**

Create `wordpress-woocommerce/.env.example` with local ports, database name, user, and password placeholders.

- [ ] **Step 3: Add PHP upload configuration**

Create `wordpress-woocommerce/uploads.ini` with upload and execution limits suitable for WooCommerce media imports.

- [ ] **Step 4: Add ignore rules**

Create `wordpress-woocommerce/.gitignore` to ignore real `.env` files and WordPress runtime uploads/cache.

### Task 3: Production VPS Template

**Files:**
- Create: `wordpress-woocommerce/docker-compose.prod.yml`
- Create: `wordpress-woocommerce/.env.prod.example`
- Create: `wordpress-woocommerce/Caddyfile`

- [ ] **Step 1: Add production Compose stack**

Create `wordpress-woocommerce/docker-compose.prod.yml` with `wordpress`, `db`, and `caddy` services. Do not expose phpMyAdmin in production.

- [ ] **Step 2: Add production environment template**

Create `wordpress-woocommerce/.env.prod.example` with domain, email, database, and WordPress URL placeholders.

- [ ] **Step 3: Add Caddy reverse proxy config**

Create `wordpress-woocommerce/Caddyfile` so Caddy proxies HTTPS traffic to the WordPress container.

### Task 4: Theme Scaffold and README

**Files:**
- Create: `wordpress-woocommerce/wp-content/themes/custom-storefront/style.css`
- Create: `wordpress-woocommerce/wp-content/themes/custom-storefront/functions.php`
- Create: `wordpress-woocommerce/README.md`

- [ ] **Step 1: Add minimal custom theme metadata**

Create `style.css` with WordPress theme headers and restrained default WooCommerce-ready styling.

- [ ] **Step 2: Add theme setup**

Create `functions.php` to enable title tag, thumbnails, menus, WooCommerce support, and enqueue the stylesheet.

- [ ] **Step 3: Add operating documentation**

Create `README.md` with local startup, WordPress setup, WooCommerce installation, VPS deployment, backup, restore, and update commands.

### Task 5: Verification and Publish

**Files:**
- Modify: Git index only.

- [ ] **Step 1: Validate local Compose config**

Run: `docker compose --env-file .env.example config` from `wordpress-woocommerce/`.

Expected: Exit code 0 and rendered services for `wordpress`, `db`, and `phpmyadmin`.

- [ ] **Step 2: Validate production Compose config**

Run: `docker compose --env-file .env.prod.example -f docker-compose.prod.yml config` from `wordpress-woocommerce/`.

Expected: Exit code 0 and rendered services for `wordpress`, `db`, and `caddy`.

- [ ] **Step 3: Confirm Git staging excludes static-site deletions**

Run: `git status --short`.

Expected: New `docs/` and `wordpress-woocommerce/` files appear as untracked or staged, while existing static-site deletions remain unstaged.

- [ ] **Step 4: Commit only framework files**

Run: `git add docs/superpowers/specs/2026-06-29-wordpress-woocommerce-design.md docs/superpowers/plans/2026-06-29-wordpress-woocommerce.md wordpress-woocommerce`

Run: `git commit -m "feat: add WordPress WooCommerce Docker framework"`

Expected: Commit succeeds without staging deleted static-site files.

- [ ] **Step 5: Push branch**

Run: `git push -u origin codex/wordpress-woocommerce`

Expected: Remote branch `codex/wordpress-woocommerce` is created on `origin`.
