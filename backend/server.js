require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./questionModel");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.post("/search", async (req, res) => {
  const { query, page = 1, pageSize = 10, type } = req.body;
  const skip = (page - 1) * pageSize;

  const filter = {
    title: { $regex: query, $options: "i" },
    ...(type && type !== "all" && { type: type.toUpperCase().replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace("READALONG", "READ_ALONG")
      .replace("CONTENTONLY", "CONTENT_ONLY") }),
  };

  try {
    const [questions, totalResults] = await Promise.all([
      Question.find(filter).skip(skip).limit(pageSize),
      Question.countDocuments(filter),
    ]);

    res.json({
      questions: questions.map(({ _id, type, title }) => ({ id: _id.toString(), type, title })),
      totalResults,
    });
  } catch (err) {
    console.error("Error fetching search results", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
