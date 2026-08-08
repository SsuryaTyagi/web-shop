const {Router} = require("express")
const {adminAuth} = require("../middlewares/adminAuth")
const {getOrders} = require("../controllers/adminOrder.Controller.js")
const { userAuth } = require("../middlewares/auth.js")


const adminRoutes = Router()


adminRoutes.get("/admin/orders",userAuth,adminAuth,getOrders)

module.exports = adminRoutes;