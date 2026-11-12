# Aura Beauty: M-Pesa payment server

This small server lets customers pay with M-Pesa (STK Push: a PIN prompt pops up on their phone).
Your Safaricom keys stay on this server only. They are never placed inside the website.

## 1. Get your Daraja details (Safaricom)
1. Sign up at **developer.safaricom.co.ke** and create an app with "Lipa Na M-Pesa Sandbox/Production".
2. Copy the **Consumer Key** and **Consumer Secret**.
3. Note your **Shortcode** (Paybill, or the Head Office number for a Till) and the **Passkey**.
   Use the sandbox test values first. Safaricom shows them on the Daraja "Simulate" page.

## 2. Put this server online (Render)
1. In Render choose **New, Web Service** and connect the `aura-beauty-store` repository.
2. Set **Root Directory** to `server`, **Build Command** `npm install`, **Start Command** `node server.js`.
3. Under **Environment**, add every line from `.env.example` and fill in your values.
   * `PUBLIC_URL` = your Render address (for example `https://aura-beauty-api.onrender.com`).
   * `CALLBACK_SECRET` = a long random text you invent. Safaricom's results come to a web address that contains it.
   * `ALLOWED_ORIGIN` = your website address.
4. Set **Health Check Path** to `/health`.

## 3. Connect the website
Open `assets/site.js` and paste your Render address into the `MPESA_API_URL` line, for example:
`var MPESA_API_URL = 'https://aura-beauty-api.onrender.com';`
Until you do this, the Pay with M-Pesa button politely sends customers to WhatsApp checkout.

## 4. Go live
* Test everything in `DARAJA_ENV=sandbox` first.
* Change to `DARAJA_ENV=production`, and use your live Consumer Key, Secret, Shortcode and Passkey.
* If you use a **Till**, set `DARAJA_TRANSACTION_TYPE=CustomerBuyGoodsOnline` and put the Till number in `DARAJA_PARTYB`.

## What protects you
* The **price is calculated on the server** from `catalog.js`, so customers cannot change what they pay.
  Keep the prices in `catalog.js` the same as in `assets/site.js`.
* The callback address contains a secret, and payments are double checked with Safaricom if a result is missed.
* Limits stop people from sending prompts to random phone numbers.
* Every paid order is printed in the Render **Logs** as a line starting with `PAID`.

## Notes
* Orders are kept in memory, so a Render restart clears them. For a busy shop, save paid orders to a database.
* Free Render servers sleep when unused. See the keep-awake notes we discussed (health ping every 10 minutes).
