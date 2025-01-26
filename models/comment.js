const {Schema , model} = require('mongoose')

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blogs'
    }    
}, {timestamps:true})



const commentModel =  model('comments' , commentSchema) 


module.exports = commentModel


