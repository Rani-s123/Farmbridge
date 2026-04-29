# 🌾 FarmBridge - Quick Reference Card

## 📱 Farmer WhatsApp Chat Flow

```
Farmer              →  Bot Response
────────────────────────────────────
"hi"                →  Welcome! Shall we start?
[Image]             →  Image received! What crop?
"tomato"            →  Grade: A | Price: ₹15-20/kg
"Rajesh, Nashik"    →  ✨ Registration complete!
```

---

## ⚡ 5-Minute Setup

```bash
# 1. Clone & install
git clone <repo>
cd farmbridge
bash setup.sh

# 2. Edit .env with your keys
nano .env

# 3. Run locally
python farmbrige_whatsapp_bot.py

# 4. Test
curl http://localhost:5000/health

# 5. Expose to internet
ngrok http 5000

# 6. Update Twilio webhook with ngrok URL
```

---

## 🔑 Required API Keys (Free)

| Service | What | Get Here |
|---------|------|----------|
| **Twilio** | WhatsApp API | https://console.twilio.com |
| **OpenAI** | Image grading | https://platform.openai.com |
| **Agmarknet** | MSP prices | https://agmarknet.gov.in (public) |

---

## 🚀 Deploy (10 minutes)

### Option 1: Render (Easiest)
```
1. Push to GitHub
2. Go to render.com → New Web Service
3. Connect repo
4. Set env variables
5. Deploy! ✅
```

### Option 2: Railway
```bash
npm i -g @railway/cli
railway login
railway deploy
```

---

## 📊 AI Grading (How It Works)

```
Image → OpenAI GPT-4 Vision → JSON Response
         ↓ analyzes:
         • Color uniformity
         • Defects/damage
         • Freshness

Output:
{
  "grade": "A",
  "score": 92,
  "remarks": "Good color, minor spot"
}
```

---

## 💰 MSP Price Integration

```
MSP (Min Support Price) ← Government API
        ↓
Mandi Rate (Market) ← Agmarknet (660 mandis)
        ↓
FarmBridge Price = Mandi × 0.85-1.0 (no middleman)
```

---

## 📁 File Structure

```
farmbridge/
├── farmbrige_whatsapp_bot.py  ← Main bot (Flask)
├── buyer_dashboard.jsx         ← React UI for buyers
├── requirements.txt            ← Python packages
├── Procfile                    ← Deployment config
├── setup.sh                    ← Auto setup script
├── .env                        ← Your secrets
├── README.md                   ← Full docs
├── DEPLOYMENT_GUIDE.md         ← Deploy tutorial
└── package.json                ← (Optional) For React
```

---

## 🧪 Test Checklist

- [ ] Farmer sends WhatsApp message
- [ ] Image upload works
- [ ] AI returns grade in <10 seconds
- [ ] MSP prices display correctly
- [ ] Buyer dashboard loads
- [ ] Contact buttons (WhatsApp/Call)
- [ ] Database saves farmer info

---

## 💾 Database (Optional)

```sql
-- Farmer listings
CREATE TABLE farmers (
  phone VARCHAR PRIMARY KEY,
  name VARCHAR,
  village VARCHAR,
  crop VARCHAR,
  grade VARCHAR,
  price_per_kg FLOAT
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  farmer_phone VARCHAR,
  buyer_phone VARCHAR,
  amount INT,
  status VARCHAR
);
```

---

## 🔒 Environment Variables Template

```env
# Twilio (from console.twilio.com)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1987654321

# OpenAI (from platform.openai.com)
OPENAI_API_KEY=sk-xxxxxx

# Database (optional)
DATABASE_URL=postgresql://user:pass@host/farmbridge

# Flask
FLASK_ENV=production
DEBUG=False
```

---

## 📞 Getting Twilio WhatsApp Number (Free Sandbox)

```
1. Login: https://console.twilio.com
2. Go to: Messaging → WhatsApp Sandbox
3. Send "join <code>" to their test number
4. You're in! Send messages now
5. Set webhook URL in sandbox settings
```

---

## 🌾 Supported Crops (Phase 1)

- 🍅 Tomato
- 🥔 Potato
- 🧅 Onion
- 🌾 Wheat
- 🍚 Rice

*Add more by updating MSP_DATA dict in bot*

---

## 💬 Bot Commands

| Command | Does |
|---------|------|
| `hi` / `hello` | Start conversation |
| `[image]` | Upload for grading |
| `price` | Get today's rates |
| `buyers` | Find bulk buyers |
| `help` | Show menu |

---

## ⏱️ Response Times

| Action | Time |
|--------|------|
| WhatsApp message | 1-2 sec |
| Image upload | 2-3 sec |
| AI grading | 5-8 sec |
| MSP lookup | 1-2 sec |
| **Total** | ~10 sec |

---

## 🎯 Expected Metrics (First Month)

| Metric | Target |
|--------|--------|
| Farmers registered | 50 |
| Successful transactions | 20 |
| Avg price improvement | ₹10/kg |
| Farmer satisfaction | 90%+ |
| Bot success rate | 85%+ |

---

## 🚨 Common Errors & Fixes

### Error: OpenAI timeout
```
→ Increase timeout: max_tokens=2000
→ Check API key validity
```

### Error: Twilio webhook not firing
```
→ Check webhook URL in Twilio console
→ Make sure it's public (use ngrok)
→ Test with: curl -X POST https://your-url/whatsapp
```

### Error: Database connection failed
```
→ Check DATABASE_URL in .env
→ PostgreSQL must be running
→ For MVP, skip DB (use in-memory dict)
```

---

## 📚 Helpful Links

- **Twilio WhatsApp**: https://www.twilio.com/docs/whatsapp
- **OpenAI Vision**: https://platform.openai.com/docs/guides/vision
- **Agmarknet API**: https://agmarknet.gov.in
- **Flask**: https://flask.palletsprojects.com
- **React**: https://react.dev

---

## 🎓 Learning Resources

1. **Setup tutorials**: See DEPLOYMENT_GUIDE.md
2. **Code walkthrough**: Comments in farmbrige_whatsapp_bot.py
3. **Architecture**: README.md
4. **Troubleshooting**: GitHub Issues

---

## 🤝 Need Help?

```
📧 Email: mkumar@bluepms.com
🐙 GitHub: rajpurohitrani004
💻 Devpost: rajpurohitrani004
```

---

## 📈 Next Features (Phase 2)

- [ ] Payment integration
- [ ] Farmer ratings & reviews
- [ ] Real-time inventory updates
- [ ] Bulk order management
- [ ] Video call for negotiations
- [ ] Regional language support

---

**Built with ❤️ for Indian Farmers**  
*Closing the farm-to-market gap, one transaction at a time.*

---

**Status**: Ready for deployment ✅  
**Last Updated**: April 2026  
**Version**: 1.0 MVP
