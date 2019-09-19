var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "88888888wow",
    database: "bamazon"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    start();
})

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["LOOK", "BUY"]
        })
        .then(function(answer) {
            if(answer.action === "LOOK") {
                displayProducts();
            } else {
                connection.end();
            }
        });
}

function displayProducts() {
    console.log("Displaying all products...\n");
    connection.query("SELECT * FROM products", function(err,res) {
        if(err) throw err;
        console.log(res);
        connection.end();
    });
}