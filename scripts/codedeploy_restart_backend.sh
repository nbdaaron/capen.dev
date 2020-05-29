# Install backend dependencies
cd backend
npm ci

# Kill existing backend service.
killall node

pwd > /home/ec2-user/PWD.VAL
echo $PRIVKEY > /home/ec2-user/PRIVKEY.VAL
echo $CERT > /home/ec2-user/CERT.VAL

# Start backend service
PRIVKEY=$PRIVKEY CERT=$CERT node index &
