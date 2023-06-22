// INIT
if (process.env.NODE_ENV === "development") {
	require("dotenv").config();
}

const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");

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

//DB
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// SERVER
(async () => {
	try {
		await client.connect();
		await client.db("admin").command({ ping: 1 });
		console.log("\n=== You successfully connected to MongoDB ===");

		app.listen(process.env.APP_PORT, () => {
			console.log("\n=== Server running on port " + process.env.APP_PORT + " ===\n");
		});
	} catch (error) {
		console.error("\nServer error:", error);
	} finally {
		await client.close();
	}
})();
