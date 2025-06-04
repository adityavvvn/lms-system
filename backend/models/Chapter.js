import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a chapter title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a chapter description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide a YouTube video URL'],
    validate: {
      validator: function(v) {
        // Basic YouTube URL validation
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v);
      },
      message: props => `${props.value} is not a valid YouTube URL!`
    }
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: [1, 'Order must be at least 1']
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure order is unique within a course
chapterSchema.index({ course: 1, order: 1 }, { unique: true });

// Method to get video ID from YouTube URL
chapterSchema.methods.getVideoId = function() {
  const url = this.videoUrl;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Method to get embed URL
chapterSchema.methods.getEmbedUrl = function() {
  const videoId = this.getVideoId();
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

// Auto-increment order for new chapters
chapterSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const lastChapter = await this.constructor
      .findOne({ course: this.course })
      .sort({ order: -1 });

    this.order = lastChapter ? lastChapter.order + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);

export default Chapter; 