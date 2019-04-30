// import inquirer and mysql packages
const inquirer = require("inquirer");
const mysql = require("mysql");
const dotenv = require('dotenv').config();

// establish connection to database
const db = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: process.env.SQL_PW,
   database: "bamazon"
});

function viewMenu(){
   inquirer.prompt([
      {
         name: "managerAction",
         message: "Manager Menu",
         type: "list",
         choices: 
            [
               "View Products for Sale",
               "View Low Inventory",
               "Add to Inventory",
               "Add New Product"
            ]
      }
   ]).then(function(managerPick){
      console.log(managerPick);

      switch(managerPick.managerAction){
         case ("View Products for Sale"):
            viewProducts();
            break;
         case("View Low Inventory"):
            viewLowInventory();
            break;
         case("Add to Inventory"):
            addInventory();
            break;
         case("Add New Product"):
            addNewProduct();
            break;
         default:
            false;
      }         
   })
}

function viewProducts() {
   console.log(`view products`)
   
   // list every available item
   db.query("SELECT * FROM products", function(err, productData){
      if (err) throw err;
      console.log (productData);
   })
   console.log(`Press Up/Down Arrow Keys to make selection`);
   viewMenu();
};

function viewLowInventory() {
   console.log(`view low inventory`)
   // list every available item and filter 
   db.query("SELECT * FROM products", function(err, productData){
      if (err) throw err;

      // function to apply in .filter()
      function lowInventory (currentProduct) {
         return currentProduct.stock_quantity < 5;
      }

      let lessThanFive = productData.filter(lowInventory);
      console.log(lessThanFive);

   })
   console.log(`Press Up/Down Arrow Keys to make selection`);

   viewMenu();
};

function addInventory() {
   console.log(`add inventory`)

   // ask manager which item to update inventory
   db.query("SELECT * FROM products", function(err, productData){
      inquirer.prompt([
         {
            name: "product_name",
            message: "Which product would you like to update its inventory?",
            type: "list",
            choices: productData.map(product => product.product_name)
         }, {
            name: "quantity",
            message: "Please provide quantity",
            validate: function(quantity){
               if(!isNaN(quantity)) {
                  return true;
               }
            }
         }
      ]).then(function(managerPick){
         // managerPick => {product_name: "Pistachio", quantity: "4"}
         
         // extract product from list using .find()
         const selectedProduct = productData.find(product => product.product_name === managerPick.product_name);
   
         // reflect change on stock_quantity in DB
         db.query("UPDATE products Set stock_quantity = ? WHERE item_id = ?", [managerPick.quantity, selectedProduct.item_id], function(err, response) {
            if (err) throw err;
   
            // let manager know updated quantity.
            console.log(`quantity updated!`)
         })
      })
   })
};

function addNewProduct() {
   console.log(`add new product`)

   // inquire prompt - ask product_name, deparment_name, price, stock_quantity
   inquirer.prompt([
      {
         name: "product_name",
         message: "New product name: ",
         validate: function(inputValue) {
            if (inputValue !== "") {
              return true;
            }
            else {
              return "Please provide a product name"
            }
          }
      }, {
         name: "department_name",
         message: "Department name: ",
         validate: function(inputValue) {
            if (inputValue !== "") {
              return true;
            }
            else {
              return "Please provide a department name"
            }
          }
      }, {
         name: "price",
            message: "Price: ",
            validate: function(quantity) {
               if(!isNaN(quantity)) {
                  return true;
               }
            }
      }, {
         name: "stock_quantity",
            message: "Quantity: ",
            validate: function(quantity) {
               if(!isNaN(quantity)) {
                  return true;
               }
            }
      }
   ]).then(function(newProduct){
      // newProduct
      console.log(newProduct);

      // add to database
      let queryString = "INSERT INTO products SET ?";

      db.query(queryString, newProduct, function(err, response){
         if (err) throw err;

         // let manager know product has been added
         console.log(`Product successfully added!`)

         // return to menu
         viewMenu();
      })
   })


}


viewMenu();