npm ci
npm run build

# Kill existing web server if running
killall node

serve -s build -l 5241 &
