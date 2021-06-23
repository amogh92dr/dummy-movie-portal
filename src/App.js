import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    let result;
    setIsLoading(true);
    try {
      result = await axios.get(
        "https://http-dummy-movie-db-default-rtdb.firebaseio.com/movies.json"
      );
      const allMovies = result.data;
      const loadedMovies = [];
      for (const key in allMovies) {
        loadedMovies.push({
          id: key,
          title: allMovies[key].body.title,
          openingText: allMovies[key].body.openingText,
          releasedDate: allMovies[key].body.releasedDate,
        });
      }
      setMoviesList(loadedMovies);
    } catch (e) {
      setError(e.toString());
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const onAddMoviehandler = async (movie) => {
    try {
      await axios.post(
        "https://http-dummy-movie-db-default-rtdb.firebaseio.com/movies.json",
        {
          body: movie,
        }
      );
    } catch (e) {
      setError(e.toString());
    }
  };
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={onAddMoviehandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && <MoviesList movies={moviesList} />}
        {isLoading && <p>LOADING MOVIES...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
