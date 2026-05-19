# Shared Admin Backend Setup

The admin panel saves portfolio edits through a normal Node/Express backend and a local SQLite database file.

1. Create a `.env` file from `.env.example`.
2. Set `ADMIN_PASSWORD`.
3. Keep `DB_PATH=./data/portfolio.db`, or change it if your host needs another writable folder.
4. Build and start the site:

```bash
npm install
npm run build
npm start
```

Open `http://localhost:8080/manav3d.html` for the portfolio and `http://localhost:8080/admin.html` for the admin panel.

On any Node hosting provider, set the same environment variables and run `npm run build && npm start`.

The SQLite file is created automatically on first use. Back up the `data/portfolio.db` file if you move servers.
