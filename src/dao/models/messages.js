import { Schema, model } from "mongoose";

const nameCollection = 'Message'
const MessageSchema = new Schema({

    user: {type: String, required:[true, 'Username is required']},
    message: {type: String, required:[true, 'The message is required']}
});

MessageSchema.set('toJSON',{
    transform: function(doc, ret){
        delete ret.__v;
        delete ret._id;
        return ret;
    }
})

export const messageModel = model(nameCollection, MessageSchema)