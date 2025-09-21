# QR Code Generator (Express + EJS + Bootstrap)

A simple web app to generate QR codes from URLs.  
Built with Express.js, EJS, Bootstrap, and the qrcode library.    
See the demo app in <https://qr-generator-nine-xi.vercel.app/>.

---

## ✨ Features
- Input a URL with basic validation (http:// or https://)
- Generate QR code as PNG (ECC level H, width 512px)
- Preview QR code directly in the browser
- Download the QR code as a PNG image
- Works locally or deployed to Vercel (Serverless Functions)

---

## 🧱 Tech Stack
- Node.js (v18+ recommended, tested on v20)
- Express.js
- EJS (templating engine)
- Bootstrap 5 (frontend)
- qrcode (QR generation library)

---

## 📂 Project Structure
- package.json — project metadata and dependencies
- server.js — main Express server
- vercel.json — (for Vercel deploys) routes and config
- api/index.js — (for Vercel) wraps Express app as serverless handler
- views/index.ejs — main HTML template (EJS)
- public/js/main.js — frontend script

---

## 🚀 Getting Started (Local Development)

1) Prerequisites
- Node.js v18 or higher (v20 LTS recommended)
- npm (comes with Node)

2) Install dependencies
    npm install

3) Run the app (choose one)
- Development with auto-reload:
    npm run dev
- Simple start:
    npm start

4) Open in browser
- http://localhost:3000

---

## 🔗 Endpoints
- GET /  → Home page with form and preview
- POST /api/generate  → Returns { dataUrl, pngUrl } for given URL
- GET /qrcode?text=<URL>  → Returns QR code as PNG

---

## ⚙️ Scripts (package.json)
    "scripts": {
      "start": "node server.js",
      "dev": "node --watch server.js",
      "vercel-build": "echo 'no build step'"
    }

---

## ☁️ Deploying to Vercel

1) Update server.js (export app on Vercel)
```
    if (process.env.VERCEL) {
      module.exports = app;
    } else {
      app.listen(PORT, () => {
        console.log(`App running at http://localhost:${PORT}`);
      });
    }
```

2) Add serverless handler: api/index.js
```
    const app = require('../server');
    module.exports = app;
```

3) Create vercel.json
```
    {
      "functions": {
        "api/index.js": { "runtime": "nodejs20.x" }
      },
      "routes": [
        { "src": "/public/(.*)", "dest": "/public/$1" },
        { "src": "/(.*)", "dest": "/api/index.js" }
      ]
    }
```

4) Deploy options
- From Git:
  - Push repo to GitHub/GitLab/Bitbucket → import on https://vercel.com → Deploy
- From CLI:
```
    npm i -g vercel
    vercel
    vercel --prod
```

(Optional) Local Vercel emulation:
```
    vercel dev
```

---

## 🧰 Troubleshooting
- 404 on Vercel → Check vercel.json routes
- EJS view not found → Ensure views/ folder is at repo root
- Static assets missing → Use /public/... paths and include the /public/(.*) route in vercel.json

---

## 🔐 Security Notes
- Basic URL validation included
- For production consider:
  - Rate limiting (express-rate-limit)
  - Request size limits
  - Logging/monitoring

---

## 📝 License
MIT — free to use and modify.

---

## 🙌 Acknowledgements
- qrcode (npm)
- Express.js
- Bootstrap
