# messenger

Local Environment Setup:
 - see the config example in .env.example
 - create a new .env file and put ENV variables names from .env.example to .env
 - ask 1lyan for values of those variables

To start application locally:

1. npm install
2. Create DB: npx sequelize-cli db:create
3. Run migrations: 
 - DATABASE_URL="postgres://postgres@localhost:5432/messenger_development" npm run migrate:up
3. npm run dev
4. http://localhost:3000

# How to create a Pull Request:
0. Switch back to main branch: git checkout main
1. Pull from main branch: git pull origin main
2. Create a new branch: git checkout -b new-branch
3. git add .
4. git commit -m "Here goes your comment"
5. (Optional) git rebase -i main
6. (Optional) In vim: "shift + :"
7. (Optional) wq + enter
8. git push origin new-branch
9. Now go to github and create a Pull Request
10. Merge PR to main branch
11. Go to your console and delete the obsolete branch:
 - git branch -D new-branch

# How to run tests in console:
 - npm run test

# Heroku instance:
 - https://m3ss3nger.herokuapp.com/

# WebSocket transport repo:
 - https://github.com/1lyan/chat-transport