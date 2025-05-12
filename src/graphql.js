import { gql } from "@apollo/client";





export const GET_MOVIES=gql `
    query allMovies {
  allMovies {
    id
    title
    year
    rated
    released
    runtime
    genre
    director
    writer
    actors
    likes
    dislikes
    plot
    language
    country
    awards
    poster
    metascore
    imdbRating
    imdbVotes
    imdbId
    type
    dvd
    boxOffice
    production
    website
    __typename
    
  }
}

`
export const GET_MOVIES_BY_ID=gql `
  query GetMovie($id:Int!){
      movie(id:$id){
      id
    title
    year
    rated
    released
    runtime
    director
    writer
    actors
    genre
    plot
    language
    country
    awards
    poster
    metascore
    imdbRating
    imdbVotes
    imdbId
    type
    dvd
    boxOffice
    production
    website
    likes
    dislikes
    userReaction
      
      }
  }
`

export const SEND_PASSWORD_RESET_EMAIL=gql `
   mutation SendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success
      errors
    }
  }

`
export const LOG_OUT = gql`
  mutation Logout($refreshToken: String!){
  revokeToken(refreshToken: $refreshToken){
    success
    errors
  }
}
`

export const PASSWORD_RESET = gql`
  mutation PasswordReset($token: String!, $newPassword1: String!, $newPassword2: String!) {
    passwordReset(token: $token, newPassword1: $newPassword1, newPassword2: $newPassword2) {
      success
      errors
    }
  }
`;

export const REGISTER_MUTATION = gql`
mutation Register(
  $email: String!
  $username: String!
  $password1: String!
  $password2: String!
) {
  register(
    email: $email
    username: $username
    password1: $password1
    password2: $password2
  ) {
    success
    errors
    token
  }
}
`;

export const CREATE_RAZORPAY_ORDER = gql`
  mutation CreateRazorpayOrder($planId: ID!,$userId: ID!) {
    createRazorpayOrder(planId: $planId,userId: $userId) {
      success
      orderId
      amount
      currency
      key
      message
    }
  }
`;

export const VERIFY_RAZORPAY_PAYMENT = gql`
  mutation VerifyRazorpayPayment(
    $orderId: String!
    $paymentId: String!
    $signature: String!
  ) {
    verifyRazorpayPayment(
      orderId: $orderId
      paymentId: $paymentId
      signature: $signature
    ) {
      success
      message
      payment {
        id
        amount
        status
      }
    }
  }
`;

export const GET_ACTIVE_PLANS = gql`
  query GetActivePlans {
    activeSubscriptionPlans {
      id
      name
      description
      price
      durationDays
      durationMonths
    }
  }
`;


export const SEND_PAYMENT_HISTORY_PDF = gql`
  mutation SendPaymentHistoryPDF {
    sendPaymentHistoryPDF {
      success
      message
    }
  }
`;


// graphql.js
export const GET_MOVIE_DETAILS = gql`
  query GetMovieDetails($id: Int!) {
    movie(id: $id) {
      id
      title
      poster
      likes
      dislikes
      averageRating
      totalRatings
      isWatched
      userRating {
        rating
        starRating
      }
      comments {
        id
        text
        createdAt
        user {
          username
        }
      }
    }
  }
`;

// export const SUBMIT_FEEDBACK = gql`
//   mutation SubmitFeedback(
//     $movieId: ID!
//     $rating: Int!
//     $starRating: Int
//     $comment: String
//   ) {
//     submitFeedback(
//       movieId: $movieId
//       rating: $rating
//       starRating: $starRating
//       comment: $comment
//     ) {
//       success
//       message
//       feedback {
//         id
//         rating
//         starRating
//       }
//     }
//   }
// `;

export const ADD_COMMENT = gql`
  mutation AddComment($movieId: ID!, $text: String!) {
    addComment(movieId: $movieId, text: $text) {
      success
      message
      comment {
        id
        text
        created_at
        user {
          username
        }
      }
    }
  }
`;

export const MARK_AS_WATCHED = gql`
  mutation MarkAsWatched($movieId: ID!) {
    markAsWatched(movieId: $movieId) {
      success
      message
      history {
        id
        finishedAt
      }
    }
  }
`;


// export const LIKE_MOVIE = gql`
//   mutation LikeMovie($movieId: ID!,$likes: Int!) {
//     rateMovie(movieId: $movieId,likes: $likes) {
//       success
//       message
//       movie {
//         id
//         likes
//         dislikes
//       }
//     }
//   }
// `;

export const LIKE_MOVIE=gql `
    mutation LikeMovie($movieId:ID!,$userId:ID!){
      likeMovie(movieId:$movieId,userId:$userId){
          success
          errors
          
      }
    }

`;


export const DISLIKE_COUNT_FOR_MOVIE= gql `
    query dislikeCount($id:ID!){
      dislikeCountForMovie(id:$id){
            id
            user{
               id
               username
    }
      }
    }

`;


export const LIKE_COUNT_FOR_MOVIE=gql `
    query likeCount($id:ID!){
        likeCountForMovie(id:$id){
            id
            user{
                id
                username
            }
        
        }
    }

`;

// export const DISLIKE_MOVIE = gql`
//   mutation DislikeMovie($movieId: ID!,$dislikes:Int!) {
//     dislikeMovie(movieId: $movieId,dislikes:$dislikes) {
//       success
//       message
//      movie {
//         id
//         likes
//         dislikes
//       }
//     }
//   }
// `;

export const DISLIKE_MOVIE=gql `
    mutation DislikeMovie($movieId:ID!,$userId:ID!){
      dislikeMovieShowing(movieId:$movieId,userId:$userId){
          success
          errors
          __typename
      }
    }
`;


export const RATE_MOVIE = gql`
  mutation RateMovie($movieId: ID!) {
    rateMovie(movieId: $movieId) {
      success
      message
      movie {
        id
        likes
        dislikes
        averageRating
        userRatingStatus
      }
    }
  }
`;


export const SUBMIT_FEEDBACK = gql`
  mutation SubmitFeedback(
    $movieId: ID!
    $comment: String!
    $starRating: Int
  ) {
    submitFeedback(
      movieId: $movieId
      comment: $comment
      starRating: $starRating
    ) {
      success
      message
      comment {
        id
        text
        createdAt
        user {
          username
        }
      }
    }
  }
`;



export const RELEATED_MOVIES_GENRE=gql `
    query ReleatedMoviesGenre($genre:String!){
        releatedMovies(genre:$genre){
            id
            title
            poster
            genre
        }
    }
`;



export const SEARCH_MOVIE= gql `
    query SearchMovie($search:String){
      searchMovie(search:$search){
            id
            title
            year
            rated
            released
            runtime
            genre
            director
            writer
            actors
            likes
            dislikes
            plot
            language
            country
            awards
            poster
            metascore
            imdbRating
            imdbVotes
            imdbId
            type
            dvd
            boxOffice
            production
            website
            __typename

      }
    }

`;

export const UPLOAD_CSV=gql`
  mutation UploadCSV($file:Upload!){
      uploadCsv(file:$file){
        success
        message
      }
  
  }

`;


