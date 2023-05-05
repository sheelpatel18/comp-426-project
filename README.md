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
    <hr>
    <h2>API Documentation</h2>
    <h4>Root Endpoint (/app)</h4>
    <h6>GET</h6>
    <p>- Gets the root endpoint of the application. Serves WebApp to client.</p>
    <h3>Example cURL</h3>
    <pre>
curl --location '/app'
    </pre>
    <h4>Ping Endpoint (/ping)</h4>
    <h6>GET/POST/PATCH/DELETE</h6>
    <p>- Test endpoint. Works on all request methods</p>
    <h3>Example cURL</h3>
    <pre>
curl --location '/ping'
    </pre>
    <h4>/api/user</h4>
    <h6>POST</h6>
    <p>- Creates new user. Body must be of JSON format. It is not required to include ALL user attributes, but phone number is required at minimum. </p>
    <h3>Example cURL</h3>
    <pre>
curl --location '/api/user' \
--header 'Content-Type: application/json' \
--data '{
    "phone": "somePhoneNumber"
}'
    </pre>
    <h3>Example Response (201)</h3>
    <pre>
{
    "id": "someID",
    "name": "someName",
    "phone": "somePhone",
    "availability": []
}
    </pre>
</body>
</html>
