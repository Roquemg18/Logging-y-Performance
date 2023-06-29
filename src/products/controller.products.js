const { Router } = require("express");
const FilesDao = require("../dao/files.dao");
const uploader = require("../utils/multer.utils");
const Product = require("../dao/models/products.model");
const paginate = require("mongoose-paginate-v2");
const EntityDAO = require("../dao/entity.dao");
const ProductDTO = require("../DTOs/products.dto");

const ProductsFile = new FilesDao("products.json");
const Products = new EntityDAO("products");
const router = Router();

router.get("/", async (req, res) => {
  const { user } = req.session;
  const {
    limit = 10,
    page = 1,
    sort,
    query,
    category,
    availability,
  } = req.query;

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort && { price: sort === "asc" ? 1 : -1 },
    customLabels: {
      docs: "payload",
      totalDocs: "totalProducts",
      totalPages: "totalPages",
    },
  };

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (availability) {
    filter.availability = availability;
  }

  if (query) {
    filter.$text = { $search: query };
  }

  try {
    const products = await Product.paginate(filter, options);

    const payload = products.payload.map((product) => ({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
    }));

    const totalPages = products.totalPages;
    const prevPage = products.prevPage || 1;
    const nextPage = products.nextPage || totalPages;
    const currentPage = products.page;
    const hasPrevPage = products.hasPrevPage;
    const hasNextPage = products.hasNextPage;
    const prevLink =
      hasPrevPage &&
      `/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}`;
    const nextLink =
      hasNextPage &&
      `/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}`;

    res.render("products.handlebars", {
      payload,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      prevLink,
      nextLink,
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/loadData", async (req, res) => {
  try {
    const products = await ProductsFile.getItems();
    const newProduct = await Products.insertMany(products);
    res.json({ status: "success", message: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const info = new ProductDTO(req.body);
    const newProduct = await Products.create(info);
    res.json({ status: "success", message: newProduct });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Este producto ya existe" });
    }

    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const info = new ProductDTO(req.body);

    const newProduct = await Products.update(info, id);
    Products.create(newProduct);
    res.json({ message: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    await Products.delete(pid);
    res.json({ message: "Product delete" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
