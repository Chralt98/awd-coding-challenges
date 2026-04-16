/*
You want to show your users which of their friends are online and available to chat!

Input:
[
  {
    username: 'David',
    status: 'online',
    lastActivity: 10
  },
  {
    username: 'Lucy',
    status: 'offline',
    lastActivity: 22
  },
  {
    username: 'Bob',
    status: 'online',
    lastActivity: 104
  }
]

Expected Output:
{
  online: [
    'David'
  ],
  offline: [
    'Lucy'
  ],
  away: [
    'Bob'
  ]
}

Example:

no users are online

{
  offline: ['Lucy'],
  away: ['Bob']
}
*/

enum UserStatus {
  "online",
  "offline",
}

interface UserInfo {
  username: string;
  status: UserStatus;
  lastActivity: number;
}

interface StatusLists {
  online: string[] | null;
  offline: string[] | null;
  away: string[] | null;
}

/*
A function to work out who is online, offline and away.

- if someone is online but their lastActivity was more than 10 minutes ago they are to be considered away
- lastActivity is a number greater or equal to 0 and it is in minutes
- status is either 'online' or 'offline'
- if no friends, the input is an empty array and the expected output should be an empty object
*/
function userStatus(userInfo: UserInfo[]): StatusLists {
  if (!userInfo) return {} as StatusLists;
  let statusLists: StatusLists = {
    online: null,
    offline: null,
    away: null,
  };
  userInfo.forEach((i) => {
    if (i.lastActivity < 0)
      throw new Error(
        `lastActivity ${i.lastActivity} is not greater than or equal to zero`,
      );
    if (i.status === UserStatus.online) {
      if (i.lastActivity > 10) {
        if (!statusLists.away) statusLists.away = [];
        statusLists.away.push(i.username);
      } else {
        if (!statusLists.online) statusLists.online = [];
        statusLists.online.push(i.username);
      }
    } else {
      if (!statusLists.offline) statusLists.offline = [];
      statusLists.offline.push(i.username);
    }
  });
  return statusLists;
}

const example1 = userStatus([
  {
    username: "David",
    status: UserStatus.online,
    lastActivity: 10,
  },
  {
    username: "Lucy",
    status: UserStatus.offline,
    lastActivity: 22,
  },
  {
    username: "Bob",
    status: UserStatus.online,
    lastActivity: 104,
  },
]);
console.log(example1);

const example2 = userStatus([
  {
    username: "David",
    status: UserStatus.offline,
    lastActivity: 10,
  },
  {
    username: "Lucy",
    status: UserStatus.offline,
    lastActivity: 22,
  },
  {
    username: "Bob",
    status: UserStatus.online,
    lastActivity: 104,
  },
]);
console.log(example2);
