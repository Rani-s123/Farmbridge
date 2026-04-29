# 🚀 FarmBridge WhatsApp Bot - Deployment Guide
## Step-by-Step Setup (Ready in 15 minutes!)

---

## 📋 Prerequisites
```
- Python 3.9+
- Twilio Account (Free)
- OpenAI API Key (GPT-4 Vision)
- GitHub Account (for deployment)
```

---

## 🔧 Step 1: Local Setup

### 1.1 Install Dependencies
```bash
pip install flask twilio openai pillow requests python-dotenv
```

### 1.2 Create `.env` file
```env
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=+1234567890
OPENAI_API_KEY=your_openai_key
```

### 1.3 Run Locally
```bash
python farmbrige_whatsapp_bot.py
```
Server starts at `http://localhost:5000`

---

## 🌐 Step 2: Get Twilio WhatsApp Sandbox (FREE)

### 2.1 Go to Twilio Console
- Login: https://console.twilio.com
- Navigate: **Messaging → WhatsApp Sandbox**

### 2.2 Setup Webhook
- **Webhook URL**: `https://your-deployed-app.com/whatsapp`
- **HTTP POST**

### 2.3 Test with Twilio Number
Send message "join code" to Twilio's test number
(Twilio will give you this number in sandbox)

---

## 🚢 Step 3: Deploy to Render (FREE)

### 3.1 Create `requirements.txt`
```
Flask==2.3.0
twilio==8.10.0
openai==0.27.0
Pillow==9.5.0
requests==2.31.0
python-dotenv==1.0.0
gunicorn==21.2.0
```

### 3.2 Create `Procfile`
```
web: gunicorn farmbrige_whatsapp_bot:app
```

### 3.3 Push to GitHub
```bash
git init
git add .
git commit -m "FarmBridge WhatsApp Bot v1"
git push origin main
```

### 3.4 Deploy on Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Set Environment Variables (from `.env`)
5. Deploy!

Your app will be live at: `https://farmbrigde-bot.onrender.com`

---

## 📱 Step 4: Connect Twilio WhatsApp to Your Bot

Back in Twilio Console:
- **Webhook URL**: `https://farmbrigde-bot.onrender.com/whatsapp`
- Save ✅

---

## 🧪 Step 5: Test Flow

**Farmer sends:**
```
1. "hi" 
2. [Sends image of tomato]
3. "tomato"
4. "Rajesh, Village Sonkhet, Nashik"
```

**Bot responds:**
```
✅ Image received!
📊 Grade: A (Score: 92/100)
💰 MSP: ₹5.50/kg, Mandi: ₹15/kg
✨ You are registered!
```

---

## 🔌 Integration with Agmarknet (Real MSP Data)

Replace this in `farmbrige_whatsapp_bot.py`:

```python
def get_live_msp_data(crop_type, state="Maharashtra"):
    """Fetch real data from Government API"""
    try:
        url = f"https://agmarknet.gov.in/searchinclude/search_value_limit.php?hiddenflag=g&commodity_id={crop_type}&state_id={state}"
        response = requests.get(url, timeout=5)
        # Parse XML/JSON response
        # Return: {"msp": ..., "mandi": ..., "state": ...}
    except:
        return MSP_DATA.get(crop_type, {})
```

---

## 💾 Database Integration (Production)

Add to backend:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:pass@localhost/farmbridge"
engine = create_engine(DATABASE_URL)

# Store farmers
class Farmer(Base):
    __tablename__ = "farmers"
    phone = Column(String, primary_key=True)
    name = Column(String)
    village = Column(String)
    crop = Column(String)
    grade = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

## 🎯 Features Roadmap

✅ Phase 1 (Done):
- WhatsApp chatbot
- Image upload
- AI quality grading
- MSP price lookup

🔄 Phase 2 (Next):
- Buyer dashboard
- Real Agmarknet API integration
- Payment escrow
- Ratings system

🚀 Phase 3 (Scale):
- Hindi/Regional languages
- Video call for negotiations
- Bulk orders management

---

## 💬 Common Issues & Fixes

### Issue: Images not uploading
```
Solution: Increase request timeout in Twilio settings
Settings → Messaging → WhatsApp → Webhook timeout (30s)
```

### Issue: OpenAI API errors
```
Solution: Check API key, ensure GPT-4 Vision access
Run: curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"
```

### Issue: Twilio sandbox expires
```
Solution: Sandbox resets every 72 hours of inactivity
Send message to Twilio test number to reactivate
```

---

## 📊 Expected Response Times

| Action | Time |
|--------|------|
| Image upload | 2-3 sec |
| AI grading | 5-8 sec |
| MSP lookup | 1-2 sec |
| Total response | ~10 sec |

---

## 🏆 For Hackathon Submission

Include in your presentation:
1. **Live Demo**: WhatsApp screenshot flow
2. **Architecture Diagram**: Backend → Twilio → OpenAI
3. **Impact Metrics**: "5 farmers tested, 100% understood the bot"
4. **Next Steps**: "Scale to 50 farmers in 2 months"

---

## 📞 Support
- Twilio Docs: https://www.twilio.com/docs/whatsapp
- OpenAI Vision: https://platform.openai.com/docs/guides/vision
- Render Docs: https://docs.render.com

**Good luck with BluePrint 2026! 🚀🌾**
