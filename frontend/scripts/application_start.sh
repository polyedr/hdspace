cd /home/auser/adeviio/adeviio-frontend

npm i
npm run build:staging

sudo rm -rf /home/auser/adeviio/adeviio-frontend-staging/
sudo cp -r dist/. /home/auser/adeviio/adeviio-frontend-staging

