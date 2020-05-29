# Abort on any error
set -e

# Test frontend code
cd frontend
npm test
npx eslint src
npx prettier src --check

# Return to root directory
cd ..

# Test backend code
cd backend
npm test
npx eslint .
npx prettier . --check

# Return to root directory
cd ..
