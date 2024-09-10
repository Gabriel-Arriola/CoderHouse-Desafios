import { request, response } from "express";
import { cartModel } from "../models/carts.js";
import { ticketModel } from "../models/ticket.js";
import { productModel } from "../models/products.js";
import { sendEmail } from "../../services/mailingService.js";
import { CustomError } from "../../utils/customError.js";
import { ERROR_TYPES } from "../../utils/errorTypes.js";
import logger from "../../config/logger.js";

export const createTicket = async (req = request, res = response) => {
    const { cid } = req.params;
    const user = req.user;

    try {
        if (!user) {
            logger.error("User not authenticated");
            return res.status(401).json({ msg: "User not authenticated" });
        }
        logger.debug("User authenticated", user);
        const cart = await cartModel.findById(cid).populate('products.id');
        if (!cart) {
            logger.error(`The cart with id ${cid} does not exist`);
            CustomError.createError(
                "CartError",
                `The cart with id ${cid} does not exist`,
                ERROR_TYPES.CART_NOT_FOUND.message,
                ERROR_TYPES.CART_NOT_FOUND.code
            );
        }
        logger.debug("Cart found", cart);
        let totalPrice = 0;
        const ticketProducts = [];
        const notProcessedProducts = [];
        let productDetailsHtml = "";

        for (const item of cart.products) {
            logger.debug("Processing product in cart", item);

            try {
                const product = await productModel.findById(item.id._id);
                const quantity = item.quantity;

                if (!product) {
                    logger.warn(`Product with id ${item.id._id} not found`);
                    notProcessedProducts.push(item.id._id);
                    continue;
                }

                logger.debug("Product found", product);

                if (product.stock >= quantity) {
                    product.stock -= quantity;
                    await product.save();

                    const price = product.price;
                    totalPrice += price * quantity;

                    ticketProducts.push({
                        productId: product._id,
                        quantity,
                        price,
                        title: product.title,
                        description: product.description,
                    });

                    logger.debug("Product added to ticket", {
                        productId: product._id,
                        quantity,
                        price,
                        title: product.title,
                        description: product.description,
                    });

                    productDetailsHtml += `
                        <p><b>${product.title}</b></p>
                        <p>Description: ${product.description}</p>
                        <p>Unit price: ${price.toFixed(2)} (Quantity: ${quantity})</p>
                        <hr>`;
                } else {
                    logger.warn(`Product with id ${item.id._id} does not have enough stock`);
                    notProcessedProducts.push(item.id._id);
                }
            } catch (error) {
                logger.error(`Error processing product with id ${item.id._id}: ${error.message}`);
                notProcessedProducts.push(item.id._id);
            }
        }

        if (ticketProducts.length === 0) {
            logger.error("The products could not be processed due to lack of stock");
            CustomError.createError(
                "StockError",
                "The products could not be processed due to lack of stock",
                ERROR_TYPES.OUT_OF_STOCK.message,
                ERROR_TYPES.OUT_OF_STOCK.code
            );
        }

        const newTicket = new ticketModel({
            user: user._id,
            cart: cid,
            totalPrice,
            products: ticketProducts
        });

        await newTicket.save();

        logger.debug(`Ticket created and saved in the database ${newTicket}`);

        cart.products = cart.products.filter(item => notProcessedProducts.includes(item.id._id));
        await cart.save();

        logger.debug("Cart updated after ticket creation", cart);

        const subject = 'Purchase confirmation';
        const html = `
            <p>Dear <b>${user.name}</b>,</p>
            <p>You have made a successful purchase. Below are the purchased products:</p>
            ${productDetailsHtml}
            <p><b>Total: ${totalPrice.toFixed(2)}</b></p>
        `;

        await sendEmail(user.email, subject, html);
        logger.info(`User with email ${user.email} successfully made a purchase.`);

        return res.json({ msg: 'Ticket created and email sent successfully', ticket: newTicket, notProcessedProducts });
    } catch (error) {
        logger.error('Error creating ticket:', error);
        return res.status(error.code || 500).json({ msg: error.message });
    }
};

export const deleteTicket = async (req = request, res = response) => {
    const { tid } = req.params;

    try {
        const ticket = await ticketModel.findByIdAndDelete(tid);

        if (!ticket) {
            CustomError.createError(
                "TicketError",
                `Ticket with id ${tid} does not exist`,
                ERROR_TYPES.PRODUCT_NOT_FOUND.message,
                ERROR_TYPES.PRODUCT_NOT_FOUND.code
            );
        }

        return res.json({ msg: 'Ticket successfully deleted', ticket });
    } catch (error) {
        logger.error('Error deleting ticket:', error);
        return res.status(error.code || 500).json({ msg: error.message });
    }
};
