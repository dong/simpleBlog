module.exports = function( mongoose ) {
    var Schema   = mongoose.Schema;
    var mongoosePaginate = require('mongoose-paginate');

    var Article = mongoose.model("Article");

    var TagSchema = new Schema({
        name: String,
        numberOf: Number,
        articles : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
    });

    TagSchema.plugin(mongoosePaginate)
    mongoose.model( 'Tag', TagSchema );
}


