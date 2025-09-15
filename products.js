import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
    },
    description: {
      type: String,
      min: 10,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["electronics", "clothing", "books", "home"],
      required: true,
    },
    stock_quantity: {
      type: Number,
      defaultValue: 0,
    },
    sku: {
      type: String,
      // unique: true,
    },
    images: [
      {
        type: String,
      },
    ],
    // userId : {
    //     type : Schema.Types.ObjectId,
    //     ref: "Users",
    //     required: true
    // }
    status: {
      type: String,
      enum: ["active", "inactive"],
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("products", productSchema);

export default Products;