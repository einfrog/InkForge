# Development Documentation

## Hosting Setup
### Where and How?
The website is hosted on the FH St. Pölten Campus Cloud. To do this I made a new Node instance on fhstp.cc. Also, to run backend and frontend, I ran npm run build, to make a dist folder with the production build of the frontend. Then, to make it work, I connected wit the created Node instance via Filezilla, and made two new folders in the node directory, backend and frontend. In the backend I put all files from my project repository, except for node modules, and in the frontend folder I put the dist folder. Of course, for the backend to be able to access the dist, I had to include
```
app.use(express.static(path.join(__dirname,'../frontend/dist')));
    app.use((req,res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", 'index.html'));
})
```

in the backend app.js folder.

In Campus Cloud, for Start Stop Manage, I then set the Working directoy to /node/backend, and for the Start command I set `node app.js`. The Package Manager is npm, and my backend is configured to run on port 5000.

### Tools and Services?
I used a variety of different tools and services. The most important ones being:

- **Node.js**: For running the backend server.
- **Express.js**: For building the backend API.
- **React.js**: For building the frontend user interface.
- **PHPMyAdmin**: For managing the MySQL database.
- **MySQL**: For the database management system.
- **bcryptjs**: For hashing passwords securely.
- **jsonwebtoken**: For handling user authentication and authorization.
- **dotenv**: For managing environment variables.
- **Cors**: For enabling Cross-Origin Resource Sharing (when hosting locally).
- **cytoscape.js**: For visualizing character relationships.
- **FileZilla**: For transferring files to the server.
- **Git**: For version control and managing the project repository.
- **Postman**: For testing the API endpoints.

### How did I deploy the frontend and backend?
The frontend is deployed in the `frontend/dist` folder, which contains the production build of the React application. The backend is deployed in the `backend` folder, which contains all the necessary files to run the Node.js server. The Startup Command Line is node app.js, the starting directory is set to `/node/backend`.

When deployed locally, the frontend is started with ``npm run`` dev and runs on localhost:5173, while the backend runs on localhost:5000 and is started with `node app.js`. The frontend can communicate with the backend API using CORS.

## Project Architecture
### Folder Structure
#### /backend
- **Controllers**: Contain the logic for handling requests and responses, separated by functionality (e.g., userController, projectController).
- **Models**: req res logic for authentication
- **Routes**: Define the API endpoints and link them to the appropriate controllers, separated by functionality (e.g., userRoutes, projectRoutes).
- **Services**:
  - **Database**: Contains the database connection logic.
  - **Upload**: Handles file uploads for images and other media.
  - **Authentication**: Contains authentication logic, including JWT token generation and verification.
  - **Authorization**: Contains authorization logic to restrict access to certain routes based on user roles.
- **Uploads**: Directory for storing uploaded files, such as user and project images.
- **app.js**: The main entry point for the backend application, where the Express server is configured and started.
- **.env**: Environment variables for sensitive information like database credentials and JWT secrets.

#### /frontend
- **Components**: Contains reusable React components, organized by functionality, the pages, such as ProjectPage, CharacterPage, etc.
- **Public**: Contains static assets like default images and icons.
- **Services**: Contains the API Service File for making HTTP requests to the backend.
- **App.jsx**: The main entry point for the React application, where the app is rendered and routes are defined.
- **index.html**: The main HTML file for the React application, where the root element is defined.
- **main.jsx**: The main entry point for the React application, where the ReactDOM is rendered.

## User Interaction Overview

### What does my solution solve? What's the main purpose?
InkForge is a web application designed to assist writers in organizing and planning their story ideas. It allows users to create projects and manage various aspects of their stories, including characters, world-building elements, and plot points through story segments. The main purpose is to provide a centralized platform for writers to effectively categorize and organize their original ideas, thereby aiding the creative process.

### What features should you test?

- Restrictions for unauthorized users (when not logged in you can only see Explore Page with public projects and Login/Register)
- Registration and login functionality
- Restrictions for unique emails
- User profile management (viewing, updating, deleting your own profile)
- Admin functionality for managing users
- Project creation, editing, and deletion
- Restriction when trying to edit or delete projects that do not belong to the user
- Character management (creation, editing, deletion, relationship mapping)
- Restrictions when trying to create a relationship with a character where a relationship already exists
- Story segment management (creation, editing, deletion)
- Settings management (creation, editing, deletion)
- Image upload functionality for users, characters, and projects

### What is the main flow?

Open website, explore public projects on the explore page, when trying to navigate to Socials or your own project, be redirected to login. If not logged in, click on Profile in the header and go to Register. Go to Projects in the header and look at your own projets or create a new one. Go to Project Detail View by clicking on project card. Go through sections Overview, Characters, Worldbuilding, Story Segments, and Analytics via the Sidebar navigation. Create characters in the character section, view Character Details by clicking on the Character card. Edit the chracter or add/edit relationships. Create/Edit/Delete story segments in the story segments section, and manage settings in the settings section. Upload images for your profile on the profile page (Profile -> View Profile in header), upload images for characters and projects. Log out by clicking Profile -> Logout in the header.

### Design decisions I want to highlight
- Modular worldbuilding settings
- Interactive character relationship mapping using Cytoscape.js
- Asymmetric character relationships
- Consistent use of cards
- Breadcrumb to navigate back through user flow
- Flexibility for users (what they name and write in the story segments is up to them, same for worldbuilding settings, they can create whatever they want)

### Known issues or limitations
- When forgetting to log out and accessing the webpage after some time, the session might expire and own projects cannot be fetched, leading to an error. Solution: log out and log back in.
- When creating a new segment or worldbuilding setting, the success/error message is displayed until reloading the page.
- Some styling issues, f.e. footer might behave strangely when entering scenarios I haven't thought to test while development.
- Accessibility on the Analytics page. Currently the text for the screen reader is being visually displayed, because if it is hidden it is not read out by the screen reader. This is a known issue that I have tried and failed to fixed. Displaying the text-based description is the most graceful way I could find to solve this.
- When navigation the website via keyboard, the "Profile" Link in the header does not give feedback that it is currently in focus.
  - The flavicon only works for the Explore Page and the Project Detail Views for the Projects from the Explore Page.    I could not figure out the reason for this, but it is a known issue.

## Accessibility
- **Perceivable**: All images have alt text. The color contrast is sufficient for readability (tested with Lighthouse). The Graph on the Analytics page has a text-based description for screen readers, although it is visually displayed. All buttons have descriptive text. Form inputs have labels.
- **Operable**: The website can be navigated using a keyboard. All interactive elements are focusable and can be activated using the keyboard. Note: The Profile Link in the header does not give visual feedback when it is in focus. There are no time limits for interactions. There is no seizure-inducing content.
- **Understandable**: The language of the website is set to English. The content is structured in a logical way, with headings and paragraphs. Error messages are clear and descriptive. Note: Headings do not use H1, H2, .. in the correct order. Some Headings are H2 without there being an H1 before.
- **Robust**: The website works in modern browsers. The HTML (index.html) is valid and follows best practices. The website is moderately responsive and usable on different screen sizes. ARIA is used where necessary, but not extensively.