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
  showProducts();
});

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
        console.log(res[i].item_id + "       | " + res[i].product_name + "  $" + res[i].price);
      }
      else if (res[i].item_id >=10) {
        console.log(res[i].item_id + "      | " + res[i].product_name + "  $" + res[i].price);
      }
    }
    connection.end();
  });
}