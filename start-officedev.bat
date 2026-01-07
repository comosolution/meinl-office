@echo off
cd /d C:\inetpub\officedev.meinl.loc

set NODE_OPTIONS=--use-system-ca
npm run start -- --port 3000
