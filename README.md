# Introduction
This is our second project at IronHack Berlin. The task was to create a full stack web application using Express and Mongoose to demonstrate knowledge about CRUD operations and queries. 

Our project is a gallery of games created by our classmates at IronHack. We wanted to have a nice, stylish dark theme, an intuitive UI allowing the users to easily register, add their games and check out other user's games and github accounts.

# Installation

After you clone the repo you need to install all the dependencies.

```bash
run npm i
```

Then you'll need a .env file containing the following variables

```
PORT=
MONGODB_URI=
SESSION_SECRET=
CLOUD_NAME=
API_KEY=
API_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```
If you don't specify a port the app will run on port 3000.If you don't specify MONGODB_URI the app will connect to a local database. SESSION SECRET is needed for express-sessions to hold user's sessions. CLOUD_NAME,API_KEY,API_SECRET are necessary for Cloudinary image uploader to work properly.  GITHUB_ID and GITHUB_SECRET are the OAuth credentials you take from your GitHub account. Don't forget also to replace your callback URL in app.js.

To run the app through nodemon for developing use:

```bash
run npm dev
```

Otherwise you can simply run 

```bash
run npm start
```

# Using the app

The app contains the following pages

| Page   | URL     | Description |
| ------ | ------- | ----------- |
| HOME   | /       | Homepage of the website    |
| SIGNUP | /auth/signup | Singing up page |
| LOGIN   | /auth/login       | Logging in page    |
| GITHUB LOGIN   | /auth/github       | Logging in with GitHub accounts    |
| GAMES | /games | Shows all games |
| ADD A GAME   | /games/add       | Add a game    |
| DETAILS OF A GAME   | /games/:id/     | Show details of a game    |
| EDIT A GAME | /games/:id/edit | Editing a game |
| DELETE A GAME | /games/:id/delete | Deletes a game |
| DASHBOARD | /dashboard | Your profile dashboard |
| OTHER USERS DASHBOARDS   | /dashboard/:profileid       | Other Uses's dashboard    |
| EDIT YOUR ACCOUNT | /dashboard/:id/edit | Edit your account information |

For signing up a username and password are required both 6 characters or more. You can also login with your GitHub account and an account is set up for you.

Routes are protected as follows:


| Page   | Protected |
| ------ | ------- | 
| Adding a game   | Logged in user |
| Viewing details of a game   | No |
| Leaving a review   | No |
| Editing a game   | Only user who added the game |
| Deleting a game   | Only user who added the game |
| Seeing a user's dashboard   | No |
| Editing a user's dashboard   | Only own user |
| Seeing a user's dashboard   | No |


