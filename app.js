const express = require("express");
const crypto = require("node:crypto");
const { validateMovies, validatePatrialMovies } = require("./scheme/mavies");
const app = express();
const cors = require("cors");

const moviesJSON = require("./movies.json");

const PORT = process.env.PORT ?? 8056;
app.disable("x-powered-by");

app.get("/", (req, res) => {
	res.json({ message: "hello worlt" });
});

app.get("/movies", (req, res) => {
	const { genre } = req.query;

	if (genre) {
		const FilteredMovies = moviesJSON.filter((movie) =>
			movie.genre.some((g) => g.toLowerCase() === genre.toLocaleLowerCase()),
		);

		return res.json(FilteredMovies);
	}

	res.json(moviesJSON);
});

app.get("/movies/:id", (req, res) => {
	const { id } = req.params;
	const movie = moviesJSON.find((movie) => movie.id === id);
	if (movie) return res.json(movie);

	res.status(404).json({ 404: "not foun" });
});

app.use(express.json());

app.post("/movies", (req, res) => {
	const result = validateMovies(req.body);

	if (result.error)
		return res.status(404).json(
			res.status(400).json({
				message: result.error,
			}),
		);

	const newMovies = {
		id: crypto.randomUUID,
		...result.data,
	};

	moviesJSON.push(newMovies);

	res.status(201).json(newMovies);
});

app.patch("/movies/:id", (req, res) => {
	const result = validatePatrialMovies(req.body);

	const { id } = req.params;
	const movieIndex = moviesJSON.findIndex((movie) => movie.id === id);

	if (movieIndex === -1) return res.status(404).json({ 404: "not foun" });
	if (result.error)
		return res.status(404).json(
			res.status(400).json({
				message: result.error,
			}),
		);

	const moviesUpdata = {
		...moviesJSON[movieIndex],
		...result.data,
	};

	return res.json(moviesUpdata);
});

app.delete("/movies/:id", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	const { id } = req.params;

	const movieIndex = moviesJSON.findIndex((movie) => movie.id === id);

	if (movieIndex === -1) return res.status(404).json({ 404: "not foun" });

	moviesJSON.splice(movieIndex, 1);

	return res.json({ message: "Movie delete" });
});

app.use(cors());

app.listen(PORT, (_, __) => {
	console.log(`server listener in port http://localhots:${PORT}`);
});
