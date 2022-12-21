//==> config og variabler -- det behøver du som sådan ikke forholde dig til
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
// Your github page origin has to be written EXACTLY like this! https://behu-kea.github.io
const URL_FOR_FRONTEND = "YOUR_GITHUB_PAGE_ORIGIN_HERE";

let data = require("./data"); // users array imported from data.js

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// If the application is running localhost allow all requests,
// otherwise add cors for specific website
// Remember to add the NODE_ENV="prod" on server!
const cors_url = process.env.NODE_ENV === "prod" ? URL_FOR_FRONTEND : "*";
app.use(
    cors({
        origin: cors_url
    })
);

//==> det vigtige begynder her

app.get("/", (req, res) => {
    res.send("Node Express Users API! Read users at http://localhost:3000/users");
});

// READ: read all users from data
// det er dette du kan fetche fra http://localhost:3000/users
// så får du alle users some JSON
app.get("/users", (request, reponse) => {
    // returnerer et response, hvor data (users) er lavet om til JSON
    return reponse.json(data);
});

// READ: get user by id
// denne kan anvendes hvis du kun vil læse et brugerobjekt
// det kan man vha brugerens id, fx:
//http://localhost:3000/users/2
app.get("/users/:id", (request, response) => {
    const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
    const user = data.users.find(item => item.id == id); // finder bruger med de givne id
    return response.json(user); // returnerer et response med brugeren som JSON
});

// CREATE: create new user and add to users
// POST request som muliggør at der kan oprettes ny bruger
// data sendes (POST'es) fra frontend og backenden læser her den nye bruger i det der hedder "body" (requestens body)
app.post("/users", (request, response) => {
    let newUser = request.body; // den nye bruger læses fra requestens body (sådan er det bare :D )
    const timestamp = Date.now(); // dummy generated user id - som vi tilføjer til den nye bruger. Havde der været en database, var det sket auutomatisk.
    newUser.id = timestamp; // id tilføjes brugerobjektet
    data.users.push(newUser); // det nye brugerobjektet tilføjes (push'es) til data.users - dvs listen af brugere som gemmer sig i data
    return response.json(data); // efter at den nye bruger er tilføjes, returneres det nye data (med brugeren) tilbage til frontenden
});

// UPDATE: update existing user
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    let user = data.find(item => item.id == id);
    user.name = userData.name;
    user.title = userData.title;
    user.mail = userData.mail;
    user.image = userData.image;
    return res.json(data);
});

// DELETE: delete user
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    data = data.filter(item => item.id != id);
    return res.json(data);
});

app.listen(port, () => {
    console.log(`Node.js REST API listening at http://localhost:${port}`);
});
