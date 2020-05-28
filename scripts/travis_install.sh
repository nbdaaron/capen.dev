# Abort on any error
set -e

# Install Frontend Dependencies
cd frontend
npm ci

# Return to root directory
cd ..
