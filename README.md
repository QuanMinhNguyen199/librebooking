
# Nexa Resource — LibreBooking with a modern Next.js UI

This fork keeps LibreBooking as the booking engine and adds a new company-facing
frontend in [`frontend/`](./frontend). The PHP application is intentionally kept:
it owns authentication, resources, schedules, permissions, availability, and
reservations. The Next.js application replaces the user experience, not the
LibreBooking backend.

## Run the UI demo

The demo uses local sample data, so PHP, Apache, and MySQL are not required.

### Requirements

- Node.js 20 or newer
- npm

### Start

```bash
git clone https://github.com/QuanMinhNguyen199/librebooking.git
cd librebooking
git switch feature/company-ui-demo
cd frontend
npm install
npm run dev
```

Open <http://localhost:3000>.

The demo includes a responsive dashboard for physical resources, bookings,
costs, Claude usage, and MCP connection status. Data is mocked for presentation;
it is not yet read from a live LibreBooking installation.

### Validate the frontend

```bash
cd frontend
npm run lint
npm run build
```

## Project architecture

```text
Next.js UI -> server-side adapter -> LibreBooking REST API -> MySQL/MariaDB
AI client  -> MCP server ---------^
```

- `frontend/`: new Next.js interface and LibreBooking TypeScript adapter.
- Existing PHP directories: LibreBooking backend and REST API.
- `WebServices/`: API implementation used by the new UI and future MCP server.
- `database_schema/`: LibreBooking schema and upgrade scripts.

The browser must not access the LibreBooking database or retain privileged API
credentials. When the live integration is enabled, the server-side adapter will
own LibreBooking sessions and enforce the current user's permissions.

## Connect a LibreBooking instance

Copy the example environment file:

```bash
cd frontend
cp .env.example .env.local
```

Then set `LIBREBOOKING_BASE_URL`. The REST API must also be enabled in the
LibreBooking configuration. The initial client is located at
[`frontend/src/lib/librebooking-client.ts`](./frontend/src/lib/librebooking-client.ts).

## Upstream LibreBooking documentation

The original LibreBooking documentation is preserved below for backend setup,
deployment, contribution, and license details.

---

# LibreBooking

