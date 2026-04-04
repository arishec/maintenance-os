# I got tired of chasing contractors through texts, so I built software to fix it

If you own a rental property — or even just a house — you know how this goes.

Something breaks. A tenant texts you at 9pm. You reach out to a few contractors. One gets back to you two days later with a number. Another sends a vague email. The third just never responds. You pick someone, forget to follow up, and six months later the same thing breaks and you can't remember who fixed it or what you paid.

There's no system. It's just a mess of texts, calls, and memory.

I kept running into this and eventually thought — there has to be a better way to manage this. I looked around and couldn't find anything that actually fit. Most property software is either way too enterprise or just a glorified spreadsheet. Nothing handled the actual back-and-forth with contractors.

So I built it myself.

## What it does

It's called [Maintenance OS](https://ifbids.com). The idea is simple — instead of managing repairs across 10 different text threads, everything lives in one place:

- A tenant (or you) submits a repair with photos
- AI looks at the photos and figures out what's wrong — water damage, broken fixture, whatever — and recommends the right trade
- You send one request and multiple contractors get notified
- When they reply by text or email, AI reads the replies and pulls out the price and timeline automatically
- You compare quotes side by side and pick someone
- The job gets tracked from start to finish
- Everything becomes searchable history

The AI part is what I'm most proud of honestly. It's not a chatbot bolted on. It's built into every step — classifying issues, reading contractor messages, comparing bids, parsing confirmations, extracting invoices. When a contractor texts "I can come Thursday for $400," the system just picks that up and updates everything. No data entry.

## The stack

Next.js 15, PostgreSQL on Supabase, Clerk for auth, Twilio for SMS, Resend for email, Anthropic Claude for all the AI stuff. Deployed on Vercel.

## Where I'm at

I'm a solo founder. The product is live and free during beta. It works — I use it myself. But I need more people using it to find the rough edges.

If you manage any property and deal with maintenance, I'd really appreciate you giving it a shot and telling me what sucks, what's confusing, or what's missing. I'm building fast and I can probably ship whatever you need within a week.

Site is [ifbids.com](https://ifbids.com). Happy to answer any questions about the build, the AI, or anything else.
