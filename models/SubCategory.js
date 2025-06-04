import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a subcategory title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, {
  timestamps: true
});

// Create slug from title before saving
subCategorySchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
  next();
});

// Ensure slug is unique within a category
subCategorySchema.index({ category: 1, slug: 1 }, { unique: true });

const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);

export default SubCategory; 