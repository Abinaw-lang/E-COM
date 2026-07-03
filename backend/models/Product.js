import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: [
        'Football Clubs',
        'National Teams',
        'Basketball Jerseys',
        'Cricket Jerseys',
        'Retro Jerseys',
        'Training Kits',
        'Limited Edition',
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports',
        'Toys',
        'Beauty',
        'Food'
      ]
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    images: [
      {
        url: {
          type: String,
          required: true
        },
        publicId: String
      }
    ],
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        userName: String,
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        comment: {
          type: String,
          maxlength: 500
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for better query performance
productSchema.index({ title: 'text', description: 'text', category: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

export default mongoose.model('Product', productSchema);
