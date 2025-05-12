import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DISLIKE_COUNT_FOR_MOVIE, DISLIKE_MOVIE, GET_MOVIES_BY_ID, LIKE_COUNT_FOR_MOVIE, LIKE_MOVIE, RATE_MOVIE ,RELEATED_MOVIES_GENRE,SUBMIT_FEEDBACK} from '../graphql';
import { ArrowLeft } from 'lucide-react';

function Banner({movie}) {
  const {id} = useParams()
  console.log("bannermovies",id);
  const getMovie = useQuery(GET_MOVIES_BY_ID, {
    variables: { id: parseInt(id) },
  });
  
  const genre=getMovie?.data?.movie?.genre?.split(",")?.[0]?.trim();
  console.log("genre",genre);

  const getGenre=useQuery(RELEATED_MOVIES_GENRE,{
    variables:{genre},
    skip:!genre,
  })

  console.log("getGenre",getGenre);
  console.log("getmovie",getMovie);
  
  
  const releatedGenreMovies=getGenre?.data?.releatedMovies;
  console.log("releatedGenreMovies",releatedGenreMovies);
  

  const navigate=useNavigate()
  const [d,setD]=useState(0)
  const[l,setL]=useState(0)
  const[lcount,setLcount]=useState(0)
  const[dcount,setDcount]=useState(0)
  const[likeActive,setLikeActive]=useState(false)
  const [dislikeActive,setDislikeActive]=useState(false)
  const[activeButton,setActivebutton]=useState("")

  const userId = localStorage.getItem('userId');
  console.log("userId in banner",userId);
  


  
  
  const defaultBanner = {
    title: "Ginny & Georgia",
    description: "Angsty and awkward fifteen year old Ginny Miller often feels more mature than her thirty year old mother, the irresistible and dynamic Georgia Miller...",
    poster: "https://image.tmdb.org/t/p/original//hVMoqvXs5j9ffun56tZ5YhliSD9.jpg"
  };

  const displayMovie = getMovie?.data?.movie
console.log("displaymovie",displayMovie?.id);

  const [likeMovie]=useMutation(LIKE_MOVIE)
  const[dislikeMovie]=useMutation(DISLIKE_MOVIE)
  const [rateMovie] = useMutation(RATE_MOVIE);
  const[submitFeedback]=useMutation(SUBMIT_FEEDBACK)
  const [like,setLike] = useState(0)
  const [dislike,setDislike] = useState(movie?.dislikes)

  const [isFeedbackModalOpen,setIsFeedbackModalOpen]=useState(false);
  const[feedbackText,setFeedbackText]=useState(' ');

  const [starRating, setStarRating] = useState(0);

  const CountDisLikeMovie=useQuery(DISLIKE_COUNT_FOR_MOVIE,{
    variables:{id:id}
  })
  const CountLikeMovie=useQuery(LIKE_COUNT_FOR_MOVIE,{
    variables:{id:id}
  })

  console.log("countlikemovie",CountLikeMovie?.data?.likeCountForMovie?.length);
  console.log("countlikemovie>>>",CountLikeMovie?.data?.likeCountForMovie);

  const user_ids = []
  for (let i = 0; i < CountLikeMovie?.data?.likeCountForMovie.length; i++) {
    const like = CountLikeMovie?.data?.likeCountForMovie[i];
     const id = like.user.id
     user_ids.push(id)
    
  }
  const d_user_ids=[]
    for (let i = 0; i < d?.length; i++) {
      const dis = d[i];
      d_user_ids.push(dis.user.id) 
    }
  
  

  console.log("lcount",lcount);
  



  // console.log("countMovie",CountDisLikeMovie?.data?.dislikeCountForMovie?.length);
  // const disl = countMovie?.data?.dislikeCountForMovie;
  // setL(disl)
  // console.log("l",d);
  console.log("getmovieUserReaction",getMovie?.data?.movie?.userReaction);
     
  useEffect(()=>{
    const disl = CountDisLikeMovie?.data?.dislikeCountForMovie;

    setD(disl)
    const L=CountLikeMovie?.data?.likeCountForMovie
    setL(L)
    const lcount=CountLikeMovie?.data?.likeCountForMovie?.length
    setLcount(lcount)
    const dcount=CountDisLikeMovie?.data?.dislikeCountForMovie?.length;
    setDcount(dcount)
    
    console.log(user_ids.includes(userId));
    console.log(d_user_ids.includes(userId));
  
    

   



    
  },[CountLikeMovie.data, CountDisLikeMovie.data,getGenre,getMovie])
  
  

  
  
  const handleLike = async (e) => {
    e.preventDefault()
    if (!displayMovie?.id) return;
    // setLikeActive(true)
    // setDislikeActive(false)
    // setActivebutton("like")
    
    try {

      // const newLikeCount=like+1;
      // setLike(newLikeCount);
     

      
      // console.log("Sending like mutation with likes =", newLikeCount);

    //   await likeMovie({
    //     variables: { movieId: movie.id ,likes:newLikeCount},
    //     optimisticResponse: {
    //       __typename: "Mutation",
    //       rateMovie: {
    //         __typename: "LikeMovieResponse",
    //         success: true,
    //         message: "Optimistic update",
    //         movie: {
    //           __typename: "Movie",
    //           id: movie.id,
    //           likes: newLikeCount,
    //           dislikes: dislike,
    //           user_rating_status: like
    //         }
    //       }
    //     },
    //     update: (cache, { data: { rateMovie } }) => {
    //       if (rateMovie.success) {
    //         cache.modify({
    //           id: cache.identify(movie),
    //           fields: {
    //             likes: () => rateMovie.movie.likes,
    //             dislikes: () => rateMovie.movie.dislikes,
    //             // user_rating_status: () => rateMovie.movie.user_rating_status
    //           }
    //         });
    //       }
    //     }
        
      
    // });
    await likeMovie({
      variables:{movieId:displayMovie?.id,userId:userId},
      refetchQueries: [
        { query: LIKE_COUNT_FOR_MOVIE, variables: { id: displayMovie?.id } },
        { query: DISLIKE_COUNT_FOR_MOVIE, variables: { id: displayMovie?.id } },
        { query: GET_MOVIES_BY_ID, variables: { id: parseInt(displayMovie?.id) } },
      ],

      optimisticResponse:{
        __typename: "Mutation",
        likeMovie:{
          __typename: "LikeMovie",
                  success: true,
                  message: "Optimistic update",
                  

      },

    },
  });
    } catch (err) {
      console.error("Error liking movie:", err);
    }

  };


  const handleDislike = async () => {
    if (!displayMovie?.id) return;
    // setLikeActive(false)
    // setDislikeActive(true)
    // setActivebutton("dislike")
    
    try {
      const newDislikeCount = dislike + 1;  
      setDislike(newDislikeCount);
     
      // setDisLike(dislike+1)

      await dislikeMovie({
        // variables: { movieId: movie.id,dislikes:newDislikeCount },
        // optimisticResponse: {
        //   __typename: "Mutation",
        //   dislikeMovie: {
        //     __typename: "DislikeMovie",
        //     success: true,
        //     message: "Optimistic update",
        //     movie: {
        //       __typename: "Movie",
        //       id: movie.id,
        //       likes: like,
        //       dislikes: newDislikeCount,
        //       // user_rating_status: newUserRating
        //     }
        //   }

        variables:{movieId:displayMovie?.id,userId:userId},
        refetchQueries: [
          { query: DISLIKE_COUNT_FOR_MOVIE, variables: { id: displayMovie?.id } },
          { query: LIKE_COUNT_FOR_MOVIE, variables: { id: displayMovie?.id } },
          { query: GET_MOVIES_BY_ID, variables: { id: parseInt(displayMovie?.id) } },
        ],
        optimisticResponse:{
          __typename:"Mutation",
          dislikeMovieShowing:{
            __typename:"DislikeMovieResponse",
            success:true,
            message: "Optimistic update",
          }
        }
        
        
      });
    } catch (err) {
      console.error("Error disliking movie:", err);
    }
  };


  const handleMovieSelect =  (movieId) => {
    // console.log("getmovie",getMovie);
    // onMovieSelect(getMovie)
    // navigate("/dashboard");
    navigate(`/movie/${movieId}`);
  };

  const backToList=()=>{
    navigate('/dashboard')
  }

  

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;
    
    try {
      await submitFeedback({
        variables: { 
          movieId: displayMovie?.id, 
          comment: feedbackText,
          starRating: starRating > 0 ? starRating : null
        },
        optimisticResponse: {
          __typename: "Mutation",
          submitFeedback: {
            __typename: "FeedbackResponse",
            success: true,
            message: "Optimistic update",
            comment: {
              __typename: "Comment",
              id: "temp-id",
              text: feedbackText,
              created_at: new Date().toISOString(),
              user: {
                __typename: "User",
                username: "You"
              }
            }
          }
        }
      });
      
      // alert("Thank you for your feedback!");
      setFeedbackText('');
      setStarRating(0);
      setIsFeedbackModalOpen(false);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  useEffect(()=>{
    setLike(movie?.likes)
    setDislike(movie?.dislikes)
  },[movie])

  return (
    <>
     <div className="banner-container">
      <div className="banner-poster mt-4">
        <img 
          src={displayMovie?.poster} 
          alt={displayMovie?.title} 
          className="poster-image"
        />
      </div>
      <div className="banner-details">
        <h1 className="banner__title">{displayMovie?.title}</h1>
        <div className="banner__buttons">
        <a 
    href={movie?.trailerLink || "https://www.youtube.com/watch?v=TfCf4zIlZ4Y"} 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <button className="banner__button">Play</button>
  </a>
          <button className="banner__button" onClick={()=>backToList()}>
          <ArrowLeft size={18} style={{ marginRight: '5px' }} />

            My List</button>
          
          {displayMovie && (
            <div className="rating-buttons">
              <button 
                className={`like-btn  ${user_ids.includes(userId) ? 'active' : ''}`}

                onClick={handleLike}
                disabled={!displayMovie}
              >
                👍 {lcount||0}
              </button>
              <button 
                className={`dislike-btn ${d_user_ids.includes(userId)? 'active' : ''}`}
                onClick={handleDislike}
                disabled={!displayMovie}
              >
                👎 {dcount||0}
              </button>
             
            </div>
          )}
           <button 
        className="banner__button" 
        style={{backgroundColor:"#e50914"}}
        onClick={() => setIsFeedbackModalOpen(true)}
      >
        Gave Feedback
      </button>

      {isFeedbackModalOpen && (
      <div className="feedback-modal-overlay">
        <div className="feedback-modal">
          <h3>Share your feedback about {displayMovie?.title}</h3>
          
          {/* Star Rating */}
          {/* <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                className={`star ${star <= starRating ? 'filled' : ''}`}
                onClick={() => setStarRating(star)}
              >
                ★
              </span>
            ))}
          </div> */}
          
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="What did you think about this movie?"
            rows={5}
          />
          <div className="modal-buttons">
            <button 
              onClick={handleFeedbackSubmit}
              disabled={!feedbackText.trim()}
            >
              Submit
            </button>
            <button 
              onClick={() => setIsFeedbackModalOpen(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
        </div>
       
        <div className="banner__description">
          {displayMovie?.description || displayMovie?.plot || defaultBanner?.description}
        </div>
        {displayMovie && (
          <div className="movie-info">
            <div className="info-row">
              <span className="info-label">Year:</span>
              <span className="info-value">{displayMovie.year}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span className="info-value">{displayMovie.genre}</span>
            </div>
            <div className="info-row">
              <span className="info-label">imdb:</span>
              <span className="info-value">{displayMovie.imdbRating|| 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Rating:</span>
              <span className="info-value">{displayMovie.rated}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Director:</span>
              <span className="info-value">{displayMovie.director}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Genre:</span>
              <span className="info-value">{displayMovie.type}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Runtime:</span>
              <span className="info-value">{displayMovie.runtime || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Actors:</span>
              <span className="info-value">{displayMovie.actors || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Awards:</span>
              <span className="info-value">{displayMovie.awards || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Box-Office:</span>
              <span className="info-value">{displayMovie.boxOffice || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Web-Site:</span>
              <span className="info-value">{displayMovie.website || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Writer:</span>
              <span className="info-value">{displayMovie.writer || 'N/A'}</span>
            </div>
           
          </div>
        )}
      </div>
     
    </div>



    <div className="related-movies-section mt-3">
  {/* <h2 className="related-movies-title">More Like This</h2> */}

  {!releatedGenreMovies ? (
    <div className="loading">Loading related movies...</div>
  ) : releatedGenreMovies?.length ? (
    <>
      <h2 className="list__title mt-3 mx-4" style={{ color: "black" }}>
        {genre} Releated Movies
      </h2>
      <div className="d-flex row list row__posters mx-2">
        {releatedGenreMovies
          // .filter((movie) => movie.id !== selectedMovieId) // exclude selected movie
          .map((movie) => (
            <div
              className="movie__card mt-3"
              key={movie.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleMovieSelect(movie.id)} // your movie change function
            >
              <img
                className="movie__poster"
                src={movie.poster}
                alt={movie.title}
              />
            </div>
          ))}
      </div>
    </>
  ) : (
    <p>No related movies found.</p>
  )}
</div>


    </>
  )
}

export default Banner
