import { Router } from "express";
import ProductManager from "../../dao/productManager.js";
import CartManager from "../../dao/cartsManager.js";

const router = Router();

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/products");
  } else {
    res.render("login", { title: "Login" });
  }
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/products");
  } else {
    res.render("register", { title: "Registro" });
  }
});

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    res.render("profile", { title: "Perfil", user: req.session.user });
  }
});

router.get("/products", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const { limit = 10, page = 1, sort, category, status } = req.query;
  const criteria = {};
  const options = { limit, page };
  if (sort) {
    options.sort = { price: sort };
  }

  if (category) {
    criteria.category = category;
  }

  if (status) {
    criteria.status = status;
  }

  const url = "http://localhost:8080/products";
  const result = await ProductManager.getProductsPaginated(
    criteria,
    options,
    sort,
    category,
    url,
    status
  );

  if (isNaN(limit) || isNaN(page)) {
    return res.status(404).json({
      message: "El caracter introducido como limit o page debe ser un numero.",
    });
  }

  if (page > result.totalPages) {
    return res.status(404).json({ message: "Esta pagina no existe" });
  }

  res.render("products", {
    title: "Products",
    ...result,
    user: req.session.user,
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {});
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  const productsInCart = await CartManager.getProductsInCart(cid);
  res.render("cart", {
    products: productsInCart.map((product) => product.toJSON()),
  });
});

export default router;
