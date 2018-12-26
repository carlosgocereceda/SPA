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


let idCounter = 4;

app.use(bodyParser.json());

app.get("/",function (request, response){
    response.redirect("/tasks.html");
});

app.get("/tasks", function (request, response) {
    
    response.json(tasks);

});
app.get("/deleteCompleted", function (request, response) {
    daoT.deleteCompleted("usuario@ucm.es", function (err, result) {
        if (err) {
            console.log(err.message);
        }
        else {
            response.redirect("/tasks");
        }
    })
});
app.post("/addTask", function (request, response) {
    let task = createTask(request.body.texto);
    task.done = 0;
    //console.log(task);
    daoT.insertTask("usuario@ucm.es", task, function (err) {
        if (err) {
            console.log(err.message);
        }
        else {
            response.redirect("/tasks");
        }
    })

});
app.get("/finish/:taskId", function (request, response) {
    // console.log(request);
    //  response.status(200);
    //console.log("hola");
    //console.log(request.params);
    response.status(200);
    daoT.markTaskDone(request.params.taskId, function (err) {
        if (!err) {
            response.redirect("/tasks");
        }
        else {
            console.log(err);
        }
    })

});

let _texto = "";
function createTask(texto) {
    let solucion = {
        text: "",
        tags: []
    };
    let partes = texto.split(" ");
    let etiquetas = partes.filter(BuscaEtiquetas);
    partes.filter(BuscaTexto);
    solucion.tags = etiquetas;
    solucion.text = _texto;
    return solucion;
}
function BuscaEtiquetas(palabra) {
    return /@\w+/.test(palabra);
}
function BuscaTexto(palabra) {
    if (!/@\w+/.test(palabra)) {
        _texto = _texto + palabra + " ";
        return true;
    }
    else return false;
}
// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
