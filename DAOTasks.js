const mysql = require("mysql");

class DAOTasks {

    constructor(pool) {

        this.pool = pool;

    }

    getAllTasks(email, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query(`SELECT task.id, tag.tag, task.text, task.done
                FROM task
                LEFT JOIN tag ON task.id = tag.taskId
                WHERE task.user = ?`,
                [email],
                function(err,rows){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        let solucion=[];
                        var mySet = new Set();
                        for(let i = 0; i < rows.length; i++){
                            mySet.add(rows[i].id);
                        }
                        for (let item of mySet){
                            let tarea = {
                                id:0,
                                task:item,
                                text:"",
                                tags:[]
                            }
                            for(let i = 0; i < rows.length; i++){
                                if(rows[i].id == item){
                                    tarea.id = rows[i].id;
                                    tarea.text = rows[i].text;
                                    tarea.done = rows[i].done;
                                    tarea.tags.push(rows[i].tag);
                                }
                            }
                            solucion.push(tarea);
                        }
                        callback(null,solucion);
                    }
                }
                )
            }
        })
    }
    markTaskDone(idTask, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query(`UPDATE TASK SET DONE = 1 WHERE ID = ?`,
                [idTask],
                function(error,result){
                    connection.release();
                    if (error){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        callback(null);
                    }
                }
                )
            }
        })
    }
    insertTask(email, task, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query(`INSERT INTO TASK(USER, TEXT, DONE) VALUES (?,?,?)`,
                [email, task.text, task.done],
                function(err,result){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        for(let i = 0; i < task.tags.length; i++){
                            connection.query(`INSERT INTO TAG(TASKID, TAG) VALUES (?,?)`,
                            [result.insertId, task.tags[i]],
                            function(error,res){
                                if(error){
                                    callback(new Error("Error de acceso a la base de datos"));
                                }
                            }
                            )
                        }
                        
                        connection.release();
                        callback(null);
                    }
                })
            }
        })
    }
  
    deleteCompleted(email, callback){
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query(`DELETE FROM TASK WHERE DONE = 1 AND USER = ?`,
                [email],
                function(err,res){
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        callback(null);
                    }
                })
            }
        })
    }
}
module.exports = DAOTasks;
