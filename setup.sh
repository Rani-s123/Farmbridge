#!/bin/bash

# FarmBridge Setup Script
# Run: bash setup.sh

echo "🌾 FarmBridge Setup Script"
echo "=========================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.9+"
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "✅ Virtual environment created"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "✅ Dependencies installed"
echo ""

# Create .env file
echo "🔐 Setting up environment variables..."
cat > .env << 'EOF'
# Get these from Twilio Console
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1234567890

# Get this from OpenAI Platform
OPENAI_API_KEY=sk-your-openai-key

# Optional: Database
# DATABASE_URL=postgresql://user:pass@localhost/farmbridge

# Environment
FLASK_ENV=development
DEBUG=True
EOF

echo "✅ .env file created"
echo ""
echo "📝 Edit .env with your credentials:"
echo "   - Twilio: https://console.twilio.com"
echo "   - OpenAI: https://platform.openai.com/api-keys"
echo ""

# Create test script
cat > test_bot.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing FarmBridge Bot..."
curl -X GET http://localhost:5000/health
EOF

chmod +x test_bot.sh

echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "   1. Edit .env with your Twilio & OpenAI credentials"
echo "   2. Run: python farmbrige_whatsapp_bot.py"
echo "   3. In another terminal: bash test_bot.sh"
echo "   4. For public access: npm install -g ngrok && ngrok http 5000"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Overview"
echo "   - DEPLOYMENT_GUIDE.md - Production setup"
echo ""
