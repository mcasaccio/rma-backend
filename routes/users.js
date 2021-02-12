/*
    Path: '/api/users'
*/
const { Router } = require("express");
const { check } = require("express-validator");

// middlewares
const { isValidToken, isAdminRole, varlidarADMIN_ROLE_o_MismoUsuario } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

// controllers
const { getUsers, createUser, updateUser, getClients, updateClientById, getClientById } = require("../controllers/users");

const router = Router();

router.get("/", isValidToken, getUsers);

router.post(
	"/",
	[
		check("name", "El name es obligatorio").not().isEmpty(),
		check("password", "El password es obligatorio").not().isEmpty(),
		check("email", "El email es obligatorio").isEmail(),
		validateFields,
	],
	createUser
);

router.put(
	"/:id",
	[isValidToken, check("name", "El nombre es obligatorio").not().isEmpty(), check("email", "El email es obligatorio").isEmail(), validateFields],
	updateUser
);

router.post("/clients", isValidToken, getClients);
router.put("/clients/:id", [isValidToken, isAdminRole], updateClientById);
router.get("/clients/:id", isValidToken, getClientById);

// router.delete("/:id", [isValidToken, varlidarADMIN_ROLE], borrarUsuario);

module.exports = router;
