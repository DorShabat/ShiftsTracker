# how to work with git
## undo changes 
```bash
git reset --hard HEAD
```
## commit and push
```bash
git add .
git commit -m "message"
git push orgin master 
```

## deploy to github pages
```bash
npm run deploy
```
if working on a new computer you need to install gh-pages
```bash
npm install --save-dev gh-pages
```

# `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# `npm run deploy`
**in order to do deploy we need to**
**npm install --save-dev gh-pages**s

Deploys the app to GitHub Pages




# deploy into firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
```

# `firebase deploy`
Deploy the app to firebase
```bash
npm build
firebase deploy
```

To enable script execution policy for running Firebase commands, run the following command in PowerShell:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

