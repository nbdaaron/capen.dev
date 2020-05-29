# Install backend dependencies
cd backend
npm ci

# Kill existing backend service.
killall node

# Start backend service
PRIVKEY=$PRIVKEY CERT=$CERT node index &
