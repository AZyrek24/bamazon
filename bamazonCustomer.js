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
  showProducts();
});

// Global Variables
//===================================================================================================
var totalItemsLength;
// Functions
//===================================================================================================

function showProducts() {
  connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log("===============================================================".yellow);
    console.log("                          Bamazon".yellow);
    console.log("===============================================================".yellow);
    console.log("---------------------------------------------------------------".cyan);
    console.log("Item #  |          Product & Price         ".cyan);
    console.log("---------------------------------------------------------------".cyan);
    for (var i = 0; i < res.length; i++) {
      if (res[i].item_id < 10) {
        console.log(res[i].item_id + "       | ".cyan + res[i].product_name + "|".cyan + "  $" + res[i].price);
      }
      else if (res[i].item_id >= 10) {
        console.log(res[i].item_id + "      | ".cyan + res[i].product_name + "|".cyan + "  $" + res[i].price);
      }
    }
    totalItemsLength = res.length + 1;
    console.log("\n");
    buyProduct();
  });
}

function buyProduct() {
  inquirer
    .prompt([
      {
        name: "itemId",
        type: "input",
        message: "What item # would you like to buy?",
        validate: function (value) {
          var input = parseInt(value.trim());
          if (isNaN(input) === false && input <= totalItemsLength && input > 0) {
            return true;
          } else {
            console.log("Must be equal to an item #. Try Again.")
            return false;
          }
        }
      },
      {
        name: "requestedQty",
        type: "input",
        message: "How many would you like?",
        validate: function (value) {
          var input = parseInt(value.trim());
          if (isNaN(input)) {
            console.log("Must be a number. Try again.");
            return false;
          } else {
            console.log("You want" + input + "many?");
            return true;
          }
        }
      },
    ]).then(function (answer) {
      connection.query("SELECT * FROM products WHERE ?", { item_id: answer.itemId }, function (err, res) {
        if (answer.requestedQty <= res[0].stock_quantity) {
          var qtyUpdate = (res[0].stock_quantity - answer.requestedQty).toFixed(2);
          connection.query("UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: qtyUpdate
              },
              {
                item_id: answer.itemId
              }
            ],
            function (err, res) {
              if (err) throw err;
            }
          );
          customerTotal(answer.requestedQty, res[0].price);
        }
        else {
          console.log("Only ".red + res[0].stock_quantity + " left in stock!".red);
          connection.end();
        }
      });
    })
}
function customerTotal(qty, price) {
  console.log("Qty: ".cyan + qty);
  console.log("Price each:".cyan + " $" + price);
  console.log("Customer Total".yellow + " = $" + (qty * price));
  connection.end();
}
