npm ci
npm run build

# Kill existing web server if running
killall node

serve -s /home/ec2-user/capen/frontend/build -l 5241 &
