# Mascot-api Backend

The back-end project for Mascot-api

## Getting started

### Setting up the project

* Move into your projects directory (optional): `cd ~/YOUR_PROJECTS_DIRECTORY`
* Clone this repository
* Move into the project directory: `cd YOUR_PROJECT_NAME`
* Install the dependencies: `yarn install`

### Working on the project

* Move into the project directory: `cd ~/YOUR_PROJECTS_DIRECTORY/YOUR_PROJECT_NAME`
* Run the development task: `yarn server:local`
    * Starts a server running at http://localhost:3000
    * Automatically restarts when any of your files change
* Alternatively you can use `yarn start` but it will not listen to your changes

## Contributing

### Code
We are currently looking for a good node.js best practices guide, if you want
to suggest any, feel free to do it.

### Workflow

- If developing a new feature, you must create a branch with format:
`feature/<development-feature>/<trello-card-number>`, branching from develop.

GENERAL:
Upload your code, by pulling the develop branch's latest changes with `git pull origin develop`
to your branch, fix conflicts if it's necessary and then push your branch and make the pull-request
to `develop` branch.

Always remember to update the corresponding card in Trello, and reference your
branch from it. Your Pull Request is going to be reviewed and you must merge if it's approved
and then go through QA. If it doesn't pass QA, you need to make the changes 
requested by using the same branch.

### Testing

We use Jest for testing. Don't push code that doesn't have 100% test coverage.
Integration tests are always welcome. Remember to test exceptions and edge cases too!

To run the tests use the `yarn test` command or if you want to watch the changes while coding
use the `yarn test:watch` command.

To run a single test file use the next command:

`yarn test test/controllers/familyGroupsController.test.js`

## Databases

By default, this API is configured to connect to a MongoDB database using Mongoose. You can set the
database, creating a `.env` file in the root of the project and adding the next line of code
`MONGODB_URI=mongodb://localhost/mascot-api` 

## REPL

If you want to check the local scenareo, we provided a REPL (read, evaluate, print loop) instance,
to make it work, you need:

- The `.env` file with the enviroment variable provided before.
- Move to the root of the project `cd ~/YOUR_PROJECTS_DIRECTORY/YOUR_PROJECT_NAME`.
- Run `yarn repl:local`

And an instance of node.js will run, connected to the local mongoose database.


