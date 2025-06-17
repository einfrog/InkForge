# InkForge ToDos

## June 11th:
db: biography and role attributes✅

add user❔⁉️❌ not needed

register user✅

userDetailPage✅

turn userDetail page into profile page, only if logged in.✅

when not logged in and trying to access socials, redirect to login page. ✅


when clicking on profile button, be able to log out.✅

always display profile icon, where you can register or login, and when logged in, you can log out or view profile.✅

## June 12th:

IMPORTANT: automatically log in after registration.✅

update user when you're logged in with that user or as admin✅

delete user✅

figure out userroutes to backup userform logic✅

db: set up projects✅
crud for projects✅

hash passwords with bcryptjs✅

characters crud✅

## June 13th:

modular settings crud✅

insert empty settings row when creating a new project✅

story segments crud✅

character_relationships crud✅

add authorization to project, settings and segments crud (only logged in users can create, update, delete their own projects)✅

authorization for projects✅

character relationships (characters can have multiple relationships with other characters, e.g. friends, enemies, lovers, etc.), asymmetric relationships (e.g. A is friend of B, but B is not friend of A)✅

rewrite user management to user userController✅

beidseitige restriction (frontend und backend url) AUCH FÜR USER✅

picture upload for users, characters and projects✅

clean up comments in code✅

## June 15th:

own projects page with all projects of the logged in user✅

explore page with all public projects✅

Sidebar for project detail (overview, characters, worldbuilding, story segments, analytics)✅

rewrite components to use one ProjectDetail component for owned and public projects✅

## June 16th:

fix frontend paths after character details view (and sidebar)✅

sections for projectdetail view READ✅

restrictions when trying to access project detail view of a private project when not logged in as that user, works for /projects/id but not for /explore/id✅

Create, update and delete Projects✅

Create, update and delete Characters✅

CRUD worldbuilding✅

CRUD story segments✅

relation READ✅

get name of target character in relationship view✅

character relationships CRUD✅

show public projects details when not logged in✅

implement CRUD for projects, characters, worldbuilding, story segments✅

get rid of unique keys warning in console❓

## June 17th:

feedback when trying to create another relationship with the same character

generally display error messages in the UI instead of console

remove cud buttons from explore page✅

project detail view for public projects with read only mode✅

get usernames for projects (explore page)✅

upload/display pictures for projects, characters and users

different pages/props for overview, characters, worldbuilding, story segments, analytics

continue working on docs

for projects, if no picture is uploaded, choose color

## Optional:

delete old/unused pictures from uploads folder when updating a project, character or user picture

restrict delete of admin (can't be deleted)(?)

fix error messages (zb trying to create account with existing email) and generally so it doesnt get displayed in the console but in the UI

exchange jwt token in localstorage with http only cookie:
res.cookie('token', accessToken, {
httpOnly: true,
secure: true,
sameSite: 'Strict',
maxAge: 86400000, // 1 day
});

and call APIs with 
credentials: 'include'





