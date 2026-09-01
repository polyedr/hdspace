# Project Setup Guidline

To start project on your local machine first clone the repo and go to the project directory.

Project tested with **nodejs v16.19.0** (lts at the moment).

Run `npm install` to install all necessary dependencies.

To enable legacy dependencies run npm config set `legacy-peer-deps true`

Now you can start the project.

Available scripts:

##### `npm run dev`
Runs the app in the development mode.<br /> 
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

Now 2 build we create which is staging & production.

##### `npm run build:staging`
##### `npm run build:production`


Build saved in `dist` directory.<br /> Now your app is ready to be deployed!

# Code commit relted notes : 

Now before commit your code run this 2 command so PR create time build not failed in bitbucket.
##### `npm run test`
Launches the test runner. <br />

##### `npm run lint:fix`
Launches the linter with `--fix` flag, so it will try to resolve all issues.


We are using pre-commit hooks that will launch `npm run lint` script for files added to commit.<br />
Also it will launch TS compiler to check all project files before a commit.<br />
Your commit will be rejected if some of these tasks fail.<br />
If you want to commit files without pre-commit check use `--no-verify` flag while committing..

# PM-Tools

Sidebar where you can:

- Write messages (Zulip chat)
- See the history of actions
- Assign tasks (Trello)
- Manage a team

# Development

[src/components/Sidebar] - UI for Pm-Tools
[src/api/pmtools] - api
[src/redux/pmtools] - redux part
[src/types/pmtools] - types

# Features

- Redux-Saga
- TypeScript
- Redux
- React
- Http - fetch

Every time we log in to zalip chat, we send a request for access =>
**The configuration file will help you to enter the chat - [src/constants/pmtools/zulipChatLoginData.ts]** <br>
**And zulip - [src/constants/pmtools/trelloConfigData.ts]**

**To add a new tab, see the directory -[src/constants/pmtools/tabsNamesSidebar.ts]**
