import productModel from "./models/product.model.js";

export default class ProductManager {
  static get() {
    return productModel.find();
  }

  static async getById(id) {
    const product = await productModel.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  static async addProduct(data) {
    try {
      const product = await productModel.create(data);
      console.log("Producto creado correctamente.");
      return product;
    } catch (error) {
      console.error(`Ha ocurrido un error: ${error.message}`);
    }
  }

  static async updateById(pid, data) {
    try {
      const product = await productModel.getById(pid);
    } catch (error) {
      console.error(`Ha ocurrido un error: ${error.message}`);
    }

    if (product) {
      try {
        await productModel.updateOne({ _id: pid }, { $set: data });
        console.log("Producto actualizado correctamente.");
      } catch (error) {
        console.error(`Ha ocurrido un error: ${error.message}`);
      }
    }
  }

  static async deleteById(pid) {
    try {
      await productModel.deleteOne({ _id: pid });
      console.log("El producto ha sido eliminado correctamente.");
    } catch (error) {
      console.error(`Ha ocurrido un error: ${error.message}`);
    }
  }

  static async getProductsPaginated(
    criteria,
    options,
    sort,
    category,
    url,
    status
  ) {
    const products = await productModel.paginate(criteria, options);
    let categoryQuery = "";
    let sortQuery = "";
    let statusQuery = "";
    if (category) {
      categoryQuery = `&category=${category}`;
    }

    if (sort) {
      sortQuery = `&sort=${sort}`;
    }

    if (status) {
      statusQuery = `&status=${status}`;
    }

    return {
      status: "success",
      payload: products.docs.map((doc) => doc.toJSON()),
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `${url}?limit=${products.limit}&page=${products.prevPage}${categoryQuery}${sortQuery}${statusQuery}`
        : null,
      nextLink: products.hasNextPage
        ? `${url}?limit=${products.limit}&page=${products.nextPage}${categoryQuery}${sortQuery}${statusQuery}`
        : null,
    };
  }
}
