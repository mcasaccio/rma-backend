const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const OrderSchema = Schema({
	client: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	servedBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
	completedAt: {
		type: Date,
	},
	withdrawedAt: {
		type: Date,
	},
	reason: {
		type: String,
		required: true,
	},
	provider: {
		type: String,
		required: true,
	},
	product: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ["budget", "warranty"],
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "completed"],
		default: "pending",
		required: true,
	},
	order: {
		type: Number,
	},
});

OrderSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "order" });
OrderSchema.method("toJSON", function () {
	const { __v, ...object } = this.toObject();
	return object;
});

module.exports = model("Order", OrderSchema);
