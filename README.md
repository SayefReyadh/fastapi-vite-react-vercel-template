# FastAPI + React Template

Minimal full-stack starter: a FastAPI backend and a Vite + React + TypeScript frontend, deployable to Vercel as a single project.

```
backend/main.py     FastAPI app (API under /api, serves frontend/dist in production)
frontend/           Vite + React + TypeScript
pyproject.toml      Python dependencies + Vercel entrypoint
vercel.json         Builds the frontend during deployment
```

## How it works

- **In development** you run two servers: FastAPI on port `8000` and the Vite dev server on port `5173`. Vite forwards every `/api/*` request to FastAPI (see `frontend/vite.config.ts`), so the browser only talks to `localhost:5173` and no CORS setup is needed.
- **In production** the frontend is built into `frontend/dist`, and FastAPI serves it with `app.frontend()`. On Vercel the whole project becomes one deployment: the API runs as a Vercel Function and the static files are served from Vercel's CDN.

## Prerequisites

Install these first:

- [Python](https://www.python.org/downloads/) 3.10 or newer
- [Node.js](https://nodejs.org/) 22 LTS or newer (includes `npm`)
- [Git](https://git-scm.com/downloads)

Check the installed versions:

```bash
python --version
```

```bash
node --version
```

```bash
git --version
```

> On macOS/Linux, use `python3` wherever this guide says `python`.

---

## Run locally

### 1. Get the code

```bash
git clone https://github.com/SayefReyadh/full-stack-fastapi-template.git
```

```bash
cd full-stack-fastapi-template
```

### 2. Set up the backend

Create a virtual environment (run this from the project root):

```bash
python -m venv .venv
```

Activate it. Pick the command for your shell:

Windows (PowerShell):

```powershell
.venv\Scripts\Activate.ps1
```

Windows (Command Prompt):

```cmd
.venv\Scripts\activate.bat
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Your prompt should now start with `(.venv)`. Install the dependencies:

```bash
pip install "fastapi[standard]"
```

### 3. Start the backend

```bash
fastapi dev backend/main.py
```

Leave this terminal running. Check that it works:

- API: http://localhost:8000/api/hello
- Interactive API docs: http://localhost:8000/docs

### 4. Set up and start the frontend

Open a **second terminal** in the project root, then go to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

### 5. Open the app

Go to http://localhost:5173, type a name and click **Say hello**. The message comes from the FastAPI backend.

Edits to files in `frontend/src` reload in the browser instantly, and edits to `backend/main.py` restart the API automatically.

### 6. (Optional) Test the production build locally

This runs the app the way Vercel does: one FastAPI server serving both the API and the built frontend.

Stop both dev servers (`Ctrl+C`). From the `frontend` folder, build the frontend:

```bash
npm run build
```

Go back to the project root:

```bash
cd ..
```

Start FastAPI in production mode (with the virtual environment active):

```bash
fastapi run backend/main.py
```

Open http://localhost:8000. The React app and the API are now both served from port 8000.

> `frontend/dist` is ignored by git. Vercel builds it itself during deployment.

---

## Deploy to Vercel

You don't need to change any settings. Vercel:

1. Detects FastAPI from `pyproject.toml` (`[tool.vercel] entrypoint = "backend.main:app"`).
2. Runs `buildCommand` from `vercel.json` to build the frontend into `frontend/dist`.
3. Deploys FastAPI as a Vercel Function and serves `frontend/dist` from its CDN.

There are two ways to deploy. Pick one.

### Option A: Deploy from GitHub (recommended)

Every push to your main branch deploys automatically.

**1. Push your code to GitHub.** Commit your changes from the project root:

```bash
git add .
```

```bash
git commit -m "Initial commit"
```

```bash
git push origin master
```

**2. Create a Vercel account** at https://vercel.com/signup. Signing up with GitHub is the easiest option.

**3. Import the project:**

1. Go to https://vercel.com/new.
2. Under **Import Git Repository**, find your repository and click **Import**. (If it isn't listed, click **Adjust GitHub App Permissions** and give Vercel access to the repository.)
3. Keep the defaults:
   - **Framework Preset:** FastAPI (detected automatically)
   - **Root Directory:** `./`
4. Click **Deploy**.

**4. Open your app.** When the build finishes, Vercel shows a URL such as `https://your-project.vercel.app`. Open it and click **Say hello**.

From now on:
- Pushes to `master` update the production URL.
- Pushes to other branches and pull requests get their own preview URLs.

### Option B: Deploy with the Vercel CLI

Install the CLI:

```bash
npm install -g vercel
```

Log in:

```bash
vercel login
```

From the project root, create a preview deployment. The first run asks a few setup questions; the defaults are fine.

```bash
vercel
```

When the preview looks right, deploy to production:

```bash
vercel --prod
```

---

## Troubleshooting

**PowerShell says "running scripts is disabled on this system" when activating `.venv`.** Allow local scripts for your user account, then run the activate command again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**`fastapi: command not found` or `'fastapi' is not recognized`.** The virtual environment isn't active. Activate it (step 2) and try again.

**The frontend shows `Request failed: 500`, or the Vite terminal shows proxy errors.** The backend isn't running. Start it in a separate terminal (step 3).

**Port already in use.** Run the backend on another port:

```bash
fastapi dev backend/main.py --port 8001
```

If you change the port, update the proxy target in `frontend/vite.config.ts` to match.

**A Vercel build fails.** Open the deployment in the Vercel dashboard and check **Build Logs**. Before redeploying, confirm that `npm run build` works locally inside `frontend/`.
