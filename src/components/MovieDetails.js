// import React, { useState } from 'react';
// import { useQuery, useMutation } from '@apollo/client';
// import { GET_MOVIE_DETAILS, LIKE_MOVIE, DISLIKE_MOVIE } from '../graphql';
// import FeedbackModal from './FeedbackModal';
// import { useParams } from 'react-router-dom';

// function MovieDetails() {
//     const { id } = useParams();
//     console.log("movieId:", id);  // Debugging to check if id is passed correctly
    
//     const { data, loading, error, refetch } = useQuery(GET_MOVIE_DETAILS, {
//         variables: { id: parseInt(id) }
//     });
    
//     const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    
//     const [likeMovie] = useMutation(LIKE_MOVIE, {
//         variables: { movieId: id },
//         optimisticResponse: {
//             __typename: "Mutation",
//             likeMovie: {
//                 __typename: "Movie",
//                 id: id,
//                 likes: data?.movie?.likes + 1 || 1,
//                 dislikes: data?.movie?.userRating === 'dislike' 
//                     ? data?.movie?.dislikes - 1 
//                     : data?.movie?.dislikes || 0,
//                 userRating: 'like'
//             }
//         },
//         onCompleted: () => refetch()
//     });

//     const [dislikeMovie] = useMutation(DISLIKE_MOVIE, {
//         variables: { movieId: id },
//         optimisticResponse: {
//             __typename: "Mutation",
//             dislikeMovie: {
//                 __typename: "Movie",
//                 id: id,
//                 likes: data?.movie?.userRating === 'like' 
//                     ? data?.movie?.likes - 1 
//                     : data?.movie?.likes || 0,
//                 dislikes: data?.movie?.dislikes + 1 || 1,
//                 userRating: 'dislike'
//             }
//         },
//         onCompleted: () => refetch()
//     });

//     if (loading) return <div>Loading...</div>;
//     if (error) {
//         console.error("Error fetching movie details:", error);
//         return <div>Error: {error.message}</div>;
//     }

//     const movie = data.movie;

//     return (
//         <div className="movie-details">
//             {/* Your existing movie details */}
//             <h1>{movie.title}</h1>
//             <img src={movie.poster} alt={movie.title} />
            
//             <div className="feedback-section">
//                 <h3>Audience Feedback</h3>
                
//                 <div className="rating-summary">
//                     <div className="likes-dislikes">
//                         <span className="likes" onClick={likeMovie} style={{ cursor: 'pointer' }}>
//                             👍 {movie.likes}
//                         </span>
//                         <span className="dislikes" onClick={dislikeMovie} style={{ cursor: 'pointer' }}>
//                             👎 {movie.dislikes}
//                         </span>
//                     </div>
//                 </div>
                
//                 <button 
//                     className="give-feedback-btn"
//                     onClick={() => setShowFeedbackModal(true)}
//                 >
//                     {movie.isWatched ? 'Give Feedback' : 'Mark as Watched & Review'}
//                 </button>
                
//                 <div className="comments">
//                     <h4>Comments</h4>
//                     {movie.comments.length > 0 ? (
//                         movie.comments.map(comment => (
//                             <div key={comment.id} className="comment">
//                                 <div className="comment-header">
//                                     <span className="user">{comment.user.username}</span>
//                                     <span className="date">
//                                         {new Date(comment.createdAt).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                                 <p className="comment-text">{comment.text}</p>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No comments yet. </p>
//                         // Be the first to share your thoughts!
//                     )}
//                 </div>
//             </div>
            
//             {showFeedbackModal && (
//                 <FeedbackModal 
//                     movie={movie} 
//                     onClose={() => setShowFeedbackModal(false)}
//                 />
//             )}
//         </div>
//     );
// }

// export default MovieDetails;
