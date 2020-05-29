# Install backend dependencies
cd /home/ec2-user/capen/backend
/home/ec2-user/.nvm/versions/node/v14.3.0/bin/npm ci

# Kill existing backend service.
killall node

# Start backend service
NODE_ENV=production /home/ec2-user/.nvm/versions/node/v14.3.0/bin/node index &
