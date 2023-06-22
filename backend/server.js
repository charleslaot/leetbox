// INIT
if (process.env.NODE_ENV === "development") {
	require("dotenv").config();
}

const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const appRouter = require("./routes");

// MIDDLEWARE
const corsOptions = {
    credentials: true,
	origin: process.env.CORS_ORIGIN,
};
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/", appRouter);
app.use((req, res, next) => {
	res.status(404).json({ message: "404 Not found." });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "500 Internal server error." });
});

// SERVER
(async () => {
	try {
		// DB connection here
		app.listen(process.env.APP_PORT, () => {
			console.log("=== Server running on port " + process.env.APP_PORT + " ===");
		});
	} catch (error) {
		console.error("\nServer error:", error);
	}
})();
