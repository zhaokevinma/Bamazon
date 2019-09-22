// packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// mysql connection object
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "88888888wow",
    database: "bamazon"
});

// connect and start application
connection.connect(function(err) {
    if(err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    start();
})

// functions
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["TAKE A LOOK AT ALL PRODUCTS", "BUY A PRODUCT", "NO THANKS BYE"]
        })
        .then(function(answer) {
            if(answer.action === "TAKE A LOOK AT ALL PRODUCTS") {
                displayProducts();
            } else if (answer.action === "BUY A PRODUCT"){
                buyAProduct();
            } else {
                connection.end();
            }
        });
}

function displayProducts() {
    console.log("\n--------------------------------------------------------------------------------------------\n" + 
                "\nDisplaying all products..." +
                "\n");
    connection.query("SELECT * FROM products", function(err,res) {
        if(err) throw err;
        console.table(res);
        console.log("\n--------------------------------------------------------------------------------------------\n")
        start();
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
                    message: "\nWhat item would you like to Buy?\n"
                },
                {
                    name: "amount",
                    type: "input",
                    message: "\nHow many of them would you like to buy?\n"
                }
            ])
            .then(function(answer) {
                var chosenItem;
                var stockQuantity;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        chosenItem = res[i];
                        if (answer.amount > res[i].stock_quantity) {
                            console.log("\nInvalid input, please try again.\n")
                            start();
                        } else {
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
                                    console.log("\n--------------------------------------------------------------------------------------------")
                                    console.log("\nYou made a purchase successfully!\n");
                                    console.log("\nThat would be " + answer.amount * chosenItem.price + " dollars. Thank you!")
                                    console.log("\n--------------------------------------------------------------------------------------------\n")
                                    start();
                                }
                            );
                        }
                    }
                }
            });
    });
}