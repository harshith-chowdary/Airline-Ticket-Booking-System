import mongoose from 'mongoose';

export const bookingSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true,
        unique: true,
    },
    passengers : { 
        type: String, 
        required: true,
        unique: false,
    },
    classs : { 
        type: String, 
        required: true,
        unique: false,
    },
    departure : { 
        type: String, 
        required: true,
        unique: false,
    },
    service : { 
        type: String, 
        required: true,
        unique: false, 
    },
    booking : { 
        type: String, 
        required: true,
        unique: false, 
    },
    count : {type: String},
    status : {type: String},
    discount : {type: Number},
    cowin: {type: String}
});

export default mongoose.model.Bookings || mongoose.model('booking', bookingSchema);