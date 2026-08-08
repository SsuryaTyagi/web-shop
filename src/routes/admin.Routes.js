const {Router} = require("express")
const {adminAuth} = require("../middlewares/adminAuth")
const {getOrders} = require("../controllers/adminOrder.Controller.js")


const adminRoutes = Router()


adminRoutes.get("/admin/orders",adminAuth,getOrders)

module.exports = adminRoutes;