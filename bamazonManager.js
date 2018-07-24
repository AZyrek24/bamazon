var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 8889
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
  banner();
  showOptions();
});
// Global Variables
//===================================================================================================
var totalItemsLength;
var currentQty = 0;
var addQty = 0;
// Functions
//===================================================================================================

// Displays Bamazon banner
function banner() {
  console.log("\n===================================================================================".yellow);
  console.log("                                 Bamazon Manager".yellow);
  console.log("===================================================================================".yellow);
}
// Prompts which function to call
function showOptions() {
  inquirer
    .prompt({
      name: "chosen",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then(function (answer) {
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
// Logs all products in inventory
function viewProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    totalItemsLength = res.length + 1;
    banner();
    console.log("                                PRODUCTS FOR SALE".green);
    console.log("-----------------------------------------------------------------------------------".cyan);
    console.log("Item #  |          Product, Price, Stock".cyan);
    console.log("---------------------------------------------------------------".cyan);
    for (var i = 0; i < res.length; i++) {
      if (res[i].item_id < 10) {
        console.log(res[i].item_id + "       |   ".cyan + res[i].product_name + "   | ".cyan + "  $ " + (res[i].price).toFixed(2) + "   |   ".cyan + "Qty: " + res[i].stock_quantity);
        console.log("-----------------------------------------------------------------------------------".cyan);
      }
      else if (res[i].item_id >= 10) {
        console.log(res[i].item_id + "      |   ".cyan + res[i].product_name + "   | ".cyan + "  $" + (res[i].price).toFixed(2) + "   |   ".cyan + "Qty: " + res[i].stock_quantity);
        console.log("-----------------------------------------------------------------------------------".cyan);
      }
    }
    console.log("\n");
    showOptions();
  });
}
// Logs all inventory that has a quantity lower than 5
function viewLowInventory() {
  connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    totalItemsLength = res.length + 1;
    banner();
    console.log("                                  LOW INVENTORY".red);
    console.log("-----------------------------------------------------------------------------------".cyan);
    console.log("Item # |".cyan);
    console.log("---------------------------------------------------------------".cyan);
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5 && res[i].item_id < 10) {
        console.log(res[i].item_id + "      |   ".cyan + res[i].product_name + "   | ".cyan + "  Qty: " + res[i].stock_quantity);
        console.log("-----------------------------------------------------------------------------------".cyan);
      }
      else if (res[i].stock_quantity < 5 && res[i].item_id >= 10) {
        console.log(res[i].item_id + "       |   ".cyan + res[i].product_name + "   | ".cyan + "  Qty: " + res[i].stock_quantity);
        console.log("-----------------------------------------------------------------------------------".cyan);
      }
    }
    console.log("\n");
    showOptions();
  });
}
// Prompts for the item number to add, then prompts for quantity to add
function addToInventory() {
  connection.query('SELECT * FROM products', function (err, res) {
    totalItemsLength = res.length + 1;
    inquirer
      .prompt([
        {
          name: "addToItem",
          type: "input",
          message: "Which item # would you like to add inventory to?",
          validate: function (value) {
            var input = parseInt(value.trim());
            if (isNaN(input) === false && input <= totalItemsLength && input > 0) {
              connection.query('SELECT * FROM products WHERE item_id = ' + input, function(err, res) {
                currentQty = res[0].stock_quantity;
              }) 
              return true;
            } else {
              console.log("Must be a number. Try Again.");
              return false;
            }
          }
        },
        {
          name: "qtyToAdd",
          type: "input",
          message: "What quantity would you like to add?",
          validate: function (value) {
            var input = parseInt(value.trim());
            if (isNaN(input) === false && input > 0) {
              return true;
            } else {
              console.log("Must be a number greater than zero. Try Again.");
              return false;
            }
          }
        }
      ])
      .then(function (answer) {
        addQty = parseInt(answer.qtyToAdd);
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: currentQty + addQty
            },
            {
              item_id: answer.addToItem
            }
          ],
          function (error) {
            if (error) throw err;
            console.log(answer.qtyToAdd + " units added to inventory.".yellow);
            connection.end();
          }
        )
      });
  })
}

function addNewProduct() {
  connection.query('SELECT * FROM products', function (err, res) {
    totalItemsLength = res.length + 1;
    inquirer
      .prompt([
        {
          name: "productName",
          type: "input",
          message: "What is the name of the product?",
        },
        {
          name: "productDept",
          type: "input",
          message: "Which department does this item belong to?",
        },
        {
          name: "price",
          type: "input",
          message: "What is the price?",
          validate: function (value) {
            var input = parseInt(value.trim()).toFixed(2);
            if (isNaN(input) === false && input > 0) {
              return true;
            } else {
              console.log("Must be a number greater than zero. Try Again.");
              return false;
            }
          } 
        },
        {
          name: "qty",
          type: "input",
          message: "What quantity would you like to add?",
          validate: function (value) {
            var input = parseInt(value.trim());
            if (isNaN(input) === false && input > 0) {
              return true;
            } else {
              console.log("Must be a number greater than zero. Try Again.");
              return false;
            }
          }
        }
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.productName,
            department_name: answer.productDept,
            price: answer.price,
            stock_quantity: answer.qty
            
          },
          function(err) {
            if (err) throw err;
            console.log(answer.qty + " of " + answer.productName + " was added to products.".yellow);
            connection.end();
          }
        );
      });
  })
}
