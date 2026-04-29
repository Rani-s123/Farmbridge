"""
FarmBridge WhatsApp Chatbot
Direct image upload → AI Quality Grading → MSP Price Alert
Built with Twilio API + OpenAI Vision + Government MSP Data
"""

from flask import Flask, request
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
import os
import requests
import base64
from io import BytesIO
from PIL import Image
import json
import re
from datetime import datetime
import openai

# ============ CONFIGURATION ============
app = Flask(__name__)

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "your_account_sid")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "your_auth_token")
TWILIO_PHONE = os.getenv("TWILIO_PHONE", "+1234567890")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your_openai_key")

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
openai.api_key = OPENAI_API_KEY

# ============ MSP DATA (Government Reference) ============
# Real-time data should come from Agmarknet API
MSP_DATA = {
    "tomato": {"msp": 5.50, "mandi": 15, "state": "Maharashtra"},
    "potato": {"msp": 2.50, "mandi": 8, "state": "Maharashtra"},
    "onion": {"msp": 2.20, "mandi": 12, "state": "Maharashtra"},
    "wheat": {"msp": 2550, "mandi": 3000, "state": "Rajasthan"},
    "rice": {"msp": 5500, "mandi": 6500, "state": "Rajasthan"},
}

# ============ FARMER DATABASE (Mock) ============
FARMER_DATA = {}

# ============ CORE FUNCTIONS ============

def get_ai_grading(image_base64, crop_type):
    """
    Use OpenAI GPT-4 Vision to grade produce quality
    Returns: Grade (A/B/C), Score (0-100), Remarks
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}
                        },
                        {
                            "type": "text",
                            "text": f"""
You are an expert agricultural produce grader for {crop_type}.

Analyze this image and grade the produce on these criteria:
1. Color uniformity (fresh vs dull)
2. Size consistency 
3. Visible defects (spots, damage, rot)
4. Freshness indicators

Respond ONLY in this exact JSON format:
{{
    "grade": "A or B or C",
    "score": 85,
    "remarks": "Good color, minor blemish on side",
    "confidence": 0.92
}}

Grade Definitions:
- A: Premium quality (95-100) - Bright color, no defects, market-ready
- B: Good quality (70-94) - Minor blemishes okay, sellable at good price
- C: Fair quality (50-69) - Visible defects, needs discount, still sellable

Only respond with JSON, no other text.
"""
                        }
                    ]
                }
            ],
            max_tokens=200
        )
        
        # Parse JSON response
        result_text = response.choices[0].message.content
        grading = json.loads(result_text)
        return grading
    
    except Exception as e:
        return {
            "grade": "B",
            "score": 75,
            "remarks": f"Auto-graded (system): {str(e)[:50]}",
            "confidence": 0.5
        }


def get_msp_price(crop_type, state="Maharashtra"):
    """
    Fetch live MSP and mandi prices
    In production: Call Agmarknet API
    For now: Return mock data
    """
    crop = crop_type.lower().strip()
    
    if crop in MSP_DATA:
        data = MSP_DATA[crop]
        return {
            "crop": crop,
            "msp_price": data["msp"],
            "mandi_price": data["mandi"],
            "state": state,
            "updated_at": datetime.now().isoformat(),
            "recommendation": f"You should ask for at least ₹{data['mandi']} per kg"
        }
    
    return {"error": "Crop not found in database"}


def send_whatsapp_message(phone_number, message_text):
    """Send message back to farmer via WhatsApp"""
    try:
        message = twilio_client.messages.create(
            from_=f"whatsapp:{TWILIO_PHONE}",
            body=message_text,
            to=f"whatsapp:{phone_number}"
        )
        return message.sid
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")
        return None


def download_and_encode_image(media_url):
    """Download image from Twilio media URL and encode to base64"""
    try:
        # Twilio provides auth in headers
        response = requests.get(
            media_url,
            auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        )
        image_data = base64.b64encode(response.content).decode()
        return image_data
    except Exception as e:
        print(f"Error downloading image: {e}")
        return None


# ============ WHATSAPP WEBHOOK ENDPOINT ============

@app.route("/whatsapp", methods=["POST"])
def whatsapp_webhook():
    """
    Twilio WhatsApp Webhook
    Receives messages and media from farmers
    """
    
    incoming_msg = request.values.get("Body", "").strip().lower()
    sender_number = request.values.get("From", "").replace("whatsapp:", "")
    num_media = int(request.values.get("NumMedia", 0))
    
    response = MessagingResponse()
    
    # -------- FLOW 1: Initial Greeting --------
    if incoming_msg in ["hi", "hello", "start"]:
        farmer_intro = f"""
Welcome to FarmBridge AI! 🌾🙏 

I am your personal agricultural assistant. I can help you with:
1️⃣ Crop Quality Check (Upload photo)
2️⃣ Today's MSP Prices (Type "price")
3️⃣ Direct Buyer Connect (Type "buyers")

