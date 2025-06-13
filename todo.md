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

figure out userroutes to backup userform logic🔁

db: set up projects✅
crud for projects✅

hash passwords with bcryptjs✅

characters crud✅

## June 13th:

modular settings crud✅

insert empty settings row when creating a new project✅

story segments crud✅

character_relationships crud✅

authorization for projects

picture upload for users, characters and projects

character relationships (characters can have multiple relationships with other characters, e.g. friends, enemies, lovers, etc.), asymmetric relationships (e.g. A is friend of B, but B is not friend of A)

for projects, if no picture is uploaded, choose color

add authorization to project, settings and segments crud (only logged in users can create, update, delete their own projects)

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

restrict delete of admin (can't be deleted)

when logged in can create projects for other id?

beidseitige restriction (frontend und backend url) AUCH FÜR USER


