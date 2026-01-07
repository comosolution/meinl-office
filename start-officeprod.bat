@echo off
cd /d C:\inetpub\office.meinl.loc

set NODE_OPTIONS=--use-system-ca
npm run start -- --port 3000
