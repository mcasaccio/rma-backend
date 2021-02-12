const { response } = require("express");
const bcrypt = require("bcryptjs");

const { generateToken } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const { getMenuFrontEnd } = require("../helpers/menu-frontend");

// models
const User = require("../models/user");

const login = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		// Verificar email
		const userDB = await User.findOne({ email });

		if (!userDB) {
			return res.status(404).json({
				ok: false,
				msg: "Email o contraseña incorrectos",
			});
		}

		// Verificar contraseña
		const validPassword = bcrypt.compareSync(password, userDB.password);
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "Email o contraseña incorrectos",
			});
		}

		// Generar el TOKEN - JWT
		const token = await generateToken(userDB.id);

		res.json({
			ok: true,
			token,
			menu: getMenuFrontEnd(userDB.role),
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const googleSignIn = async (req, res = response) => {
	const googleToken = req.body.token;

	try {
		const { name, email, picture } = await googleVerify(googleToken);

		const userDB = await User.findOne({ email });
		let user;

		if (!userDB) {
			// si no existe el user
			user = new User({
				name,
				email,
				password: "@@@",
				img: picture,
				google: true,
			});
		} else {
			// existe user
			user = userDB;
			user.google = true;
		}

		// Guardar en DB
		await user.save();

		// Generar el TOKEN - JWT
		const token = await generateToken(user.id);

		res.json({
			ok: true,
			token,
			menu: getMenuFrontEnd(user.role),
		});
	} catch (error) {
		res.status(401).json({
			ok: false,
			msg: "Token no es correcto",
		});
	}
};

const renewToken = async (req, res = response) => {
	const uid = req.uid;

	// Generar el TOKEN - JWT
	const token = await generateToken(uid);

	// Obtener el user por UID
	const user = await User.findById(uid);

	res.json({
		ok: true,
		token,
		user,
		menu: getMenuFrontEnd(user.role),
	});
};

module.exports = {
	login,
	googleSignIn,
	renewToken,
};
