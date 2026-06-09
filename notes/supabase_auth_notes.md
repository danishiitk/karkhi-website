# Supabase & Google OAuth Study Notes

## The Three Main Characters
When setting up Google Authentication in a Supabase application, three main entities interact:
1. **Your Website (Frontend):** The React/Vite UI the user interacts with. It acts as a display window and never handles or sees the user's password.
2. **Supabase (Your Database & Bouncer):** The secure backend. It manages users, stores data, and securely talks to Google on your behalf.
3. **Google (The Identity Provider / IdP):** The massive, secure vault that verifies who a person actually is.

## The Keys to the Kingdom
To make Google and Supabase talk to each other, you need two things from the Google Cloud Console:
*   **Client ID:** Your app's public name tag. It tells Google, *"Hi, I am the Karkhi Website!"* It is safe for the public to see and is included in URLs.
*   **Client Secret:** Your app's ultra-secure password. Only Supabase knows this. It proves to Google, *"I am not a hacker pretending to be Karkhi Website; I actually own it."*

## What is OAuth? (The Valet Key Analogy)
**OAuth (Open Authorization)** is a universal internet standard allowing a user to grant one website access to their information on *another* website, **without sharing their password**.

**Analogy:** Imagine giving a valet at a restaurant your "Valet Key". It lets them turn on the engine and park the car, but physically prevents them from opening the trunk or glovebox where your private items are.
*   Instead of the user giving your website their Google password (the master key), they log in on Google's secure page.
*   Google gives your website an **OAuth Token** (the valet key) that says: *"Here is this person's name and email. You are not allowed to read their emails or change their password."*

## The Authentication Flow (Step-by-Step)
1. **The Click:** The user clicks "Sign in with Google". Your React frontend runs `supabase.auth.signInWithOAuth({ provider: 'google' })`.
2. **The Redirect:** The Supabase SDK asks the Supabase server for the Google login URL. Supabase builds a massive URL containing your **Client ID** and your **Callback URL** (`https://...supabase.co/auth/v1/callback`), and forces the browser to redirect to `accounts.google.com`.
3. **User Verification:** The user logs in to Google. Google sees the Client ID and asks the user for permission to share their email.
4. **The Handoff:** Google generates a temporary, encrypted "authorization code" and redirects the browser back to your Supabase **Callback URL** with the code attached.
5. **The Secret Handshake:** Supabase takes this temporary code and secretly talks directly to Google's servers. Supabase says: *"Here is the temporary code, and here is my **Client Secret** to prove I'm the real website."* Google verifies the secret and sends back the user's email, name, and profile picture.
6. **Database Magic:** Supabase checks its `auth.users` table.
    *   If the email is **new**, Supabase creates a new account (without a password) and a new row in your `profiles` table.
    *   If the email **already exists**, it skips creation and just logs them in.
7. **The Final Redirect:** Supabase generates a secure "Session Token" (JWT), sends it to the user's browser, and redirects them to your website's homepage (`http://localhost:5173`). Your React app sees the token and updates the UI to show they are logged in.

## Delegated Authentication & Passwords
This entire system works on **Delegated Authentication**—the assumption that if a giant, secure entity like Google verifies a user's password, your website can trust Google's word without needing to see the password itself.

**What if they try to log in with an email/password later?**
Because Supabase created their account via Google, they technically **do not have a password** in your database! 
If they type their Gmail address and Google password into your site's standard Email/Password box, it will fail. 
To fix this, the user must either:
1. Click "Forgot Password" to have Supabase email them a link to create a specific password *just for your website*.
2. Or, use a "Magic Link" feature to log in via an email link.

---

## Technical Appendix: Supabase TypeScript Quirks
During development, we encountered red underlines in `src/lib/queries.ts` where TypeScript claimed `Insert` and `Update` types were `never`.

**The Cause:**
The `@supabase/supabase-js` library uses extremely strict internal TypeScript checks (like `GenericTable` and `GenericSchema`). It expects the `Database` type to be perfectly explicitly mapped, including defining `Views`, `Enums`, and `CompositeTypes`. It also rejects utility types like `Omit<...>` or `Partial<...>`.

**The Fix:**
1. Added empty placeholders for missing schema pieces:
```typescript
    Views: { [_ in never]: never; };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
```
2. Replaced `Omit` and `Partial` with explicitly typed objects for `Insert` and `Update` (e.g., manually listing `id: string`, `name?: string`, etc.).
This satisfied the library's internal generic constraints and resolved the `never` errors.
