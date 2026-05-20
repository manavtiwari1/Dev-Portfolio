# Render Backend Setup

This portfolio uses a normal Node/Express backend with a small local JSON database file. Admin updates are saved on the server in `.backend/db.json`, not in browser localStorage.

Important: the host must provide persistent server storage. On Render, attach a persistent disk or data can be lost after restart/deploy.

## Render settings

Create a Render Web Service from this repo and use:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

Environment variables:

```bash
ADMIN_PASSWORD=your-secure-admin-password
DATA_FILE=./.backend/db.json
CORS_ORIGIN=*
```

This matches the `Anchu` project style: the JSON database file lives inside the deployed app folder.

For stronger persistence on Render, add a persistent disk and use `DATA_FILE=/var/data/portfolio.json`. Without a disk, the app can still run and save data while the server filesystem stays alive, but Render can reset that filesystem on redeploy/restart.

Use your real website URL for `CORS_ORIGIN` in production if the frontend is hosted somewhere else. Keep `*` while testing.

## URLs

- Portfolio: `https://your-render-app.onrender.com/manav3d.html`
- Admin panel: `https://your-render-app.onrender.com/admin.html`

After logging into the admin panel, edits to skills, qualifications, certifications, projects, and contact messages are stored in the JSON file and are visible to everyone.
