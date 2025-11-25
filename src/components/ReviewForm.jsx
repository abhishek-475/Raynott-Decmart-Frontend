import React, { useState } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { 
  FaStar, 
  FaPaperPlane, 
  FaSmile, 
  FaFrown, 
  FaMeh,
  FaRegSmile,
  FaRegStar,
  FaSpinner
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    if (comment.length < 10) {
      toast.error('Review comment should be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await api.post(`/products/${productId}/review`, { rating, comment });
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
      onReviewAdded?.();
    } catch (err) {
      console.error('Review submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (ratingValue) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[ratingValue] || 'Select Rating';
  };

  const getRatingIcon = (ratingValue) => {
    const icons = {
      1: <FaFrown className="text-red-500" />,
      2: <FaFrown className="text-orange-500" />,
      3: <FaMeh className="text-yellow-500" />,
      4: <FaRegSmile className="text-lime-500" />,
      5: <FaSmile className="text-green-500" />
    };
    return icons[ratingValue] || <FaRegStar className="text-gray-400" />;
  };

  const characterCount = comment.length;
  const isCommentValid = characterCount >= 10;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <HiSparkles className="text-white text-lg" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
          <p className="text-gray-600 text-sm">Share your experience with this product</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Rating Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            Your Rating
            <span className="text-orange-500">*</span>
          </label>
          
          <div className="space-y-4">
            {/* Star Rating */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                >
                  <FaStar
                    className={`text-2xl ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 drop-shadow-sm'
                        : 'text-gray-300'
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>

            {/* Rating Display */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{rating}.0</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-sm ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                {getRatingIcon(rating)}
                <span className="font-medium">{getRatingLabel(rating)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            Your Review
            <span className="text-orange-500">*</span>
          </label>
          
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share detailed thoughts about the product... What did you like? What could be improved?"
              className={`w-full h-32 px-4 py-3 border rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 resize-none placeholder-gray-400 ${
                !isCommentValid && comment.length > 0
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-gray-300'
              }`}
              maxLength={500}
            />
            
            {/* Character Counter */}
            <div className={`absolute bottom-3 right-3 text-xs ${
              characterCount >= 10 
                ? 'text-green-600' 
                : characterCount > 0 
                ? 'text-orange-600' 
                : 'text-gray-400'
            }`}>
              {characterCount}/500
            </div>
          </div>

          {/* Validation Message */}
          {comment.length > 0 && comment.length < 10 && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Review should be at least 10 characters long
            </div>
          )}

          {comment.length >= 10 && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Great! Your review meets the minimum length
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 Review Tips</h4>
          <ul className="text-blue-700 text-xs space-y-1">
            <li>• Mention product quality, features, and your experience</li>
            <li>• Be honest and specific about what you liked or didn't like</li>
            <li>• Help other customers make informed decisions</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isCommentValid || comment.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Submitting Review...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Submit Review
            </>
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-center text-xs text-gray-500">
          Your review will be visible to other customers and cannot be edited once submitted.
        </p>
      </form>
    </div>
  );
}