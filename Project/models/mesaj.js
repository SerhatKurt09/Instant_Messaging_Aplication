const mongoose =require('mongoose')
const Schema =mongoose.Schema

const mesajSchema =new Schema({
    title: {
        type:String,
        require:true
    },
    short:{
        type:String,
        require:true
    },
    long:{
        type:String,
        require:true
    }
},{timestamps:true})

const Mesajlasma = mongoose.model('Mesajlasma',mesajSchema)
module.exports =Mesajlasma