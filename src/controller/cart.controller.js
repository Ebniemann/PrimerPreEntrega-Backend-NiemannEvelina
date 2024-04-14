import { cartModel } from "../dao/models/carts.models.js";
import { productsModels } from "../dao/models/products.models.js";
import mongoose from "mongoose";
import { CartService } from "../services/cart.service.js";
import { ProductService } from "../services/products.service.js";

export class CartController {
  static async getCart(req, res) {
    try {
      const carts = await CartService.getCart();
      res.status(200).json({ carts });
    } catch (error) {
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
      });
    }
  }

  static async postCart(req, res) {
    let { name, products } = req.body;

    try {
      const productIds = products.map(
        (pid) => new mongoose.Types.ObjectId(pid)
      );
      const usuario = await usuarioModels.findById(req.usuario._id);
      if (usuario.rol === "premium") {
        const ownedProducts = await ProductService.getOwnedProducts(
          usuario._id,
          productIds
        );
        if (ownedProducts.length > 0) {
          return res.status(403).json({
            error:
              "Un usuario premium no puede agregar sus propios productos al carrito.",
          });
        }
      }

      const newCart = await CartService.createCart(name, productIds);

      res.status(200).json({ newCart });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
        details: error.message,
      });
    }
  }

  static async putCart(req, res) {
    const currentUser = req.user;
    const { cid, pid, quantity } = req.params;

    try {
      if (
        currentUser.rol === "premium" &&
        product.owner.equals(currentUser._id)
      ) {
        throw CustomErrors.CustomErrors(
          "Un usuario premium no puede agregar a su carrito un producto que le pertenece",
          STATUS_CODE.FORBIDDEN
        );
      }

      const updateCart = await CartService.updateCart(cid, pid, quantity);
      res.status(201).json(updateCart);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
        details: error.message,
      });
    }
  }

  static async deleteProductCart(req, res) {
    const { cid, pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.setHeader("Content-type", "application/json");
      return res.status(400).json({ error: "Ingrese un id válido." });
    }

    try {
      const result = await CartService.deleteProductCart(cid, pid);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: result });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Error del lado del servidor" });
    }
  }

  static async deleteCart(req, res) {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      res.setHeader("Content-type", "application/json");
      return res
        .status(400)
        .json({ error: "Ingrese un ID válido para el carrito." });
    }

    try {
      const result = await CartService.deleteCart(cid);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        payload: result,
      });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: "Error del lado del servidor",
      });
    }
  }

  static async purchaseCart() {
    const { cid } = req.params;

    try {
      const resultado = await CartService.purchaseCart(cid);
      res.status(200).json(resultado);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: "Error inesperado del lado del servidor",
        details: error.message,
      });
    }
  }
}
