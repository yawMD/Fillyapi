const mongoose = require('mongoose');


const ServiceEntrySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        // unique or not
        minLength:5,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    description:{
        type: String,
        required: true
    },
    category:{ 
        //linked to category entry entry or not
        type: String,
        required: true,
        // ref:"Categories"
    },
    sub_category:{
        type: String,
        required: true,
         //linked to sub-category entry entry or not
    },
    delivery_time:{
        type: String,
    },
    price:{
        type: String,
        required: true,
        trim: true,
    },
    search_tags:{
        type:String,
    },
    gigPhotos:{
        type:String,
    },
    gigVideos:{type:String}
    
},{
    timestamps: true,
})

const ServiceEntry = mongoose.model('ServiceEntry',ServiceEntrySchema)

module.exports = ServiceEntry;