[![GitHub issues](https://img.shields.io/github/issues/LibreBooking/librebooking)](https://github.com/LibreBooking/librebooking/issues)
[![Last commit](https://img.shields.io/github/last-commit/LibreBooking/librebooking)](https://github.com/LibreBooking/librebooking/commits)
[![GitHub release](https://img.shields.io/github/v/release/LibreBooking/librebooking?include_prereleases)](https://github.com/LibreBooking/librebooking/releases)
[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://github.com/LibreBooking/librebooking/blob/develop/LICENSE.md)

[![GitHub stars](https://img.shields.io/github/stars/LibreBooking/librebooking?style=flat)](https://github.com/LibreBooking/librebooking/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/LibreBooking/librebooking?style=flat)](https://github.com/LibreBooking/librebooking/network)

[![PHP](https://img.shields.io/badge/PHP-8.2%2B-brightgreen.svg?logo=php)](https://www.php.net/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%3E%3D8.0%20%7C%20MariaDB%20%3E%3D10.6-blue.svg?logo=mysql)](https://www.mysql.com/)
![Platform](https://img.shields.io/badge/Platform-Web-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-green)

[![Docker](https://img.shields.io/badge/Docker-Supported-blue?logo=docker)](https://github.com/LibreBooking/docker)
[![Docker pulls](https://img.shields.io/docker/pulls/librebooking/librebooking)](https://github.com/LibreBooking/docker)

[![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/4TGThPtmX8)
[![Docs](https://img.shields.io/badge/Docs-Available-lightgrey?logo=read-the-docs)](https://librebooking.readthedocs.io/en/latest/)

⭐ Star us on GitHub — it motivates us a lot!

🔥 Join the community: [Discord discussion channel](https://discord.gg/4TGThPtmX8) .

## Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Screenshots](#-screenshots)
- [Installation & Deployment](#-installation--deployment)
- [Developer Documentation](#-developer-documentation)
- [Configuration & Theming](#-configuration--theming)
- [ReCaptcha](#-recaptcha)
- [Community & Support](#-community--support)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

## 🚀 About

**LibreBooking** is an open-source resource scheduling solution. It provides a
flexible, mobile-friendly, and extensible interface for organizations to manage
resource reservations.

The repository for LibreBooking is hosted on GitHub at
<https://github.com/LibreBooking/librebooking>; the `develop` branch contains the latest
code.

LibreBooking is a fork of Booked Scheduler, based on Booked Scheduler's last
open-source version released in 2020. Since then, LibreBooking has evolved
significantly and diverged from the original project.

## ✨ Features

- [x] Multi-resource booking & waitlists
- [x] DataTables for advanced listings
- [x] Role-based access control
- [x] Quotas and credits for reservations
- [x] Granular usage reporting
- [x] Responsive Bootstrap 5 interface
- [x] Custom themes and color schemes
- [x] Plugin-ready architecture
- [x] Outlook/Thunderbird integration through ics

## 🧪 Demo

A live demo instance of LibreBooking is available for testing:

[Try the demo](https://librebooking.readthedocs.io/en/latest/demo.html)

| Role  | Username | Password    |
| ----- | -------- | ----------- |
| Admin | `admin`  | `demoadmin` |
| User  | `user`   | `demouser`  |

Note: This instance is public and **resets every 20 minutes** to ensure a clean environment. Startup might take a few seconds, so please be patient.

## 📸 Screenshots

![Login](./Web/img/readme/02.png)
![Schedules](./Web/img/readme/06.png)
![Dashboard](./Web/img/readme/03.png)
![User profile](./Web/img/readme/04.png)
![Search](./Web/img/readme/07.png)
![DataTables example](./Web/img/readme/15.png)

## 🔧 Installation & Deployment

### Manual Installation

To run LibreBooking from a prebuilt release, your server needs:

- PHP >= 8.2 with the extensions: ctype, curl, fileinfo, intl, json, mbstring, mysqli, openssl, pdo, pdo_mysql, tokenizer, xml
- Optional PHP extensions: bcmath (needed for Active Directory authentication), gd (image processing), ldap (LDAP authentication)
- Apache >= 2.4. Other web servers, including Nginx, may work when configured
  with equivalent routing and access-control rules, but are not currently
  supported or tested by the LibreBooking project.
- MySQL >= 8.0 (2018) or MariaDB >= 10.6 (2021)
- Composer (for managing PHP dependencies)
- Git (optional, useful for cloning the repository or managing updates)

For full setup instructions, see
[INSTALLATION](https://github.com/LibreBooking/librebooking/blob/develop/docs/source/INSTALLATION.rst)

### Docker Deployment

LibreBooking is available as a Docker container. See [LibreBooking Docker README](https://github.com/LibreBooking/docker) for complete setup.

```bash
git clone https://github.com/LibreBooking/docker.git
cd docker
docker-compose up -d
```

## 💻 Developer Documentation

- See
  [docs/source/README.md](https://github.com/LibreBooking/librebooking/blob/develop/docs/source/DEVELOPER-README.rst)
  for developer notes.
- See [docs/source/API.rst](https://github.com/LibreBooking/librebooking/blob/develop/docs/source/API.rst)
  for API notes.
- See
  [docs/source/Oauth2-Configuration.rst](https://github.com/LibreBooking/librebooking/blob/develop/docs/source/Oauth2-Configuration.rst)
  for Oauth2 configuration.
- See
  [docs/source/SAML-Configuration.rst](https://github.com/LibreBooking/librebooking/blob/develop/docs/source/SAML-Configuration.rst)
  for SAML configuration.
- Codebase follows PSR-12 standards and GitHub Flow.

## 🎨 Configuration & Theming

For configuration options, see the
[Configuration Guide](https://github.com/LibreBooking/librebooking/blob/develop/docs/source/CONFIGURATION.rst).

Recent configuration highlights:

- Change theme via `config.php`:

  ```php
  'css.theme' = 'default';
  ```

- Theme options: 'default', 'dimgray', 'dark_red', 'dark_green', 'french_blue', 'orange'
- Customize `Web/css/librebooking.css`

## 🔒 ReCaptcha

As of 09-Mar-2023, ReCaptcha integration updated to v3. Generate new keys for your domain if using ReCaptcha.

## 💬 Community & Support

- [Discord](https://discord.gg/4TGThPtmX8)
- [Docs](https://librebooking.readthedocs.io/en/latest/)
- [Issues](https://github.com/LibreBooking/librebooking/issues)
- [Discussions](https://github.com/LibreBooking/librebooking/discussions)

## 🤝 Contributing

- Fork, file issues, suggest improvements.
- Even non-coders can help by reporting bugs, testing, updating issues.
- PRs welcome (docs, features, refactoring, fixes).
- See CONTRIBUTING.md

## 💡 Roadmap

_Work in progress – roadmap to be defined._
Want to suggest a feature? [Open an issue](https://github.com/LibreBooking/librebooking/issues) or join the [Discord discussion channel](https://discord.gg/4TGThPtmX8).

## 📜 License

This project is licensed under **GPL-3.0**.

## 🙏 Acknowledgments

Forked from Booked Scheduler. Thanks to all contributors and the community.

[Back to top](#librebooking)
