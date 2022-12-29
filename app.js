// ========== config & consts ========== //
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

// ========== routes & endpoints ========== //

// GET Route "/"
app.get("/", (request, response) => {
    response.send("Node Express Users API! Read users at http://localhost:3000/users"); // det her vises hvis du kører http://localhost:3000 i browser. Vi bruger den som sådan ikke til noget :)
});

// GET Route "/users"
// READ: read all users from data
// det er dette du kan fetche fra http://localhost:3000/users
// så får du alle users some JSON
app.get("/users", (request, reponse) => {
    // returnerer et response, hvor data (users) er lavet om til JSON
    return reponse.json(data);
});

// GET Route "/users/:id"
// READ: get user by id
// denne kan anvendes hvis du kun vil læse et brugerobjekt
// det kan man vha brugerens id, fx:
//http://localhost:3000/users/2
app.get("/users/:id", (request, response) => {
    const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
    const user = data.users.find(item => item.id == id); // finder bruger med de givne id
    return response.json(user); // returnerer et response med brugeren som JSON
});

// POST Route "/users"
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

// PUT Route "/users/:id"
// UPDATE: update existing user
// PUT request som anvendes til at opdatere en eksisterende bruger
// Dette gøres på baggrund af id og de nye opdaterede informationer om brugeren.
app.put("/users/:id", (request, response) => {
    const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger med "det" id.
    const userData = request.body; // læser det nye userData som kommer fra en frontend - det er det data der skal bruges til at opdatere en eksisterende bruger
    let user = data.users.find(item => item.id == id); // finder bruger med de givne id
    user.firstName = userData.firstName; // ændrer alle brugerens properties med de "nye" fra frontend
    user.lastName = userData.lastName;
    user.image = userData.image;
    user.age = userData.age;
    user.email = userData.email;
    user.gender = userData.gender;
    return response.json(data); // efter at have opdateret bruger, returneres det nye opdaterede data (med brugerene) tilbage til frontenden
});

// DELETE Route "/users/:id"
// DELETE: delete user
app.delete("/users/:id", (request, response) => {
    const id = request.params.id; // tager id fra url'en, så det kan anvendes til at finde den givne bruger der skal slettes
    data.users = data.users.filter(item => item.id != id); // data.users ændres, så array indeholder alle de brugere, der ikke har det id, som brugeren har du vil slette. Det er lidt omvendt logik, men i praksis giver det et nyt array hvor den bruger du vil slette ikke er der.
    return response.json(data); // efter at have slettet bruger, returneres det nye opdaterede data tilbage til frontenden
});

// binds and listens for connections on the specified host and port
app.listen(port, () => {
    console.log(`Node.js REST API listening at http://localhost:${port}`); // blot en "servicebesked" man kan se i loggen, så vi ved backenden kører.
});
