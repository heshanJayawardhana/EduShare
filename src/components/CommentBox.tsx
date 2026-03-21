import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { Comment } from '../types';
import RatingStars from './RatingStars';
import apiService from '../services/apiService';
import { getBadgeColor, getBadgeEmoji } from '../utils/badgeSystem';

interface CommentBoxProps {
  resourceId: string;
  userId?: string;
  userName?: string;
  comments: Comment[];
  onAddComment?: (comment: { content: string; rating: number }) => void;
  onDeleteComment?: (commentId: string) => void;
  canDelete?: boolean;
  showAddComment?: boolean;
  className?: string;
}

const CommentBox: React.FC<CommentBoxProps> = ({
  resourceId,
  userId,
  userName,
  comments,
  onAddComment,
  onDeleteComment,
  canDelete = false,
  showAddComment = true,
  className = '',
}) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [errors, setErrors] = useState({
    comment: '',
    rating: ''
  });

  const validateForm = () => {
    const newErrors = {
      comment: '',
      rating: ''
    };

    // Comment validation
    if (!newComment.trim()) {
      newErrors.comment = 'Comment cannot be empty';
    } else if (newComment.trim().length < 3) {
      newErrors.comment = 'Comment must be at least 3 characters';
    }

    // Rating validation
    if (newRating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    setErrors(newErrors);
    return !newErrors.comment && !newErrors.rating;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (userId && resourceId) {
        // Submit to API
        const savedComment = await apiService.submitComment({
          resourceId,
          userId,
          message: newComment.trim(),
          userName: userName || 'Anonymous User'
        });

        // Update user badge
        await apiService.updateUserBadge(userId);

        // Call parent callback
        if (onAddComment) {
          onAddComment({ content: newComment.trim(), rating: newRating });
        }

        // Reset form
        setNewComment('');
        setNewRating(0);
        setErrors({ comment: '', rating: '' });
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      // Show error message to user
      setErrors(prev => ({
        ...prev,
        comment: 'Failed to submit comment. Please try again.'
      }));
    }
  };

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: '' }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setNewRating(rating);
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const calculatePositivePercentage = () => {
    if (comments.length === 0) return 0;
    const positiveComments = comments.filter(comment => comment.isPositive).length;
    return Math.round((positiveComments / comments.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </h3>
        
        {comments.length > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-medium text-green-600">
              {calculatePositivePercentage()}% positive feedback
            </span>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {showAddComment && (
        <form onSubmit={handleSubmitComment} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <RatingStars
              rating={newRating}
              interactive={true}
              onRatingChange={handleRatingChange}
              size="md"
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.rating}
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newComment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Share your thoughts about this resource..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                errors.comment 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300'
              }`}
              rows={3}
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.comment}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="btn-primary bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">
                        {comment.userName}
                      </span>
                      <RatingStars rating={comment.rating} size="sm" />
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {comment.isPositive ? (
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      
                      {canDelete && onDeleteComment && (
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentBox;
