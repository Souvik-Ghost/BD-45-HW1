let express = require("express");
let app = express();
let port = process.env.PORT || 3000;
let db;
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");
app.use(express.json());
//Connect to the database
(async () => {
  db = await open({
    filename: "BD-4.5-HW1/database.sqlite",
    driver: sqlite3.Database,
  });
})();
//Message
app.get("/", (req, res) => {
  res.status(200).json({ message: "BD 4.5 CW SQL Comparison Operators" });
});
//To connect sqlite database run: /node BD-4.5-HW1/initDB.js
//To run the project: /node BD-4.5-HW1
// THE ENPOINTS
//1 /courses/rating?minRating=4
async function filterCoursesByRating(minRating) {
  let query = "SELECT * FROM courses WHERE rating >= ?";
  let response = await db.all(query, [minRating]);
  return { courses: response };
}
app.get("/courses/rating", async (req, res) => {
  let minRating = req.query.minRating;
  try {
    let response = await filterCoursesByRating(minRating);
    if (response.courses.length === 0) {
      return res
        .status(404)
        .json({
          message: `No courses found with a rating greater than or equal to ${minRating}.`,
        });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//2 /courses/instructor-duration?instructor=Instructor%20A&minDuration=7
async function filterCoursesByInstructorAndDuration(instructor, minDuration) {
  let query = "SELECT * FROM courses WHERE instructor = ? AND duration >= ?";
  let response = await db.all(query, [instructor, minDuration]);
  return { courses: response };
}
app.get("/courses/instructor-duration", async (req, res) => {
  let instructor = req.query.instructor;
  let minDuration = req.query.minDuration;
  try {
    let response = await filterCoursesByInstructorAndDuration(instructor, minDuration);
    if (response.courses.length === 0) {
      return res.status(404).json({ message: `No courses found with an instructor of ${instructor} and a duration greater than or equal to ${minDuration}.`});
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//3 /courses/ordered-by-price
async function fetchCoursesOrderedByPrice() {
  let query = "SELECT * FROM courses ORDER BY price ASC";
  let response = await db.all(query);
  return { courses: response };
}
app.get("/courses/ordered-by-price", async (req, res) => {
  try {
    let result = await fetchCoursesOrderedByPrice();
    if (result.courses.length === 0) {
      return res.status(404).json({ message: "No courses found." });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Server Port connection Message
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
