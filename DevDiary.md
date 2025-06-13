## Day Nr. X - [Date]
            - ✅ What I worked on today:
            - 💡 Biggest learning:
            - ❌ Biggest mistake/blocker:
            - 📌 Notes for tomorrow:

## Day Nr. 1 - [June 8th, 2025]
            - ✅ What I worked on today: creating the Visual Prototype based on my first design mockups in Figma, creating all necessary components and figuring out how to structure the frontend.
            - 💡 Biggest learning: Components are necessary for effective workflow
            - ❌ Biggest mistake/blocker: thinking I could do it faster without components and then having to start over :(
            - 📌 Notes for tomorrow: finish the Prototype!

## Day Nr. 2 - [June 9th, 2025]
            - ✅ What I worked on today: finishing the Figma prototype!;csetting up the GitLab repository, creating a new react-vite project; setting up the database, connecting to the database; testing backend and frontend with the Socials.js Page, which displays the users I input to the inkforge_users datatable
            - 💡 Biggest learning: how to run the backend and frontend at the same time and how to connect the two (making two separate directories and deploying them in two separate terminals)
            - ❌ Biggest mistake/blocker: forgetting to put something in the index.html and wondering why nothing was being displayed for a solid hour...
            - 📌 Notes for tomorrow: creating the projects datatable and then getting started on the frontend (components, navigating, interactions, styling, etc...)

## Day Nr. 3 - [June 10th]
            - ✅ What I worked on today: finish the figma prototype; routes for "/", "/login" and "/socials", try to figure out the login functionality. managed to fix login functionality late at night :D
            - 💡 Biggest learning: how to navigate folders
            - ❌ Biggest mistake/blocker: not being able to figure out how to do login. i was trying to stitch together FWOC and SSC but i was unsuccessful and wasted about 3 hours on login.
            - 📌 Notes for tomorrow: make header with login and logout buttons

## Day Nr. 4 - [June 11th]
            - ✅ What I worked on today: created the header component with login and logout buttons, implemented admin authorization and added the ability to register users. added dropdown to profile button in header that allows you to view your profile or log out when logged in, and allows you to login or register when not logged in. added userdetail page, profile page that displays details of logged in user, added protected routes.
            - 💡 Biggest learning: how to properly work with routes  and methods (this time, will probably have to relearn it a bunch more times)
            - ❌ Biggest mistake/blocker: confusing routes (/inkforge_users vs /users) stitching together code and trying to make it work; typos, not importing things the right way (require vs import)
            - 📌 Notes for tomorrow: automatically log in after registration, delete and update users (either admin and the logged in user can edit/delete their profile, nobody else); maybe get started on projects datatable and frontend :>

## Day Nr. 5 - [June 12th]
            - ✅ What I worked on today: automatically log in after registration, update user when you're logged in with that user or as admin, delete user (your own profile, or as admin any profile), set up projects datatable and crud for projects. implement password hashing with bcryptjs and update all exisiting users to have hashed passwords (via admin). Characters datatable and crud for characters. Also created datatables settings, story_segments and character_relations, but not yet implemented any functionality for them. chracters are linked to projects, so the character routes is /projects/:projectId/characters. added checks for character CRUD so that only the owner of the project can create, update or delete characters. got started on segment backend functionality.
            - 💡 Biggest learning: that postman saves so much time, how cool controller are
            - ❌ Biggest mistake/blocker: i should have used postman from the start, i wasted so much time trying to figure out how to do it in the browser;
            - 📌 Notes for tomorrow: rewrite user CRUD to be in controller; add authorization to project crud (only logged in users can create, update, delete their own projects); settings crud, story segments crud + authorization.

## Day Nr. 6 - [June 13th]
            - ✅ What I worked on today: modular settings crud, insert empty settings row when creating a new project, story segments crud, character_relationships crud, add authorization to project, settings and segments authorization (only logged in users can create, update, delete their own projects), rewrite user management logic from userRoutes to userController. implemented backend picture upload for users, characters and projects with restrictions (logged in users can upload pictures, only for their own profile, characters and projects).
            - 💡 Biggest learning: to check the exact path in postman before spending an hour debugging something that would have worked first try
            - ❌ Biggest mistake/blocker: wasting time testing the wrong path in postman, not checking the exact path and then wondering why it didn't work. trying to work out something over-engineered instead of just using a simple solution.
            - 📌 Notes for tomorrow: for projects, if no picture is uploaded, choose color; clean up, start thinking about frontend, maybe start on it