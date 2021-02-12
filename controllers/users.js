const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateToken } = require("../helpers/jwt");

const getUsers = async (req, res) => {
	const desde = Number(req.query.desde) || 0;

	const [users, total] = await Promise.all([
		User.find({}, "name email role google img").skip(desde).limit(5),

		User.countDocuments(),
	]);

	res.json({
		ok: true,
		users,
		total,
	});
};

const createUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const existEmail = await User.findOne({ email });

		if (existEmail) {
			return res.status(400).json({
				ok: false,
				msg: "El correo ya está registrado",
			});
		}

		const user = new User(req.body);

		// Encriptar contraseña
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		// Guardar user
		await user.save();

		// Generar el TOKEN - JWT
		const token = await generateToken(user.id);

		res.json({
			ok: true,
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado... revisar logs",
		});
	}
};

const updateUser = async (req, res = response) => {
	// TODO: Validar token y comprobar si es el usuario correcto

	const uid = req.params.id;

	try {
		const userDB = await User.findById(uid);

		if (!userDB) {
			return res.status(404).json({
				ok: false,
				msg: "No existe un usuario por ese id",
			});
		}

		// Actualizaciones
		const { password, google, email, ...fields } = req.body;

		if (userDB.email !== email) {
			const existEmail = await User.findOne({ email });
			if (existEmail) {
				return res.status(400).json({
					ok: false,
					msg: "Ya existe un usuario con ese email",
				});
			}
		}

		if (!userDB.google) {
			fields.email = email;
		} else if (userDB.email !== email) {
			return res.status(400).json({
				ok: false,
				msg: "Usuario de google no pueden cambiar su correo",
			});
		}

		const userUpdated = await User.findByIdAndUpdate(
			uid,
			fields,
			{ new: true }
		);

		res.json({
			ok: true,
			user: userUpdated,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado",
		});
	}
};

const borrarUsuario = async (req, res = response) => {
	const uid = req.params.id;

	try {
		const usuarioDB = await Usuario.findById(uid);

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: "No existe un usuario por ese id",
			});
		}

		await Usuario.findByIdAndDelete(uid);

		res.json({
			ok: true,
			msg: "Usuario eliminado",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const getClients = async (req, res = response) => {
	const { searchTerm } = req.body;

	const searchTermRegex = new RegExp(searchTerm, "i");

	try {
		const usersFound = await User.find({ name: searchTermRegex });

		res.status(200).json({
			ok: true,
			usersFound,
		});
        
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador',
		});
	}
};

const updateClientById = async (req, res = response) => {
// TODO: Validar token y comprobar si es el usuario correcto

const uid = req.params.id;

try {
    const userDB = await User.findById(uid);

    if (!userDB) {
        return res.status(404).json({
            ok: false,
            msg: "No existe un usuario por ese id",
        });
    }

    // Actualizaciones
    const { password, google, email, ...fields } = req.body;

    if (userDB.email !== email) {
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un usuario con ese email",
            });
        }
    }

    if (!userDB.google) {
        fields.email = email;
    } else if (userDB.email !== email) {
        return res.status(400).json({
            ok: false,
            msg: "Usuario de google no pueden cambiar su correo",
        });
    }

    const userUpdated = await User.findByIdAndUpdate(
        uid,
        fields,
        { new: true }
    );

    res.json({
        ok: true,
        user: userUpdated,
    });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador',
		});
	}
};

const getClientById = async (req, res = response) => {
	const id = req.params.id;
	if (!id) {
		res.status(200).json({
			ok: false,
			msg: "Falta el ID",
		});
	}
	try {
	

		const user = await User.findOne({ _id: id });

		if (!user) {
			res.status(200).json({
				ok: false,
				msg: "No existe la orden especificada",
			});
		}

		res.status(200).json({
			ok: true,
			user
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador',
		});
	}
};


module.exports = {
	getUsers,
	createUser,
	updateUser,
    getClients,
    updateClientById,
    getClientById
};
