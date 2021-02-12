/*
    Path: '/api/orders'
*/
const { Router } = require("express");
const { check } = require("express-validator");

// middlewares
const { isValidToken } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

// controllers
const { createOrder, getOrderById, updateOrder, getOrderDashboard, getSearchOrders } = require("../controllers/orders");

const router = Router();

router.post(
	"/create",
	[
		isValidToken,
		check("client", "El cliente es obligatorio").not().isEmpty(),
		check("servedBy", "El creador de la orden es obligatorio").not().isEmpty(),
		check("reason", "El motivo es obligatorio").not().isEmpty(),
		check("provider", "El proveedor es obligatorio").not().isEmpty(),
		check("product", "El producto es obligatorio").not().isEmpty(),
		check("type", "El tipo es obligatorio").not().isEmpty(),
		validateFields,
	],
	createOrder
);

router.get("/view/:id", isValidToken, getOrderById);

router.post("/search", isValidToken, getSearchOrders);

router.put(
	"/view/:id",
	[
		isValidToken,
		check("status", "El estado es obligatorio").not().isEmpty(),
		check("client", "El cliente de la orden es obligatorio").not().isEmpty(),
		check("reason", "El motivo es obligatorio").not().isEmpty(),
		check("provider", "El proveedor es obligatorio").not().isEmpty(),
		check("product", "El producto es obligatorio").not().isEmpty(),
		check("type", "El tipo es obligatorio").not().isEmpty(),
		validateFields,
	],
	updateOrder
);

router.get("/dashboard", isValidToken, getOrderDashboard);

module.exports = router;
