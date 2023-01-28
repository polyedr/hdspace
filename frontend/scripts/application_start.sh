cd /home/auser/adeviio/adeviio-frontend
sudo chmod -R 777 /home/auser/adeviio/adeviio-frontend

npm i --legacy-peer-deps

export NODE_OPTIONS=--max-old-space-size=3072
npm run build:staging

sudo rm -rf /home/auser/adeviio/adeviio-frontend-staging/
sudo cp -r dist/. /home/auser/adeviio/adeviio-frontend-staging

