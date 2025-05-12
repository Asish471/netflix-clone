import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SUBMIT_FEEDBACK, MARK_AS_WATCHED, ADD_COMMENT } from '../graphql';

function FeedbackModal({ movie, onClose }) {
    console.log("movie",movie);
    
  const [rating, setRating] = useState(null);
  const [starRating, setStarRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('rating');
  
  const [markAsWatched] = useMutation(MARK_AS_WATCHED);
  const [submitFeedback] = useMutation(SUBMIT_FEEDBACK);
  const [addComment] = useMutation(ADD_COMMENT);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First mark as watched if not already
      await markAsWatched({
        variables: { movieId: movie.id }
      });
      
      // Submit rating if provided
      if (rating || starRating > 0) {
        await submitFeedback({
          variables: {
            movieId: movie.id,
            rating,
            starRating: starRating > 0 ? starRating : null
          },
          refetchQueries: ['GetMovieDetails']
        });
      }
      
      // Submit comment if provided
      if (comment.trim()) {
        await addComment({
          variables: {
            movieId: movie.id,
            text: comment
          },
          refetchQueries: ['GetMovieDetails']
        });
      }
      
      onClose();
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };
  
  return (
    <div className="feedback-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Rate {movie.title}</h2>
        
        {/* <div className="tabs">
          <button 
            className={activeTab === 'rating' ? 'active' : ''}
            onClick={() => setActiveTab('rating')}
          >
            Rating
          </button>
          <button 
            className={activeTab === 'comment' ? 'active' : ''}
            onClick={() => setActiveTab('comment')}
          >
            Comment
          </button>
        </div> */}
        
        <form onSubmit={handleSubmit}>
          {activeTab === 'rating' && (
            <div className="rating-section">
              <div className="simple-rating">
                <h4>Did you like this movie?</h4>
                <div className="like-buttons">
                  <button 
                    type="button"
                    className={`like-btn ${rating === 'like' ? 'active' : ''}`}
                    onClick={() => setRating('like')}
                  >
                    👍 Like
                  </button>
                  <button 
                    type="button"
                    className={`dislike-btn ${rating === 'dislike' ? 'active' : ''}`}
                    onClick={() => setRating('dislike')}
                  >
                    👎 Dislike
                  </button>
                </div>
              </div>
              
              {/* <div className="star-rating">
                <h4>Rate (1-5 stars)</h4>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= starRating ? 'filled' : ''}`}
                      onClick={() => setStarRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div> */}
            </div>
          )}
          
          {activeTab === 'comment' && (
            <div className="comment-section">
              <h4>Write a comment</h4>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                rows="5"
              />
            </div>
          )}
          
          <button type="submit" className="submit-btn">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackModal;