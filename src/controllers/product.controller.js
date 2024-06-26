import jwt from "jsonwebtoken";
import ProductService from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.get();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getProductsPaginated = async (req, res) => {
  const { limit = 10, page = 1, sort, category, status } = req.query;
  const url =
    "https://pithy-station-production.up.railway.app/api/products/productsPaginated/all";

  try {
    const result = await ProductService.getProductsPaginated(
      limit,
      page,
      sort,
      category,
      status,
      url
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getProductById = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await ProductService.getById(pid);
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (req, res, next) => {
  const { body } = req;
  let newProduct = {};
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token inválido o expirado");
      }
      newProduct = { ...body, owner: decoded.user.email };
    });
  } else {
    newProduct = { ...body };
  }
  try {
    const product = await ProductService.create(newProduct);
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const updatedFields = req.body;
  try {
    await ProductService.updateById(pid, updatedFields);
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  const { user } = req;
  try {
    await ProductService.deleteById(pid, user);
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const getMockingProducts = async (req, res) => {
  try {
    const result = await ProductService.generateMockingProducts();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
