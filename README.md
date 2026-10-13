# MetaWorld React website + contact database/email

This project keeps the MetaWorld React landing page and adds an Express API that saves contact form submissions in MongoDB and emails a confirmation to the person who submitted the form.

## Requirements
- Node.js 18 or newer
- A MongoDB Atlas database (or another reachable MongoDB instance)
- An email account configured for SMTP. For Gmail, use a Google App Password, not your normal account password.

## 1. Configure the API
1. Create a MongoDB database and obtain its connection string. In Atlas, allow network access only from the IPs you need and create a database user.
2. Copy `server/.env.example` to `server/.env` and fill in `MONGODB_URI`, `EMAIL_USER`, and `EMAIL_APP_PASSWORD`.
3. Change `EMAIL_FROM` if needed. The sender should be an account/address your email provider permits.

## 2. Install dependencies
Open a terminal in this folder and run:

```bash
npm install
npm --prefix server install
```

## 3. Run locally
Use two terminals, both in this project folder.

Terminal 1 — API:
```bash
npm run server
```

Terminal 2 — React/Vite:
```bash
npm run dev
```

Open the local URL Vite prints (normally `http://localhost:5173`). The API health check is `http://localhost:5000/api/health`.

## What happens when someone submits the form?
1. The React form sends name, email, project type, and message to `POST /api/contact`.
2. The API validates the basic fields and stores the enquiry in MongoDB.
3. The API sends a confirmation email to the submitted email address, if email credentials are configured.
4. If email delivery fails, the saved enquiry is retained and the response indicates that confirmation mail was not sent.

## Notes before deployment
- Never commit `.env` files or expose database/email credentials in React code.
- Configure `CLIENT_ORIGIN` to your deployed website's exact origin.
- Set up MongoDB network access, email sender verification, HTTPS, monitoring, and appropriate retention/privacy notices before production use.
- This integration only adds the contact form database/email behavior. The existing login/signup UI remains a demo and does not create user accounts.
