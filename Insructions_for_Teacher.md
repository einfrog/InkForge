## 🧾 Instructions for Teacher

This file must be submitted with your final project. If any of the required information is missing or incomplete, you will receive **0 points** for your development documentation — no exceptions.

---

### ▶️ 1. Setup Instructions (Copy-paste Ready)

#### How to clone your repository:
```bash
# Replace with your actual repository link
# Make sure I actually have access in Gitlab
git clone <your-repo-url>
```


List the exact commands needed to install and start both backend and frontend:

```bash
# Backend setup
cd backend
npm install
npm run start

# Frontend setup
cd ../frontend
npm install
npm run dev
```

Add any environment variables or `.env` file setup notes if required - here's an example:

```bash
# Environment setup (if needed)
Create a file called .env in /backend and add the following:
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
```

---

### 🔑 2. Credentials

#### Database Access (if applicable):
```
Host: 
User: 
Password: 
Database Name: 
```
If you used another service (e.g., MongoDB Atlas, Airtable), include a working access link and instructions.


#### The link(s) to your instance(s):
```
Backend: 
Frontend: 
```

#### Admin Login (if you have one) - create this in your app:
```
Email: michael@grading.now
Password: asdf
```

#### Two Normal Users:
```
User 1 Email: 
User 1 Password: 

User 2 Email: 
User 2 Password: 
```

---

### 🧭 3. User Flow / Grading Instructions

Provide a clear walkthrough for testing your app - here's an example:

1. Visit the homepage at: [URL here]
2. Login with a normal user.
3. Try feature A (describe what it does).
4. Logout and log in as admin.
5. Test feature B (admin-specific function).
6. Navigate to page X and try action Y.

Feel free to number the steps. Be as specific as possible. This helps ensure your app is tested fairly and accurately.

---

Add any additional notes or testing considerations here:


### ✅ Examples:

- We also implemented a basic dark mode toggle in the settings menu. It’s not part of the main flow but feel free to test it.
- On mobile, the chat interface occasionally overlaps with the footer. This is a known issue and we focused on desktop experience first.
- You can reset the database using the `/admin/reset` endpoint (only available for admin users). Use with caution — it deletes all data.
- The homepage displays a list of upcoming events. If you’re testing this after June 21, the list might be empty unless you manually add events.

---

Delete everything from my examples in here before you submit :)
