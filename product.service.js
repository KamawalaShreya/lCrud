import mongoose from "mongoose";
import Products from "../../model/products";
import AppError from "../common/error-exception";
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "../common/constants";

class ProductService {
  static async index(reqQueryParams) {
    let {
      page,
      perPage,
      search,
      stock,
      category,
      priceRange,
      sortByPrice,
      sortByCreationDate,
      sortByName,
    } = reqQueryParams;

    console.log("stock", priceRange);
    let limit = (+perPage ? +perPage : DEFAULT_PER_PAGE) * 1;
    let skip = ((+page ? +page : DEFAULT_PAGE) - 1) * limit;

    const pipline = [];

    if (search) {
      pipline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    if (stock) {
      pipline.push({
        $match: {
          stock_quantity: +stock,
        },
      });
    }

    if (category) {
      pipline.push({
        $match: {
          category: category,
        },
      });
    }

    if (priceRange) {
      const [min, max] = priceRange.split("-");

      pipline.push({
        $match: {
          price: {
            $gte: +min,
            $lte: +max,
          },
        },
      });
    }

    if (sortByCreationDate) {
      pipline.push({
        $sort: {
          createdAt: 1,
        },
      });
    }

    if (sortByName) {
      pipline.push({
        $sort: {
          name: 1,
        },
      });
    }

    if (sortByPrice) {
      pipline.push({
        $sort: {
          price: -1,
        },
      });
    }

    const products = await Products.aggregate([
      ...pipline,
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const total = await Products.aggregate(pipline);

    const data = products.map((product) => ({
      ...product, // keep all product fields
      images: product.images.map((img) => `${process.env.BASE_URL}${img}`),
    }));

    return {
      data: data,
      message: "All Products",
      status: 200,
      totalPages: Math.ceil(total.length / limit),
      currentPage: +page ? +page : DEFAULT_PAGE,
    };
  }
  /**
   * Add Product
   * @param {*} reqData
   * @param {*} files
   * @returns
   */
  static async create(reqData, files) {
    const isExist = await Products.findOne({
      name: reqData.name,
      sku: reqData.sku,
    });

    console.log(reqData);
    console.log(isExist);

    if (isExist) {
      return { message: "Product Already exist.", status: 409 };
    } else {
      // console.log(files);
      let images =
        files && files.length > 0
          ? files.map((f) => `${f.destination}${f.filename}`)
          : [];
      reqData.images = images;
      const add = await Products.create(reqData);

      return { message: "Product Added Successfully", status: 200, data: add };
    }
  }

  static async update(id, reqData, files) {
    const isExist = await Products.findById(id);

    if (!isExist) {
      return { status: 404, message: "Product not found." };
    } else {
      const isProductExist = await Products.findOne({
        name: reqData.name,
        sku: reqData.sku,
      });
      if (isProductExist) {
        return { message: "Product Already exist.", status: 409 };
      }

      if (files.length > 0) {
        reqData.images = isExist.images;
        reqData.images = [
          ...reqData.images,
          files.map((f) => `${f.destination}${f.filename}`),
        ];
      }
      await Products.updateOne({ _id: isExist._id }, reqData);
      return {
        message: "Updated successfully",
        status: 200,
      };
    }
  }

  static async updateStatus(id, reqData) {
    const isExist = await Products.findById(id);

    if (!isExist) {
      return { status: 404, message: "Product not found." };
    } else {
      await Products.updateOne({ _id: isExist._id }, reqData);
      return {
        message: "Status Updated successfully",
        status: 200,
      };
    }
  }

  static async delete(id) {
    const isExist = await Products.findById(id);

    if (!isExist) {
      return { status: 404, message: "Product not found." };
    } else {
      console.log("id", isExist._id);
      await Products.deleteOne({ _id: isExist._id });
      return {
        message: "Delete Product successfully",
        status: 200,
      };
    }
  }
}
export default ProductService;
