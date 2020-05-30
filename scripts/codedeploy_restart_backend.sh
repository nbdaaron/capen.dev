# Add EC2 npm and node to PATH.
PATH=$PATH:/home/ec2-user/.nvm/versions/node/v14.3.0/bin

# take ownership of codedeploy resources
chown -R ec2-user /home/ec2-user/capen/

# Install backend dependencies
cd /home/ec2-user/capen/backend
npm ci

# Kill existing backend service.
killall node

# Start backend service
NODE_ENV=production nohup node index >> /home/ec2-user/backend_logs.txt 2>&1 &
