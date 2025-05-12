import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_MOVIES, GET_MOVIES_BY_ID,RELEATED_MOVIES_GENRE,SEARCH_MOVIE, UPLOAD_CSV } from "../graphql";
import { useNavigate, useParams } from "react-router-dom";

function List({ onMovieSelect }) {
  const [id, setId] = useState(1);
  const[searchTerm,setSearchTerm]=useState("");
  const[searchResults,setSearchResults]=useState(null);
  const[isSearching,setIsSearching]=useState(false);
  const [file, setFile] = useState(null);

  const [uploadCsv]=useMutation(UPLOAD_CSV);
  const { data, loading, error } = useQuery(GET_MOVIES);
  const getMovie = useQuery(GET_MOVIES_BY_ID, {
    variables: { id: parseInt(id) },
  });

  const genre=data?.allMovies?.map(movie=>movie.genre)
  console.log("genreinsidelist",genre);
  
  const [executeSearch, { data: searchData, loading: searchLoading }] = useLazyQuery(SEARCH_MOVIE);
  const navigate = useNavigate();

  console.log("data",data);


  const getGenre=useQuery(RELEATED_MOVIES_GENRE,{
    variables:{genre},
    skip:!genre,
  })

  
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    executeSearch({
      variables: { search: searchTerm },
    });
  };
  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults(null);
      setIsSearching(false);
    }
  }, [searchTerm]);
  

  useEffect(()=>{

   


    if(getMovie?.data?.movie?.id){
      onMovieSelect(getMovie?.data?.movie)
    }
  },[getMovie])


  useEffect(() => {
    if (searchData?.searchMovie) {
      setSearchResults(searchData.searchMovie);
    }
  }, [searchData]);

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  const movies = data?.allMovies || [];
  const movieChunks = chunkArray(movies, 100); //  100 movies
  
  const handleMovieSelect =  (movieId) => {
    console.log("getmovie",getMovie);
    onMovieSelect(getMovie)
    // navigate("/dashboard");
    navigate(`/movie/${movieId}`);
  };

  


const handleFileUpload = async () => {
  if (!file) {
    alert("Please select a CSV file to upload.");
    return;
  }

  try {
    const { data } = await uploadCsv({
      variables: { file },
    });

    console.log("upload csv",data);
    

    if (data?.uploadCsv?.success) {
      alert("CSV uploaded successfully!");
    } else {
      alert(data?.uploadCsv?.message || "Upload failed.");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred while uploading the file.");
  }
};

  

  return (
   
    <div className="list ">
      <div className="d-flex mb-4 mt-3">
      <div className="bg-inf" style={{ 
        margin: "20px 0",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent:"center",
        width:"50%"
      }}>
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // onKeyPress={handleKeyPress}
          style={{
            padding: "10px",
            flex: "1",
            maxWidth: "500px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          disabled={searchLoading}
        >
          {searchLoading ? "Searching..." : "Go"}
        </button>
      </div>

      <div className="bg-primar" style={{ margin: "20px 0", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width:"50%"}}>
     
  <input
    type="file"
    accept=".csv"
    onChange={(e) => setFile(e.target.files[0])}
    // style={{ color: "white"}}
    style={{
      padding: "10px",
      flex: "1",
      maxWidth: "500px",
      // maxHeight:"50px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "13px",
    }}
  />
   {/* {file && (
        <p style={{ marginTop: "10px", fontStyle: "bold" }}>
          Selected file: {file.name}
        </p>
      )} */}
  <button
    onClick={handleFileUpload}
    style={{
      padding: "10px 20px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Upload Movie(CSV)
  </button>
</div>
      </div>
     



      {isSearching && (
        <div className="search-results p-0 m-0">
          <h2 className="list__title" style={{ color: "white" }}>
            Search Results
          </h2>
          {searchLoading ? (
            <div>Loading search results...</div>
          ) : searchResults ? (
            <>
              <div className="row__posters">
                {searchResults.map((movie) => (
                  <div
                    className="movie__card mt-5"
                    key={"search-" + movie.id}
                    onClick={() => {
                      setId(movie.id);
                      handleMovieSelect(movie.id);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      className="movie__poster"
                      src={movie.poster}
                      alt={movie.title}
                    />
                  </div>
                ))}
              </div>
              {searchResults.length === 0 && (
                <div style={{ color: "white" }}>No results found for "{searchTerm}"</div>
              )}
            </>
          ) : (
            <div style={{ color: "white" }}>Enter a search term and click "Go"</div>
          )}
        </div>
      )}
      
      {!isSearching && (
        <>
          {/* First Chunk: Popular Movies */}
          {movieChunks[0] && (
            <>
              {/* <div className="">
                <h2 className="list__title" style={{ color: "white", marginTop: "" }}>
                  Popular Movies
                </h2>
              </div> */}
              <div className="row__posters">
                {movieChunks[0].map((movie) => (
                  <div
                    className="movie__card"
                    key={"popular-" + movie.id}
                    onClick={() => {
                      setId(movie.id);
                      handleMovieSelect(movie.id);
                    }}
                    style={{ cursor: "pointer" }}
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
          )}

          {/* Second Chunk: Action Movies */}
          {movieChunks[1] && (
            <>
              <h2 className="list__title mt-3" style={{ color: "black" }}>
                Action Movies
              </h2>
              <div className="row__posters">
                {movieChunks[1].map((movie) => (
                  <div
                    className="movie__card mt-3"
                    key={"action-" + movie.id}
                    onClick={() => {
                      setId(movie.id);
                      handleMovieSelect(movie.id);
                    }}
                    style={{ cursor: "pointer" }}
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
          )}

          {/* Third Chunk: Comedy and Drama Movies */}
          {movieChunks[2] && (
            <>
              <h2 className="list__title mt-3" style={{ color: "black" }}>
                Comedy and Drama Movies
              </h2>
              <div className="row__posters">
                {movieChunks[2].map((movie) => (
                  <div
                    className="movie__card mt-4"
                    key={"comedy-drama-" + movie.id}
                    onClick={() => {
                      setId(movie.id);
                      handleMovieSelect(movie.id);
                    }}
                    style={{ cursor: "pointer" }}
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
          )}
        </>
      )}
    </div>
  );
}

export default List;
