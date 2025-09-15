import ProductService from "./product.service";

class ProductController {
  /**
   * @description Get All Products List
   * @param {*} req
   * @param {*} res
   */
  static async index(req, res) {
    console.log("yes in", req.user);
    const { message, status, data, totalPages, currentPage } =
      await ProductService.index(req.query);
    return res.json({ message, data, totalPages, currentPage }).status(status);
  }

  /**
   * @description add product
   * @param {*} req
   * @param {*} res
   */
  static async create(req, res) {
    const { message, status, data } = await ProductService.create(
      req.body,
      req.files
    );

    res.status(status).json({
      success: status !== 200 && !data ? false : true,
      message: message,
      data: data,
    });
  }

  static async update(req, res) {
    const id = req.params.id;

    const { message, status, data } = await ProductService.update(
      id,
      req.body,
      req.files
    );

    return res.json({ message: message }).status(status);
  }

  static async updateStatus(req, res) {
    let id = req.params.id;
    const { message, status } = await ProductService.updateStatus(id, req.body);

    return res.json({ message }).status(status);
  }

  static async delete(req, res) {
    let id = req.params.id;
    const { message, status } = await ProductService.delete(id);
    return res.json({ message }).status(status);
  }
}
export default ProductController;
