# Project Setup Guidline

To start project on your local machine first clone the repo and go to the project directory.

You have to use **nodejs v12.18.3** (lts at the moment).

Run `npm install` to install all necessary dependencies.

Then run `npm rebuild node-sass` to download the binding for your current environment.

Now you can start the project.

Available scripts:

##### `npm run start`
Runs the app in the development mode.<br /> 
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

Now 2 build we create which is staging & production.


##### `npm run build`

npm run build:staging
npm run build:production

Builds the app for production to the `dist` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified.<br />
Your app is ready to be deployed!

#Code commit relted notes : 

Now when you commit your code run this 2 command so PR create time build not failed.

##### `npm run test`
Launches the test runner. <br />

##### `npm run lint`
Launches the linter with `--fix` flag, so it will try to resolve all issues.


We are using pre-commit hooks that will launch `npm run lint` script for files added to commit.<br />
Also it will launch TS compiler to check all project files before a commit.<br />
Your commit will be rejected if some of these tasks fail.<br />
If you want to commit files without pre-commit check use `--no-verify` flag while committing..

# pm-tools

Sidebar where you can:

- Write messages (Zulip chat)
- See the history of actions
- Assign tasks (Trello)
- Manage a team

# development

[src/components/Sidebar] - UI for Pm-Tools
[src/api/pmtools] - api
[src/redux/pmtools] - redux part
[src/types/pmtools] - types

# features

- Redux-Saga
- TypeScript
- Redux
- React
- Http - fetch

Every time we log in to zalip chat, we send a request for access =>
**The configuration file will help you to enter the chat - [src/constants/pmtools/zulipChatLoginData.ts]**
**And zulip - [src/constants/pmtools/trelloConfigData.ts]**

**To add a new tab, see the directory -[src/constants/pmtools/tabsNamesSidebar.ts]**
