import { Router } from "express";
import { getMoviesFromTMDB } from "../tmdb/tmdb.api.service.js";
import { getMovie } from "./data/movieDataAccess.service.js";
import { handleError } from "../utils/handleError.js";

const router = Router();

// get list of popular movies
router.get("/", async (req, res, next) => {
  try {
    const pageNumber = +req.query.page || 1;
    if (pageNumber < 1 || Number.isNaN(pageNumber)) {
      res.status(400).send("Invalid page number");
      return;
    }
    const movies = await getMoviesFromTMDB(pageNumber);
    Promise.all(movies.results.map((movie) => getMovie(movie.id))).then((fullMovies) => {
      return res.send(fullMovies);
    });
  } catch (error) {
    return next(error);
  }
});

// get a single movie by id
router.get("/:id", async (req, res, next) => {
  try {
    if (!req.params.id || Number.isNaN(req.params.id)) {
      return res.status(400).send("Invalid movie id");
    }
    const movie = await getMovie(req.params.id);
    if (movie) {
      return res.status(200).send(movie);
    }
    return res.status(404).send("Movie not found");
  } catch (error) {
    return next(error);
  }
});
export default router;
