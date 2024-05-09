# Scav-a-Snap

![Scav-A-Snap Poster](Poster.HEIC)

## What is Scav-a-Snap?
Scav-a-Snap is a photo scavenger hunt app for anyone looking for an exciting team-building experience. It provides all ages with enjoyable lasting memories. 

## Using Scav-a-Snap

### As a Photo Scavenger Hunt Host
The first thing a host will do is click on the Host button to navigate to the host page. There they can see the hunts, either those they have created or the default hunts, and any ended hunts. There, the host can also add new hunts by clicking on the + button on the bottom right corner of the page. 
Once that is clicked, the host can make a hunt by inputting the hunt name, a description of the hunt and the estimated time for the hunt to take in minutes, then click add hunt to create the hunt. This will navigate the host to a page where they can add and delete tasks.
From this page, which is also accessible by clicking on any hunts hunt details section from the host page, the host can click to begin the hunt and set a number of teams. There can be up to 20 teams in any hunt, but no more. 
Once that is clicked, it will navigate to a page with a 6 digit access code for the hunter to use to get into the hunt on their end, and a begin hunt button in blue. Once that button is clicked, it navigates to the monitoring hunts page. 
There you can still see the access code and tasks, but you can also see the team names and a progress bar showing how far they are through the tasks. Once the host wants the hunt to be finished they can click the end hunt button.
This takes them to a page where they can see each team and the members in it, as well as the photos each group submitted for each task. This can then be shared with the hunters for a fun recollection event! This page with all photos in it can also be accessed later by clicking on the hunt details of the corresponding ended hunt.

### As a Photo Scavenger Hunter
To begin the hunter journey,  the hunter will want to join as a hunter by clicking the Hunter button, this will allow them to type in the hunter lobby invite code that was shared by the host. After they have joined the hunt lobby with invite code, hunter will be directed to the hunt lobby. Once in the hunt lobby, they can set up their team by naming it and adding or removing members. Clicking "CREATE TEAM" will transition them to the started hunt game.From here, hunter will be prompted to allow camera access. Then all they have to do is click the take picture button for each task. Once a picture is snapped, the task will be marked as completed by turning green. If needed, the hunter have the ability to retake picture by repeating the same process.


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





