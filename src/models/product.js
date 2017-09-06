const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'O Slug é obrigatório.'],
    trim: true,
    index: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  tags: [{
    type: String,
    required: true,
  }],
  image: {
    type: String,
    required: true,
    trim: true,
  },
  roles: [{
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  }],
});


module.exports = mongoose.model('Product', schema);
