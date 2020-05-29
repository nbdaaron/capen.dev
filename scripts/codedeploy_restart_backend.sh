# Install backend dependencies
cd /home/ec2-user/capen/backend
/home/ec2-user/.nvm/versions/node/v14.3.0/bin/npm ci

# Kill existing backend service.
killall node

# Start backend service
/home/ec2-user/.nvm/versions/node/v14.3.0/bin/node NODE_ENV=production index &
