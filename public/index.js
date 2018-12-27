"use strict";

$(function () {
    loadTasks();


    $("#listaTareas").on("click", function (event) {
        onRemoveButtonClick(event);
    });

    /*$("#botonF").on("click", function () {
        onRemoveButtonClick(event);
    });*/



    /*$(".botonF").on("click", function (event) {
        onRemoveButtonClick(event);
    });*/

    $(".BotonTarea").on("click", function (event) {
        console.log("hola");
        onAddButtonClick(event);
    });

});
function taskToDOMElement(task) {
    let elemento = "<ul id = " + task.id + " class= tarea>" + task.text +
        "<div class=Botones>" +
        "<div class= finalizar><button id=botonF value= " + task.id + ">ELIMINAR</button> </div>" +
        "</div>" +
        "</ul>";
    return elemento;
}

function loadTasks() {
    $.ajax({
        method: "GET",
        url: "/tasks",
        // En caso de éxito, mostrar el resultado
        // en el documento HTML
        success: function (data, textStatus, jqXHR) {
            console.log(data);
            data.forEach(element => {
                $(listaTareas).append(taskToDOMElement(element));
            });
        },
        // En caso de error, mostrar el error producido
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}
function onRemoveButtonClick(event) {
    console.log("event");
    console.log(event.target.value);
    $.ajax({
        method: "DELETE",
        url: "/tasks/" + event.target.value,
        // En caso de éxito, mostrar el resultado
        // en el documento HTML
        success: function (data, textStatus, jqXHR) {


            console.log("delete");
            console.log(event.target.value);
            console.log(data);

            $("#" + event.target.value).remove();

        },
        // En caso de error, mostrar el error producido
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
           
        }
    });
}
function onAddButtonClick(event) {
    let tarea = $("textarea").val();
    if (tarea.length > 0) {

        $.ajax({
            method: "POST",
            url: "/tasks",
            data: {
                texto: tarea
            },
            // En caso de éxito, mostrar el resultado
            // en el documento HTML
            success: function (data, textStatus, jqXHR) {
                $(listaTareas).append(taskToDOMElement(data));
            },
            // En caso de error, mostrar el error producido
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        });

    }
    console.log(tarea);
}