import { Schema, model } from "mongoose";

const nameCollection = 'message';

const MessageSchema = new Schema({
    user: { type: String, required: [true, 'The USER NAME is required'] },
    message: { type: String, required: [true, 'The MESSAGE is required'] }
});

export const messageModel = model(nameCollection, MessageSchema);