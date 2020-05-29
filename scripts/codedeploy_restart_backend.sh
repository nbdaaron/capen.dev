# Install backend dependencies
cd backend
npm ci

# Kill existing backend service.
killall node

# Start backend service
node index
