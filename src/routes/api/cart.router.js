import { Router } from "express";
import {
  addToCart,
  clearCart,
  completePurchase,
  createCart,
  getCartProducts,
  getCarts,
  removeFromCart,
  updateCartItemQuantity,
} from "../../controllers/cart.controller.js";
import {
  authorization,
  handlePolicies,
  passportCall,
} from "../../utils/utils.js";

const router = Router();

router.get("/", getCarts);
router.post("/", createCart);
router.get(
  "/:cid/purchase",
  passportCall("jwt"),
  authorization("user"),
  completePurchase
);
router.get("/:cid", getCartProducts);
router.post(
  "/:cid/products/:pid",
  passportCall("jwt"),
  handlePolicies(["PUBLIC"]),
  addToCart
);
router.delete("/:cid/products/:pid", removeFromCart);
router.delete("/:cid", clearCart);
router.put("/:cid/products/:pid", updateCartItemQuantity);

export default router;
