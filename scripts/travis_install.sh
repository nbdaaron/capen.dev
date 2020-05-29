# Abort on any error
set -e

# Install Frontend Dependencies
cd frontend
npm ci

# Return to root directory
cd ..

# Install Backend Dependencies
cd backend
npm ci

# Return to root directory
cd ..
