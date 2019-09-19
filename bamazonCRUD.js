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
                buyAProduct();
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

function buyAProduct() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function() {
                        var choiceArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What item would you like to Buy?"
                },
                {
                    name: "amount",
                    type: "input",
                    message: "How many of them would you like to buy?"
                }
            ])
            .then(function(answer) {
                var chosenItem;
                var stockQuantity;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        chosenItem = res[i];
                        stockQuantity = res[i].stock_quantity - answer.amount;
                    
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: stockQuantity
                                },
                                {
                                    item_id: chosenItem.item_id
                                }
                            ],
                            function(err) {
                                if(err) throw err;
                                console.log("You made a purchase successfully!");
                                start();
                            }
                        );
                    }
                }
            });
    });
}