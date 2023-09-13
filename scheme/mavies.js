const z = require("zod");

const movieScheme = z.object({
	director: z.string({
		required_error: "director is requerid",
		invalid_type_error: "director is text",
	}),
	duration: z
		.number({
			required_error: "duration is requerid",
			invalid_type_error: "director is number",
		})
		.int()
		.min(0)
		.max(100000),
	year: z
		.number({
			required_error: "year is requerid",
			invalid_type_error: "year is number",
		})
		.int()
		.min(1900)
		.max(new Date().getFullYear() + 1),
	rate: z
		.number({
			required_error: "rate is requerid",
			invalid_type_error: "rate is number",
		})
		.min(0)
		.max(10)
		.default(5),
	poster: z.string().url({
		required_error: "poster is requerid",
		invalid_type_error: "poster is url",
	}),
	genre: z.array(
		z.enum([
			"Action",
			"Adventure",
			"Crime",
			"Comedy",
			"Drama",
			"Fantasy",
			"Horror",
			"Thriller",
			"Sci-Fi",
			"Action",
		]),
		{
			required_error: "Movie genre is required.",
			invalid_type_error: "Movie genre must be an array of enum Genre",
		},
	),
});

const validateMovies = (objeto) => {
	return movieScheme.safeParse(objeto);
};

const validatePatrialMovies = (objeto) => {
	return movieScheme.partial().safeParse(objeto);
};

module.exports = {
	validateMovies,
	validatePatrialMovies,
};
