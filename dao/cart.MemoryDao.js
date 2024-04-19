import { cartModel } from "./models/carts.models.js";

export class CartDao {
  static async getCart() {
    try {
      return await cartModel.find();
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }

  static async createCart(cartData) {
    try {
      const newCart = new cartModel(cartData);
      await newCart.save();
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  static async findCartById(cid) {
    try {
      const cart = await cartModel.findById(cid);
      return cart;
    } catch (error) {
      throw error;
    }
  }

  static async saveCart(cart) {
    try {
      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  static async deleteProductFromCart(cartId, productId) {
    try {
      const result = await cartModel.updateOne(
        { _id: cartId },
        { $pull: { carrito: { producto: productId } } }
      );
  
      return result.nModified > 0;
    } catch (error) {
      throw error;
    }
  }
  
}
