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
