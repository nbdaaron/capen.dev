# Install backend dependencies
cd backend
npm ci

# Kill existing backend service.
killall node

echo $PRIVKEY > PRIVKEY.VAL
echo $CERT > CERT.VAL

# Start backend service
PRIVKEY=$PRIVKEY CERT=$CERT node index &
