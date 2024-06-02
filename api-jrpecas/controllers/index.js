const ProductController = require("./products");
const ClientController = require("./clients");
const SubCategoryController = require("./subcategories");
const CategoryController = require("./categories");
const OrderController = require("./orders");
const OrderProductController = require("./orders-products");

module.exports = { 
    ProductController, 
    ClientController, 
    CategoryController, 
    SubCategoryController,
    OrderController,
    OrderProductController 
};