What would you like to do today?
"""
        response.message(farmer_intro)
    
    # -------- FLOW 2: Image Upload for Quality Grading --------
    elif num_media > 0:
        media_url = request.values.get("MediaUrl0", "")
        media_type = request.values.get("MediaContentType0", "")
        
        if "image" not in media_type:
            response.message("❌ Please send an image only. Other files are not supported.")
            return str(response)
        
        # Download and encode image
        image_base64 = download_and_encode_image(media_url)
        
        if not image_base64:
            response.message("⚠️ Could not download image. Please try again.")
            return str(response)
        
        # Ask crop type
        reply_msg = """
✅ Image received! Now tell me:

Which crop is this?
- tomato
- potato
- onion
- wheat
- rice

Enter the name:
"""
        # Store image temporarily
        FARMER_DATA[sender_number] = {"image": image_base64, "step": "awaiting_crop"}
        response.message(reply_msg)
    
    # -------- FLOW 3: Get Crop Type & Process --------
    elif sender_number in FARMER_DATA and FARMER_DATA[sender_number].get("step") == "awaiting_crop":
        crop_type = incoming_msg.lower()
        image_base64 = FARMER_DATA[sender_number]["image"]
        
        # AI Grading
        grading = get_ai_grading(image_base64, crop_type)
        
        # Get MSP Data
        msp_info = get_msp_price(crop_type)
        
        # Format Response
        result_message = f"""
🚀 *FarmBridge AI Analysis Report* 🚀
-----------------------------------
📅 Date: {datetime.now().strftime('%d-%b-%Y')}
🌾 Crop: {crop_type.upper()}

📊 *Quality Assessment:*
✅ Grade: *{grading['grade']}*
⭐ Score: {grading['score']}/100
📝 AI Notes: {grading['remarks']}

💰 *Market Pricing (Per kg):*
📉 MSP Price: ₹{msp_info['msp_price']:.2f}
📈 Mandi Rate: ₹{msp_info['mandi_price']:.2f}

🎯 *Direct Buyer Offer (No Middlemen):*
🔥 Grade {grading['grade']} Value: ₹{msp_info['mandi_price'] * 0.9:.2f} - ₹{msp_info['mandi_price']:.2f}

-----------------------------------
👥 Would you like to connect with nearby buyers?
Please enter your *Name* and *Village* to register:
"""
        
        FARMER_DATA[sender_number]["step"] = "awaiting_details"
        FARMER_DATA[sender_number]["grading"] = grading
        FARMER_DATA[sender_number]["msp"] = msp_info
        FARMER_DATA[sender_number]["crop"] = crop_type
        
        response.message(result_message)
    
    # -------- FLOW 4: Seller Details --------
    elif sender_number in FARMER_DATA and FARMER_DATA[sender_number].get("step") == "awaiting_details":
        details = incoming_msg
        
        FARMER_DATA[sender_number]["details"] = details
        FARMER_DATA[sender_number]["step"] = "registered"
        
        confirmation = f"""
✨ Excellent! You are now registered!

📍 Your Details: {details}
🌾 Crop: {FARMER_DATA[sender_number]['crop'].upper()}
📊 Grade: {FARMER_DATA[sender_number]['grading']['grade']}

🔔 Buyers will contact you within the next 24 hours!

❓ What next?
- "price" → Check today's rates
- "buyers" → See list of buyers
- "help" → Get assistance
"""
        response.message(confirmation)
    
    # -------- FLOW 5: Price Query --------
    elif "price" in incoming_msg or "daam" in incoming_msg:
        crop = FARMER_DATA.get(sender_number, {}).get("crop", "tomato")
        msp = get_msp_price(crop)
        
        price_reply = f"""
💰 Today's {crop.upper()} Prices:

MSP (Minimum Support Price): ₹{msp['msp_price']:.2f}/kg
Mandi Rate: ₹{msp['mandi_price']:.2f}/kg

🎯 On FarmBridge you can get: ₹{msp['mandi_price'] * 0.85:.2f} - ₹{msp['mandi_price']:.2f}/kg

(Direct deal, no middleman!)
"""
        response.message(price_reply)
    
    # -------- FLOW 6: Help Menu --------
    elif "help" in incoming_msg or "menu" in incoming_msg:
        help_text = """
📞 FarmBridge Support:

1️⃣ Crop Grading: Send a photo → AI will check it
2️⃣ Check Prices: Type "price"
3️⃣ Find Buyers: Type "buyers"
4️⃣ Ask Questions: Type directly

Questions? Call us: 1234-567-890
"""
        response.message(help_text)
    
    # -------- DEFAULT: Unclear Input --------
    else:
        default = """
❓ I didn't quite get that. Please:

1. Type "hi" - to start
2. Send a photo - for grading
3. Type "help" - for assistance
"""
        response.message(default)
    
    return str(response)


# ============ HEALTH CHECK ============
@app.route("/health", methods=["GET"])
def health():
    return {"status": "FarmBridge WhatsApp Bot is running ✅"}


if __name__ == "__main__":
    app.run(debug=True, port=5000)
