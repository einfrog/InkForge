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

db: set up projects

hash passwords with bcryptjs

add projects, delete projects, update projects

fix error messages (zb trying to cretate account with existing email) and generally so it doesnt get displayed in the console but in the UI

exchange jwt token in localstorage with http only cookie:
res.cookie('token', accessToken, {
httpOnly: true,
secure: true,
sameSite: 'Strict',
maxAge: 86400000, // 1 day
});

and call APIs with 
credentials: 'include'


