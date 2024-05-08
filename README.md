# Scav-a-Snap

## What is Scav-a-Snap?
Scav-a-Snap is a photo scavenger hunt app for anyone looking for an exciting team-building experience. It provides all ages with enjoyable lasting memories. 

## Using Scav-a-Snap


## Project Description:
* **Languages used:** Typescript, Java, HTML and SCSS
* **Services Used:** MongoDB and Digital Ocean
* **Frameworks:** Angular 17 and Javalin
* **Testing software:** Karma, Cypress, and GitHub Actions

## [Technical Document](DEPLOYMENT.md)

A document decribing the technical apsects of the project.

## [To-Do List](TO-DO-LIST.md)

List of known bugs and potential areas for improvment.


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
