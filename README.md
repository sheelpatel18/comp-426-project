<!DOCTYPE html>
<html lang="en">
<body>
    <h1>Scheduler App</h1>
    <h2>Summary</h2>
    We aimed to create an app that allows users to sign in via phone number, input times of the week that they are free, and 
    <hr>
    <h2>Set Up</h2>
    <hr>
    <h2>Team Roles</h2>
    <p>Sheel Patel: Back-end lead/Plan manager</p>
    <p>Vidyuth Jagadeesan: Front-end lead/Database manager</p>
    <p>Nashith Agarwal: Project manager/Documentatiom manager</p>
    <p>Azaria Prescod: Documentation manager/Designer</p>
    <p>Samuel Osei: Release manager/Design lead</p>
    <hr>
    <h2>Future Implementations</h2>
    <h5>Admin Functionality: an admin user that could limit the users that submit their meeting time.</h5>
    <h5>Google Calendar: Utilize Google Calendar's API to auto-create a calendar event for the meeting.</h5>
    <h5>Invite System: A sharable link to 'invite' users to submit their availability with their account info pre-filled.</h5>
    <hr>
    <h2>API Documentation</h2>
    <h4><a href="https://documenter.getpostman.com/view/18074253/2s93eSaFyz#c11933b4-0b26-4162-a798-13373fed788a" target="_blank">https://documenter.getpostman.com/view/18074253/2s93eSaFyz#c11933b4-0b26-4162-a798-13373fed788a</a></h4>
    <hr>
    <h2>The Backend</h2>
    <h6>Please see API docs above for instructions on how to interface with our REST API. This section contains more fine-grained details of our backend</h6>
    <p>Our backend is written in Typescript under the Express web framework. We utilized Google Cloud products in order to service our application to other users. Cloud Products include, but aren't limited to, Cloud Friestore (NoSQL Database) and Firebase Authentication. Firebase Authentication is used to authenticate users via phone number and verification code. Firestore is used as a persistent data storage device for all user information. The backend includes capability to log user activity including but limited to: user sign ins, user log outs, updating user's schedule, and requesting a meeting time. These logs are stored in Cloud Firestore for persistence.</p>
    <hr>
    <h2>The Frontend</h2>
    <p>Our frontend is written in Javascript under the React WebApp framework. We utilized redux for global state management (user details) and axios for interfacing with our RESTful API. The MaterialUI styling framework was used for a more modern feel. A firebase client is also integrated on the WebApp itself for verifying users via phone number, that is the only direct interaction this WebApp has with firebase.</p>
    <hr>
    <h2>The Repo</h2>
    <p>This repo contains both the webapp and api bundled together.</p>
    <h4>Scripts</h4>
    <p>The following scripts are available to you:</p>
    <p>- <code>npm install</code> Installs all dependencies for both the webapp and api.</p>
    <p>- <code>npm run build</code> Compiles the code into a usable file for production purposes.</p>
    <p>- <code>npm test</code> Runs `jest` tests for both api and WebApp to ensure compilation was successful. (automatically runs the build script)</p>
    <p>- <code>npm start</code> Launches the server on the specified port (see .env section) (automatically runs the build script)</p>
    <h4>.env</h4>
    <h7>In order for this repo to work properly, two .env files must be populated with the correct fields:</h7>
    <h6>/.env</h6>
    <p>Must be populated with a PORT env that specifies the port to launch the server on</p>
    <h6>/app/meeting-app/.env</h6>
    <p>Must be populated with a REACT_APP_PORT env that repeats the port specified above</p>
    <h6>/key.json</h6>
    <p>Must contain the service account key for the Google Cloud Project. Permissions must include firestore and firebase auth admin read/write access</p>
</body>
</html>
