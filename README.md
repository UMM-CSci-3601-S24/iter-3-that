# Scav-a-Snap

## What is Scav-a-Snap?
Scav-a-Snap is a photo scavenger hunt app for anyone looking for an exciting team-building experience. It provides all ages with enjoyable lasting memories. 

Scav-a-Snap gives users the opportunity to create and host personalized hunts for a group of hunters. A hunt consists of a title, description, estimated time, and tasks. Once a hunt is created, the host can edit the title, description, and estimated time. There is also the functionality of adding and removing tasks. When a host creates a hunt, that hunt is a part of their profile and will be available for them to use as many times as they want and can also be deleted if desired.

Once a host choses the number of teams they would like to participate, they may begin a hunt. A started hunt will have a unique access code that hunters may use to join the hunt. By entering the access code, a hunter will be able to create a team and add all members to the team. Only one device can be used for each team of hunters.

After joining the hunt, each team can complete tasks by capturing pictures of specific items or locations. The host can track the progress the teams are making and have the option to end the hunt whenever they would like. When the hunt ends, the host can view the hunt at any time by selecting it on their profile page. They can view all the photos submitted for each task with captions labeling what team took what photo. 

## Project Description:
* **Languages used:** Typescript, Java, HTML and SCSS
* **Services Used:** MongoDB and Digital Ocean
* **Frameworks:** Angular 17 and Javalin
* **Testing software:** Karma, Cypress, and GitHub Actions

## [Technical Document](DEPLOYMENT.md)

A document decribing the technical apsects of the project.

## [Development Instructions](DEVELOPMENT.md)

Instructions for running and testing the project. 

### Common commands

From the `server` directory:

- `./gradlew run` to start the server
- `./gradlew test` to test the server
- `./gradlew checkstyleMain` to run Checkstyle on the server Java code in the `src/main` folder
- `./gradlew checkstyleTest` to run Checkstyle on the server Java code in the `src/test` folder
- `./gradlew check` will run the tests, run the Checkstyle checks, and generate coverage reports in one command

From the `client` directory:

- `ng serve` to run the client
- `ng test` to test the client
  - Or `ng test --no-watch --code-coverage` to run the client tests once and
    also compute the code coverage.
- `ng e2e` and `ng e2e --watch` to run end-to-end tests

From the `database` directory:

- `./mongoseed.sh` (or `.\mongoseed.bat` on Windows) to seed the database

## Contributers 

All who contributed to this project can be seen [here](../../graphs/contributors).
