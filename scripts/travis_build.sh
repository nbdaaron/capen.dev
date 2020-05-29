# Abort on any error
set -e

# Build Frontend Code
cd frontend
npm run build

# Return to root directory
cd ..

# Remove node_modules from deployment
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Package files together to upload to S3
zip -r latest *
mkdir -p dpl_cd_upload
mv latest.zip dpl_cd_upload/latest.zip
