## CCAPDEV MCO
# Forum Web Application

Quiver is a web-based forum application developed for CCAPDEV (Web Application Development) course. The forum web application may be designed as a general-interest forum or one that is catered towards a specific interest group. The features of this forum web application includes, but not limited to:

The following describes the features of a forum web application. Groups may choose to
either design the forum web application as a general-interest forum or one that is more
catered towards a specific interest group. The minimum features required to be
implemented for this project is as follows:

● View all posts
  o Upon visiting the web page, an unregistered visitor may see the 15-20 most
recently* uploaded post titles and a post description snippet. The user can
see the next set of uploaded posts, it is up to the group whether to
implement this in the same (auto-load) or another page. Clicking the post
title will let the user view the post and the comments (see: view a post).

o * The user may also see the most popular post based on a calculated
ranking.

● Register

  o A visitor must register if they want to post or comment. Here, a visitor
must enter their username and their password.

● View a user profile

  o Each user has their own page which shows their profile publicly. On the
same page, a visitor may see the user’s username, profile picture, and a
short description. They may also see a portion of the user’s latest posts
and comments. The visitor may opt to see the rest of the posts and
comments of the user.

● Edit Profile

  o A user that is logged in may edit their user profile, wherein they can add
/ modify a profile picture, and provide a short description (can be left
empty).

● Login

  o After registering properly, a visitor may log-in. Upon logging in, the user
can start posting and commenting. The user is given the option to be
“remembered” by the website. When the user chooses this option, every
log in and visit to the website will extend their “remember” period by 3
weeks.

● Logout

  o The user may log out from their account. This should cut short the
“remember” period if it exists, and clears any session-related data.\

● Post

  o A user may make a text post. They must give a title for the post, and the
body of the post. Additional points will be given for allowing markup (e.g.,
rich text editing) without the risk of cross site-scripting.

● View a post

  o A user may view any post they have a link to. This will load the title, the
body of the post, and the comments of the post.

● Comment

  o A user can comment on any post, including their own. They may also reply
to another user’s comments, and the comments can nest indefinitely.

● Edit / Delete a post

  o The owner of the post may edit their posts at any point. Edited posts
should have an indication that it has been edited.

  o The owner of the post may delete their post as well.

● Edit / Delete a comment

  o The owner of the comment may edit their comments at any point. Edited
comments should have an indication that it has been edited.

  o The owner of the comment may delete their comment.

● Upvote / Downvote

  o A user can upvote / downvote a post or a comment (including their own)
once.
● Search

  o A visitor/user can search for posts by similarities in the title or the post
body. By entering a search phrase/word, all posts containing it will appear
as results.

● General
  
  o Good user experience. Visitors can easily navigate without help, all
information is easy to access. Good visual design. Design suits the theme
of the application, and is cohesive and consistent across the whole
application


# Installation and Setup
To run Quiver locally, you need Node.js installed (https://nodejs.org/). 

1. Clone the repository:
```git clone https://github.com/yourusername/quiver.git```
```cd quiver```

2. Make sure there is an .env.local file to set up the environements. The content of the file:
```NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAM_EqvHLRBjPcFsb4f8Kpq7k0afWcDp5c
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quiverccapdevmco.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quiverccapdevmco
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quiverccapdevmco.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=215694210674
NEXT_PUBLIC_FIREBASE_APP_ID=1:215694210674:web:3497e8eebbc21c1e0c34eb
```

2. Install dependencies:
```npm init -y```
```npm install react@18.3.1 react-dom@18.3.1```
```npm install next@latest```


3. Run the development server:
```npm run dev```

4. Access the application:
Open the browser and accessing localhost:3000




Open the browser and accessing localhost:3000
