# InkForge

InkForge is a web-application for writers to organize and further plan their story ideas. Users can create projects and keep track of characters, story-settings, world-building, and plot points via story segments. Its aim is to act as a centralized Notes App that effectively categorizes and organizes original ideas, to aid the creative process.

### Features
- **Character Management:** Create and link characters to one another using relationship graphs.

- **Project Overview:** Organize writing projects by genre, geography, chapter structure, and more.

- **Interactive Graphs:** Visualize character relationships using Cytoscape with zoom, pan, and drag support.

- **Settings Module:** Modular CRUD system for world-building categories like geography, climate, and time period.

- **Story Segments:** Create, edit, and delete story segments to outline plot points.
- **User Authentication:** Secure login and registration system with password hashing.
- **File Uploads:** Upload and display images for projects, characters, and users.

### Tech Stack
- **Frontend:**	React.js
- **Backend:**	Node.js + Express
- **Database:**	MySQL (managed with phpMyAdmin)
  
Passwords are hashed with bcrypt.js, user authentication and authorization are handled by jsonwebtoken. Cross-Origin Resource Sharing (when hosting locally) is enabled by CORS. Picture Upload is done using Multer and UUIDs. For the relationship graph I am using Cytoscape. 

## Screenshots
### Exploring public projects
<div style="text-align: center;">
  <img src="screenshots/explore.jpeg" alt="Screenshot of the Explore Page" width="880">
</div>

### Project Details
<div style="text-align: center;">
  <img src="screenshots/readProject.jpeg" alt="Screenshot of the Project Details" width="880">
</div>
🔼Project Details of an unowned project
<div style="text-align: center;">
  <img src="screenshots/editProject.jpeg" alt="Screenshot of the Project Details" width="880">
</div>
🔼Project Details of your own project

### Characters
<div style="text-align: center;">
  <img src="screenshots/readCharacters.jpeg" alt="Screenshot of the Character Details" width="880">
</div>
<div style="text-align: center;">
  <img src="screenshots/readCharacter.jpeg" alt="Screenshot of the Character Details" width="880">
</div>

### Worldbuilding
<div style="text-align: center;">
  <img src="screenshots/readSettings.jpeg" alt="Screenshot of the Settings" width="880">
</div>
🔼Settings of an unowned Project
<div style="text-align: center;">
  <img src="screenshots/editSettings.jpeg" alt="Screenshot of the Settings" width="880">
</div>
🔼Settings of your own Project

### Story Segments
<div style="text-align: center;">
  <img src="screenshots/readStorySegments.jpeg" alt="Screenshot of the Story Segments" width="880">
</div>
🔼Segments of an unowned Project
<div style="text-align: center;">
  <img src="screenshots/editStorySegments.jpeg" alt="Screenshot of the Story Segments" width="880">
</div>
🔼Segments of your own Project

### Relationship Graph
<div style="text-align: center;">
  <img src="screenshots/readGraph.jpeg" alt="Screenshot of the Relationship Graph" width="880">
</div>

### Users
<div style="text-align: center;">
  <img src="screenshots/users.jpeg" alt="Screenshot of the Users Page" width="880">
</div>
🔼User Page for regular Users
<div style="text-align: center;">
  <img src="screenshots/adminUsers.jpeg" alt="Screenshot of the Users Page" width="880">
</div>
🔼Users Page with admin actions

### Projects
<div style="text-align: center;">
  <img src="screenshots/ownProjects.jpeg" alt="Screenshot of the Projects Page" width="880">
</div>
🔼Projects page with all created (and owned) projects
