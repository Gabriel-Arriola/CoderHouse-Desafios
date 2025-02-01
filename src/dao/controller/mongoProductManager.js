import logger from "../../config/logger.js";
import {
    getProductsService,
    getProductByIdService,
    addProductService,
    updateProductService,
    deleteProductService
} from "../../services/productsManagerDBService.js";
import { CustomError } from "../../utils/customError.js";
import { ERROR_TYPES } from "../../utils/errorTypes.js";

export const getProducts = async (req, res, next) => {
    try {
        const products = await getProductsService(req.query);
        res.json(products);
    } catch (error) {
        logger.error("Error getting products:", error);
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const product = await getProductByIdService(pid);
        if (!product) {
            throw CustomError.createError(
                "ProductNotFoundError",
                `Product with id ${pid} not found`,
                ERROR_TYPES.PRODUCT_NOT_FOUND.message,
                ERROR_TYPES.PRODUCT_NOT_FOUND.code
            );
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({message: "Error finding product, please contact the administrator"});
        logger.error("Error getting product by ID:", error);
    }
};

export const addProduct = async (req, res, next) => {
    const productData = req.body;
    productData.owner = req.user._id;
    try {
        const newProduct = await addProductService(productData);
        logger.debug(`Product successfully added by user ${productData.owner}`.green)
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({message: "Error finding product, please contact the administrator"});
        logger.error("Error adding product:", error);
    }
};

export const updateProduct = async (req, res, next) => {
    const { pid } = req.params;
    const updateData = req.body;
    try {
        const updatedProduct = await updateProductService(pid, updateData);
        res.json(updatedProduct);
        logger.debug(`Product with id: ${pid} was updated`.green)
    } catch (error) {
        logger.error("Error updating product:", error);
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const product = await getProductByIdService(pid);
        if (!product) {
            throw CustomError.createError(
                "ProductNotFoundError",
                `Product with id ${pid} not found`,
                ERROR_TYPES.PRODUCT_NOT_FOUND.message,
                ERROR_TYPES.PRODUCT_NOT_FOUND.code
            );
        }

        if (req.user.rol !== "admin" && product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to remove this product" });
        }

        const deletedProduct = await deleteProductService(pid);
        logger.debug(`Product with id: ${pid} was successfully removed`.green)
        res.json({ deletedProduct });
    } catch (error) {
        logger.error("Error deleting product:", error);
        next(error);
    }
};
