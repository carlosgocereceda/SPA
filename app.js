let idCounter = 5;
let tasks = [
    {
        id: 1,
        text: "Comprar billetes de avión"
    },
    {
        id: 2,
        text: "Hacer las maletas"
    },
    {
        id: 3,
        text: "Comprar regalos de reyes"
    },
    {
        id: 4,
        text: "Reservar coche"
    }
];


const config = require("./config");
const DAOTasks = require("./DAOTasks");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");




// Crear un servidor Express.js
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); //Preguntar a Marina donde hay que colocar esto
//diapositiva 30.4

const ficherosEstaticos =
    path.join(__dirname, "public");

app.use(express.static(ficherosEstaticos));

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "public", "views"));

app.use(bodyParser.json());

app.get("/", function (request, response) {
    response.redirect("/tasks.html");
});

app.get("/tasks", function (request, response) {

    response.json(tasks);

});

app.post("/tasks", function (request, response) {
    let texto = request.body.texto;
    let info ={
        id: idCounter,
        text: texto
    }
    tasks.push(info);
    idCounter += 1;
    response.status(200);
    response.json(info);
    response.end();
});

app.delete("/tasks/:id", function(request, response){
    let indice = Number(request.params.id);
    if(!isNaN(indice)){
        let encontrado = false;
        let pos = 0;
        //es un número y está dentro del array
        for(let i = 0; i < tasks.length; i++){
            console.log("tasks[i].id " +tasks[i].id + " indice " + indice);
            if(tasks[i].id === indice){
                encontrado = true;
                pos = i;
            }
        }
        if(!encontrado){
            response.status(404);
        }
        else{
            console.log("aqui");
            tasks.splice(pos, 1);
            response.status(200);
            response.end();
        }
    }
    else if(tasks[indice] == undefined){
        response.status(404);
    }
    else{
        response.status(400);
    }
})
// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
