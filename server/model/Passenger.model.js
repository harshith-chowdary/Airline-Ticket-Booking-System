import mongoose from "mongoose";

export const PassengerSchema = new mongoose.Schema({
    name : {
        type: String
    },
    email: {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true,
    },
    phone:{
        type: String
    },
    ffm: { 
        type: Number
    },
});

export default mongoose.model.Passengers || mongoose.model('Passenger', PassengerSchema);