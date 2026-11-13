# Aura Beauty: M-Pesa payment server (PayHero)

Customers tap **Pay with M-Pesa**, a PIN prompt pops up on their phone, and the money is paid
into the **bank account (or till / paybill)** you linked in PayHero.
Your PayHero keys stay on this server only. They are never placed inside the website.

## 1. Set up PayHero (app.payhero.co.ke)
1. Create your PayHero account and finish their verification.
2. **Add your bank as a Payment Channel.** Choose Bank, then pick your bank and enter your account number.
   Copy the channel's **ID number**. That is `PAYHERO_CHANNEL_ID`.
3. Open the **API Keys** page (`app.payhero.co.ke/api_keys/add`) and create a key.
   Copy the **API Username** and **API Password** (or the ready-made Basic Auth Token).
4. Check PayHero's fees and how quickly money reaches your bank. Those are PayHero's terms, not ours.

## 2. Put this server online (Render)
1. In Render choose **New, Web Service** and connect the `aura-beauty-store` repository.
2. Set **Root Directory** to `server`, **Build Command** `npm install`, **Start Command** `node server.js`.
3. Under **Environment**, add the lines from `.env.example` and fill them in:
   * `PAYHERO_API_USERNAME`, `PAYHERO_API_PASSWORD`, `PAYHERO_CHANNEL_ID`
   * `PUBLIC_URL` = your Render address, for example `https://aura-beauty-api.onrender.com`
   * `CALLBACK_SECRET` = a long random text you invent (PayHero sends results to an address that contains it)
   * `ALLOWED_ORIGIN` = your website address
4. Set **Health Check Path** to `/health`.

## 3. Connect the website
Open `assets/site.js` and paste your Render address into the `MPESA_API_URL` line, for example:
`var MPESA_API_URL = 'https://aura-beauty-api.onrender.com';`
Until you do this, the Pay with M-Pesa button politely sends customers to WhatsApp checkout.

## 4. Test before going live
Place a small real order (use the cheapest product) and pay with your own phone.
Check three things: the prompt arrives, the website shows "Payment received", and the money appears in PayHero.

## What protects you
* The **price is calculated on the server** from `catalog.js`, so customers cannot change what they pay.
  Keep the prices in `catalog.js` the same as in `assets/site.js`.
* The result address contains a secret. Every "paid" result is also double checked with PayHero's own
  status service, and a wrong amount is held for review instead of being marked paid.
* If a result is missed, the server asks PayHero directly.
* Limits stop people from sending prompts to random phone numbers.
* Every paid order is printed in the Render **Logs** as a line starting with `PAID`.

## Using Safaricom Daraja instead
Set `PAYMENT_PROVIDER=daraja` and fill the `DARAJA_...` lines in `.env.example`. Everything else works the same.

## Notes
* Orders are kept in memory, so a Render restart clears them. For a busy shop, save paid orders to a database.
* Free Render servers sleep when unused. Add an outside pinger on `/health` every 10 minutes.
