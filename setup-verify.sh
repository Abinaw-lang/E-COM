#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     E-Commerce Application - Setup Verification Script     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}[1/8]${NC} Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js is installed: ${NODE_VERSION}"
else
    echo -e "${RED}✗${NC} Node.js is not installed. Please install Node.js v16+"
    exit 1
fi

# Check npm
echo -e "${YELLOW}[2/8]${NC} Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm is installed: v${NPM_VERSION}"
else
    echo -e "${RED}✗${NC} npm is not installed"
    exit 1
fi

# Check Git
echo -e "${YELLOW}[3/8]${NC} Checking Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓${NC} Git is installed: ${GIT_VERSION}"
else
    echo -e "${RED}✗${NC} Git is not installed"
fi

# Check Backend .env
echo -e "${YELLOW}[4/8]${NC} Checking Backend configuration..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
    
    # Check required variables
    REQUIRED_VARS=("MONGODB_URI" "JWT_SECRET" "RAZORPAY_KEY_ID" "RAZORPAY_KEY_SECRET")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" backend/.env; then
            VALUE=$(grep "^${var}=" backend/.env | cut -d '=' -f 2)
            if [ -n "$VALUE" ] && [ "$VALUE" != "your_"* ]; then
                echo -e "  ${GREEN}✓${NC} ${var} is configured"
            else
                echo -e "  ${YELLOW}⚠${NC} ${var} is empty or not configured"
            fi
        else
            echo -e "  ${RED}✗${NC} ${var} is missing from .env"
        fi
    done
else
    echo -e "${RED}✗${NC} Backend .env file not found. Run: cp backend/.env.example backend/.env"
fi

# Check Frontend .env
echo -e "${YELLOW}[5/8]${NC} Checking Frontend configuration..."
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env file exists"
    
    if grep -q "^VITE_API_URL=" frontend/.env; then
        echo -e "  ${GREEN}✓${NC} VITE_API_URL is configured"
    else
        echo -e "  ${RED}✗${NC} VITE_API_URL is missing"
    fi
else
    echo -e "${RED}✗${NC} Frontend .env file not found. Run: cp frontend/.env.example frontend/.env"
fi

# Check Backend dependencies
echo -e "${YELLOW}[6/8]${NC} Checking Backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies are installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed. Run: cd backend && npm install"
fi

# Check Frontend dependencies
echo -e "${YELLOW}[7/8]${NC} Checking Frontend dependencies..."
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies are installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed. Run: cd frontend && npm install"
fi

# Check Port availability (optional)
echo -e "${YELLOW}[8/8]${NC} Checking Port availability..."
if command -v lsof &> /dev/null; then
    if ! lsof -i :5000 &> /dev/null; then
        echo -e "${GREEN}✓${NC} Port 5000 is available for Backend"
    else
        echo -e "${YELLOW}⚠${NC} Port 5000 is already in use"
    fi
    
    if ! lsof -i :5173 &> /dev/null; then
        echo -e "${GREEN}✓${NC} Port 5173 is available for Frontend"
    else
        echo -e "${YELLOW}⚠${NC} Port 5173 is already in use"
    fi
else
    echo -e "${YELLOW}⚠${NC} Cannot check port availability (lsof not found)"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   Verification Complete                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "Next Steps:"
echo "1. Ensure all environment variables are configured in .env files"
echo "2. Start Backend:   cd backend && npm run dev"
echo "3. Start Frontend:  cd frontend && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "For detailed setup instructions, see QUICKSTART.md"
