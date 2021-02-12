const { response } = require("express");

// model
const Order = require("../models/order");
const User = require("../models/user");

const createOrder = async (req, res = response) => {
	const { client, servedBy, reason, provider, product, type } = req.body;

	if (!reason) {
		res.status(400).json({
			ok: false,
			msg: "Falta el motivo",
		});
	}
	if (!type) {
		res.status(400).json({
			ok: false,
			msg: "Falta el tipo",
		});
	}

	try {
		console.log(req.body);
		order = new Order({
			client,
			servedBy,
			reason,
			provider,
			product,
			type,
		});
		newOrder = await order.save();

		res.status(201).json({
			ok: true,
			newOrder,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const getOrderDashboard = async (req, res = response) => {
	try {
		const totalOrders = await Order.find().countDocuments();
		const totalOrderPending = await Order.find({
			status: "pending",
		}).countDocuments();
		const orders = await Order.find().sort({ createAt: "descending" }).limit(10).populate("client", "name").populate("servedBy", "name");

		res.status(200).json({
			ok: true,
			orders,
			total: totalOrders,
			pending: totalOrderPending,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const getOrderById = async (req, res = response) => {
	const id = req.params.id;
	if (!id) {
		res.status(200).json({
			ok: false,
			msg: "Falta el ID",
		});
	}
	try {
		users = await User.find();

		const order = await Order.findOne({ _id: id }).populate("client", "name").populate("servedBy", "name");

		if (!order) {
			res.status(200).json({
				ok: false,
				msg: "No existe la orden especificada",
			});
		}

		res.status(200).json({
			ok: true,
			order,
			users,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const updateOrder = async (req, res = response) => {
	const { id } = req.params;

	try {
		const orderFind = await Order.findById(id);

		if (!orderFind) {
			res.status(400).json({
				ok: false,
				msg: `No existe la orden`,
			});
		}

		const updateOrder = req.body;

		delete updateOrder._id;
		delete updateOrder.order;

		await Order.findByIdAndUpdate(id, updateOrder);

		res.status(200).json({
			ok: true,
			msg: `Orden #${id} actualizada`,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
		});
	}
};

const getSearchOrders = async (req, res = response) => {
	const { searchTerm, completed } = req.body;

	const searchTermRegex = new RegExp(searchTerm, "i");

	const querySearch = [{ product: searchTermRegex }, { provider: searchTermRegex }];
	const clients = [];


	try {
		const usersFound = await User.find({ name: searchTermRegex }, "uid");

		if (usersFound.length >= 1) {
			usersFound.map((res) => {
				clients.push({ client: res._id });
			});
		}

		let orderFind = await Order.find({
			$or: [...querySearch, ...clients],
		}).populate('client', 'name').populate('servedBy', 'name');

        if(completed){
            orderFind = orderFind.filter(order => order.status === 'completed')

        }

		res.status(200).json({
			ok: true,
			orderFind,
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
	createOrder,
	getOrderById,
	updateOrder,
	getOrderDashboard,
	getSearchOrders,
};
