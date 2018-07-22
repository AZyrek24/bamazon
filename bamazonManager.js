var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});
// connect to database, display products for sale
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  showOptions();
});
// Global Variables
//===================================================================================================

// Functions
//===================================================================================================

// Displays Bamazon banner
function banner () {
  console.log("===================================================================================".yellow);
    console.log("                                 Bamazon Manager".yellow);
    console.log("===================================================================================".yellow);
}
function showOptions() {
  inquirer
    .prompt({
      name: "chosen",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then(function(answer) {
      switch (answer.chosen) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addToInventory();
          break;
        case "Add New Product":
          addNewProduct();
          break;                   
      }
    });
}
function viewProducts() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    banner();
    console.log("-----------------------------------------------------------------------------------".cyan);
    for (var i = 0; i < res.length; i++) {
      if (res[i].item_id < 10) {
        console.log(res[i].item_id + " |   ".cyan + res[i].product_name + "   | ".cyan + "  $ " + res[i].price + "   |   ".cyan + "Qty: " + res[i].stock_quantity);
        console.log("-----------------------------------------------------------------------------------".cyan);
      }
      else if (res[i].item_id >= 10) {
        console.log(res[i].item_id + " |   ".cyan + res[i].product_name + "   | ".cyan + "  $" + res[i].price + "   |   ".cyan + "Qty: " + res[i].stock_quantity);
        console.log("-----------------------------------------------------------------------------------".cyan);
      }
    }
    console.log("\n");
    connection.end();
  });
}
function viewLowInventory() {
  console.log("View Low Inventory".yellow);
}
function addToInventory() {
  console.log("Add to Inventory".yellow);
}
function addNewProduct() {
  console.log("Add a new product".yellow);
}