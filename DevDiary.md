# Dev Diary for the CCL2, by Johanna Mayr

## Day Nr. 1 - June 8th, 2025
- ✅ What I worked on today: creating the Visual Prototype based on my first design mockups in Figma, creating all necessary components and figuring out how to structure the frontend.
- 💡 Biggest learning: Components are necessary for effective workflow
- ❌ Biggest mistake/blocker: thinking I could do it faster without components and then having to start over :(
 - 📌 Notes for tomorrow: finish the Prototype!

## Day Nr. 2 - June 9th, 2025
- ✅ What I worked on today: finishing the Figma prototype!; setting up the GitLab repository, creating a new react-vite project; setting up the database, connecting to the database; testing backend and frontend with the Socials.js Page, which displays the users I input to the inkforge_users datatable
- 💡 Biggest learning: how to run the backend and frontend at the same time and how to connect the two (making two separate directories and deploying them in two separate terminals)
- ❌ Biggest mistake/blocker: forgetting to put something in the index.html and wondering why nothing was being displayed for a solid hour...
- 📌 Notes for tomorrow: creating the projects datatable and then getting started on the frontend (components, navigating, interactions, styling, etc...)

## Day Nr. 3 - June 10th
- ✅ What I worked on today: finish the figma prototype; routes for "/", "/login" and "/socials", try to figure out the login functionality. managed to fix login functionality late at night :D
- 💡 Biggest learning: how to navigate folders
- ❌ Biggest mistake/blocker: not being able to figure out how to do login. i was trying to stitch together FWOC and SSC but i was unsuccessful and wasted about 3 hours on login.
- 📌 Notes for tomorrow: make header with login and logout buttons

## Day Nr. 4 - June 11th
- ✅ What I worked on today: created the header component with login and logout buttons, implemented admin authorization and added the ability to register users. added dropdown to profile button in header that allows you to view your profile or log out when logged in, and allows you to login or register when not logged in. added userdetail page, profile page that displays details of logged in user, added protected routes.
- 💡 Biggest learning: how to properly work with routes  and methods (this time, will probably have to relearn it a bunch more times)
- ❌ Biggest mistake/blocker: confusing routes (/inkforge_users vs /users) stitching together code and trying to make it work; typos, not importing things the right way (require vs import)
- 📌 Notes for tomorrow: automatically log in after registration, delete and update users (either admin and the logged in user can edit/delete their profile, nobody else); maybe get started on projects datatable and frontend :>

## Day Nr. 5 - June 12th
- ✅ What I worked on today: automatically log in after registration, update user when you're logged in with that user or as admin, delete user (your own profile, or as admin any profile), set up projects datatable and crud for projects. implement password hashing with bcryptjs and update all exisiting users to have hashed passwords (via admin). Characters datatable and crud for characters. Also created datatables settings, story_segments and character_relations, but not yet implemented any functionality for them. chracters are linked to projects, so the character routes is /projects/:projectId/characters. added checks for character CRUD so that only the owner of the project can create, update or delete characters. got started on segment backend functionality.
- 💡 Biggest learning: that postman saves so much time, how cool controller are
- ❌ Biggest mistake/blocker: i should have used postman from the start, i wasted so much time trying to figure out how to do it in the browser;
- 📌 Notes for tomorrow: rewrite user CRUD to be in controller; add authorization to project crud (only logged in users can create, update, delete their own projects); settings crud, story segments crud + authorization.

## Day Nr. 6 - June 13th
- ✅ What I worked on today: modular settings crud, insert empty settings row when creating a new project, story segments crud, character_relationships crud, add authorization to project, settings and segments authorization (only logged in users can create, update, delete their own projects), rewrite user management logic from userRoutes to userController. implemented backend picture upload for users, characters and projects with restrictions (logged in users can upload pictures, only for their own profile, characters and projects). tested cascading deletion for projects.
- 💡 Biggest learning: to check the exact path in postman before spending an hour debugging something that would have worked first try
- ❌ Biggest mistake/blocker: wasting time testing the wrong path in postman, not checking the exact path and then wondering why it didn't work. trying to work out something over-engineered instead of just using a simple solution.
- 📌 Notes for tomorrow: for projects, if no picture is uploaded, choose color; clean up, start thinking about frontend, maybe start on it

## Day Nr. 7 - June 15th
- ✅ What I worked on today: fixed updateUser logic, so users can't update their email to an already registered email, optimized error handling for updateUser; started working of Doc for easier testing; adjusted getAllProjects to not require authentication, added filtering to getAllProject, so you can filter for public projects; ProjectDetail view for own projects and public projects, sidebar for navigation of project sections; reworked header; removed bootstrap classes and replaced them with custom CSS; pages/components for project sections, ended up rewriting code to use one modular ProjectDetail component for both owned and public projects; added character detail view
- 💡 Biggest learning: idk man 
- ❌ Biggest mistake/blocker: tired and headache
- 📌 Notes for tomorrow: continue working on project detail view, implement CRUD for projects, characters, worldbuilding, story segments

## Day Nr. 8 - June 16th
- ✅ What I worked on today: fix frontend paths after character details view and sidebar, sections with data for project detail view (overview, characters, worldbuilding, story segments, analytics), implemented character detail view with sidebar navigation; CRUD for projects and characters; Crud for settings and story segments; reading character relationships from backend and displaying them in character detail view; adjusted routes so not-logged-in users can see all public project details (charactes, segments, etc...), also fetch name for character relation and display instead of id; character relationship CRUD;
- 💡 Biggest learning: to properly read through my code and the variables before sending ti to chatgpt 5 times, most times i just misspelled a variable or didn't use the right one
- ❌ Biggest mistake/blocker: unmatched parameters for apiservice file functions; weird errors for story segemtns (that just disappeared??), headache
- 📌 Notes for tomorrow: remove editing buttons on explore projects, optimize error handling, no more errors in console but feedback for uers (when reasonable), get started on styling, statistics on overview page; PICTURE UPLOAD?!

## Day Nr. 9 - June 17th
- ✅ What I worked on today: just the picture upload. goddamn. that was such a pain. also some styling
- 💡 Biggest learning: to not give up hope. something about files but tbh im not sure anymore my brain is fried.
- ❌ Biggest mistake/blocker: everything. the picture upload was such a complicated thing for some reason. i've debugged so much and reverted so many things that i dont even know how it's working, but i'm not touching it anymore, otherwise it will all break again.
- 📌 Notes for tomorrow: styling🥀

## Day Nr. 10 - June 18th
- ✅ What I worked on today: selections for project creation (category and genre), campus cloud (took all day)
- 💡 Biggest learning: that campus cloud is a bitch
- ❌ Biggest mistake/blocker: campus cloud
- 📌 Notes for tomorrow: do the styling

## Day Nr. 11 - June 19th
- ✅ What I worked on today: styling, minor bug fixes and improvements, presentation
- 📌 Notes for tomorrow: presentation!!

## Day Nr. 12 - June 25th
- ✅ What I worked on today: go through project and feedback and make list of things to improve (TODO list), start working on the list
- 📌 Notes for tomorrow: continue working on list :>

## Day Nr. 13 - June 26th
- ✅ What I worked on today: fix styling for headlines and form field that portrude container, make cards clickable instead of "view" button, profile component: fix profile picture, make email unique in db config, fix db config, make pool instead, make character cards clickable, breadcrumb mock path buttons for navigating through project sections and back to projects, footer
- 💡 Biggest learning: to not overengineer things, sometimes a simple solution is the best one (f.e. breadcrumbs)
- ❌ Biggest mistake/blocker: css, profile picutre, divs in divs in divs in divs (but it's the only way I could make it work)
- 📌 Notes for tomorrow: finish up and get started on develpment documentation

## Day Nr. 14 - June 27th
- ✅ What I worked on today: second admin for miachel, look into WCAG and try to meet level A, analytics accessibility (took the most time, still doesn't work the way I want to, but apparently it's impossible to make a hidden element part of the normal document flow (screen-reader-only content)), test all pages with lighthouse and adjust colors, tidy styling a bit more, add comments, upload again on campus cloud, write development documentation
- 💡 Biggest learning: I should have started with the accessibility from the beginning, it would have saved me so much time.
- ❌ Biggest mistake/blocker: the accessibility for the character graph, I wanted the description to be visually hidden, but read aloud by the screen reader when going through the whole page, but it was impossible, because the screen reader doesn't read hidden elements, so I had to make it visible, but now it is not visually hidden anymore.
- 📌 Notes for tomorrow: sleep
- 
## Final Personal Reflection

### 1. What worked well for me during the CCL:
I want to say at some point time-management, because I did work my usual 20hrs during these two weeks, or 30, if you count the last week, too. But that doesn't mean I enjoyed working AND CCL, it actually sucked a lot. 

What actually worked pretty well was establishing what I wanted the end product to be like, and then figuring out the necessary steps. I'm a bit amazed that it is very close to my visual prototype, even though some parts are different, due to accessibility reasons and time constraints.

I'd also say that generally all parts concerning back-end went relatively smoothly (compared to front-end). Doesn't mean the backend is perfect, but I had a lot more fun coding that part than the front-end. Also Postman is great. I love Postman.

### 2. What were my biggest challenges or struggles:

Again, time-management. It was both a success and a struggle. This really made me want to quit my job, but it was also a valuable lesson. I learned that maybe next semester I should try to move around my shifts, instead of trying to work through everything normally.

I also felt like giving up a lot of times, after losing track of how many changes/suggestions to an error/bug I've tried and then really having no idea what my code is anymore. Made me really conscious of GIT-committing the SECOND something works even remotely. And also sometimes stepping away from the code saved me from completely losing it.

To be more specific, the biggest struggles were the picture upload, campus cloud and the accessbility for the graph. I spent so much time on these things and  a lot of this time was actually wasted, because I had to start over or just accept that my desired implementation isn't going to work in these two weeks.

### 3. What did I manage to understand better during the CCL:

I think now I finally know what backend and frontend really are. Generally a lot of theory that I just brushed off during the semester I know feel like I understand a lot better. Obviously not all of it, which I am sure is noticable when looking at my code, But still, I feel somewhat confident that I could replicate a project like this in the future, probably with some improvements even.

To be more specific (because I like being specific), for the different routes, it finally clicked for me how to set them up with the methods and the controller functions. Also the controller logic (although I did ignore Models for the most part).

### 4. What I still struggle with:

This question is very ambiguously worded, it could either mean what do I still struggle with in the project, or what do strunggle with in general.

In the project, until the end and also up until the moment of submission I struggle with the accessibility guidelines. Unfortunately I did not pay attention to this when starting to code, and going back through everything and adjusting it makes me scared I'm going to break something and it's never going to work again (this has happened before☝️). Also, and I will admit this, I do not know why I cannot use the getUsers function from the userController for the authentication, and instead it only works when using the userModel function. I realize that this is a major oversight that I should fix, but I tried on 3 different occasions, and I always managed to break things. The fix is probably very easy, but after 2-3 weeks of coding I do not have the brain capacity anymore. Just to be clear: The desired outcome was to not have any models at all.

Generally in terms of coding full-stack web-apps, I really struggle with front-end. I really don't like it, and I do not want to do it (at the moment). Maybe I'll change my mind in the future, but after having no issues with the backend, and then suddenly having to write functions for 20 different buttons and CSS only working when the stars align, I did not find it an enjoyable experience.

### 5. Looking back at the start of the semester, did I think I'd be able to build the app I delivered?

I don't really know what to answer for this, because at the start of the semester, I didn't know the scope of the CCL and I also didn't have any ideas on what web-app to build. I guess I never really thought about whether I'd be able to or not, I just started coding and never considered that maybe I'm not able to do it.

Actually now that I'm thinking about the question maybe it means that if I considered my coding skills at the beginning of the semester, if I would think that person would be able to build the app I delivered? I don't really know what this question means due to the ambiguity. But if the intended meaning is the latter, then no, because I didn't know all the theory yet. But that's obvious, so I'm not sure if that's really what you're asking. 

I think I'm overthinking the phrasing of this question but the reflection should be in my own words, so I'm just going to leave my answer like this.

If you wanted short and concise answers for the personal reflection, then I'm sorry, but "my own words" means a 900 word essay. Thank you for coming to my TED talk. 