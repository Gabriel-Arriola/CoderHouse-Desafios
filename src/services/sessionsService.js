import logger from "../config/logger.js";
import UserDTO from "../dao/dto/sessionsDTO.js";
import sessionsRepository from "../repository/sessionsRepository.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt'
import { sendEmail, sendPasswordResetEmail } from "./mailingService.js";
import fs from 'fs';
import { userModel } from "../dao/models/user.js";

export const login = async (req, res) => {
    try {
        await sessionsRepository.update({ _id: req.user._id }, { last_connection: new Date() });
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "Login successful!", usuario: req.user });
    } catch (error) {
        logger.error("Failed to update last connection: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        await sessionsRepository.update({ _id: req.user._id }, { last_connection: new Date() });
        req.session.destroy(e => {
            if (e) {
                console.error("Error destroying session:", e);
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json({
                    error: `Internal Server Error`,
                    detalle: `${e.message}`
                });
            }
        });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({message: `User with id: ${req.user._id} has successfully completed the session`})
    } catch (error) {
        logger.error("Failed to update last connection: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const uploadDocuments = async (req, res) => {
    try {
        const { uid } = req.params;
        const files = req.files;
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }
        const documents = [];
        for (const key in files) {
            files[key].forEach(file => {
                documents.push({
                    name: file.fieldname,
                    reference: file.path
                });
            });
        }
        await sessionsRepository.update({ _id: uid }, { documents: [] });
        const updatedUser = await sessionsRepository.update({ _id: uid }, { $push: { documents: { $each: documents } } });
        return res.status(200).json({ message: "Documents uploaded successfully", usuario: updatedUser });
    } catch (error) {
        logger.error("Error uploading documents: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const changeUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await sessionsRepository.getBy({ _id: uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const requiredDocuments = ["Identification", "Proof of address", "Proof of account status"];
        const userDocuments = user.documents || [];
        const userDocumentNames = userDocuments.map(doc => doc.name);
        const missingDocuments = requiredDocuments.filter(doc => !userDocumentNames.includes(doc));
        if (missingDocuments.length > 0) {
            return res.status(400).json({ error: `The following documents are missing in order to change the role: ${missingDocuments.join(", ")}` });
        }
        let newRole = '';
        if (user.rol === 'user') {
            newRole = 'premium';
        } else if (user.rol === 'premium') {
            newRole = 'user';
        } else {
            return res.status(400).json({ error: "The role is not valid for this operation" });
        }
        for (const document of userDocuments) {
            try {
                fs.unlinkSync(document.reference);
                logger.info(`File deleted successfully  ${document.reference}: `);
            } catch (err) {
                logger.error(`Error deleting file ${document.reference}: `, err);
            }
        }
        const updatedUser = await sessionsRepository.update(
            { _id: uid },
            { rol: newRole, documents: [] }
        );
        logger.info(`User role ${user.email} updated to ${newRole}`);
        return res.status(200).json({ message: "Role updated successfully", usuario: updatedUser });
    } catch (error) {
        logger.error("changeUserRole => ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getCurrentUser = (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({userDTO});
};

export const githubLogin = (req, res) => {
    console.log("GitHub login service");
};

export const githubCallback = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "Login successful!", usuario: req.user });
};

export const handleError = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: "Internal Server Error" });
};

export const register = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "registration successful!", usuario: req.user });
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await sessionsRepository.getBy({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const token = crypto.randomBytes(20).toString('hex');
        const expirationTime = Date.now() + 3600000; // 1 hora
        await sessionsRepository.update({ email }, {
            resetPasswordToken: token,
            resetPasswordExpires: expirationTime
        });
        const resetUrl = `http://localhost:8000/reset-password/${token}`;
        await sendPasswordResetEmail(email, resetUrl);
        return res.status(200).json({ message: "Reset link sent" });
    } catch (error) {
        logger.error("Error in requestPasswordReset: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await sessionsRepository.getBy({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        const isSamePassword = bcrypt.compareSync(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "The new password cannot be the same as the old one." });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await sessionsRepository.update({ _id: user._id }, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        logger.error("Error in resetPassword: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await sessionsRepository.deleteUser(userId);
        if (deletedUser) {
            logger.warn(`User with id ${userId} was deleted successfully`)
            return res.status(200).json({ user: "deleted user" });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        logger.error("Error in deleteUser: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllUsers = async(req,res)=>{
    try {
        const allUsers = await sessionsRepository.get()
        res.json(allUsers);
    } catch (error) {
        logger.error("Error getting users - Error getting users -", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteInactiveUsers = async (req, res) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 1);
    try {
        const usersToDelete = await userModel.find({
            rol: { $ne: 'admin' },
            last_connection: { $lt: twoDaysAgo }
        });
        await userModel.deleteMany({
            _id: { $in: usersToDelete.map(user => user._id) }
        });
        usersToDelete.forEach(async (user) => {
            const subject = 'Account deleted due to inactivity';
            const html = `<p>Dear <b>${user.name}</b>,</p>
                        <p><b>Your account has been deleted due to inactivity over the past 2 days.</b></p>`;
            await sendEmail(user.email, subject, html);
            logger.info(`Users with email ${user.email} have been deleted due to inactivity. Email has been sent`)
        });
        res.status(200).send({ message: 'Inactive users deleted and emails sent.' });
    } catch (error) {
        logger.error('Error deleting inactive users: ', error);
        res.status(500).send({ error: 'Internal Server Error.' });
    }
};