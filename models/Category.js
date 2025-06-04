import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a category title'],
    trim: true,
    unique: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title before saving
categorySchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category; 