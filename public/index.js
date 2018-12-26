"use strict";

$(function () {
    //console.log("hola");
    // Realizar la petición al servidor
    $.ajax({
        method: "GET",
        url: "/tasks" ,
        // En caso de éxito, mostrar el resultado
        // en el documento HTML
        success: function (data, textStatus, jqXHR) {
            console.log(data);
        },
        // En caso de error, mostrar el error producido
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });

});
