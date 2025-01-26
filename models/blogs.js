const {Schema , model} = require('mongoose')

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps:true})


const blogModel =  model('Blogs' , blogSchema)


module.exports = blogModel