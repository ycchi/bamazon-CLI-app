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

// startBamazon
function startBamazon () {
   console.log(`

   ====================
   WELCOME TO BAMAZON!
   ====================

   `);

   // select all items from our database
   db.query("SELECT * FROM products", function(err, productData){

      if (err) throw err;

      // ask user what they would like to buy
      inquirer.prompt([
         {
            name: "product_name",
            message: "What would you like to purchase?",
            type: "list",
            choices: productData
               .map(product => product.product_name)
         }, {
            name: "quantity",
            message: "How many would you like to purchase?",
            validate: function(quantity) {
               if(!isNaN(quantity)) {
                  return true;
               }
            }
         }
      ]).then(function(userPick){
         // userPick => {product_name: 'Pistachio', quantity: '3'} 
         
         // extract which product user picked using .find()
         const selectedProduct = productData.find(product => product.product_name === userPick.product_name);

         // check for sufficient quantity
         console.log(selectedProduct.stock_quantity);
         console.log(userPick.quantity);
         
         if(selectedProduct.stock_quantity < userPick.quantity) {
            console.log("Insufficient Quantity...");
            // start over
            startBamazon();
         } else {
            // process order
            console.log("Order Processing...")
            
            // reflect change on stock_quantity in DB
            db.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [selectedProduct.stock_quantity - userPick.quantity, selectedProduct.item_id], function(err, response) {

               if (err) throw err;

               // let user know their total
               let total = userPick.quantity * selectedProduct.price;
               console.log(`Your total is... $${total}`);
            })
         }

      })
   })

};

startBamazon();