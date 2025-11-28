#!/bin/bash

# only works on Linux btw if you use windows i don't know how to setup sorry
echo "starting API"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}Python detected${NC}"

if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment${NC}"
    python3 -m venv venv
fi

echo -e "${YELLOW}Activating virtual environment${NC}"
source venv/bin/activate

echo -e "${YELLOW}Installing dependencies${NC}"
pip install -q --upgrade pip
pip install -q fastapi uvicorn httpx python-dotenv PyPDF2 pydantic python-multipart

echo -e "${YELLOW}Creating package structure${NC}"
touch app/__init__.py
touch app/routes/__init__.py
touch app/services/__init__.py

if [ ! -f ".env" ]; then
    echo -e "${RED}.env file not found${NC}"
    echo -e "${YELLOW}Creating a template .env file${NC}"
    echo "DEEPSEEK_API_KEY=your_api_key_here" > .env
    echo -e "${YELLOW}Don't forget to add your API key in the .env file${NC}"
    echo ""
fi

echo -e "${GREEN}✓ Setup complete${NC}"
echo ""
echo -e "${GREEN}API running at http://localhost:8000${NC}"
echo -e "${GREEN}Documentation at http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl + C to stop the server${NC}"
echo ""

python3 run.py