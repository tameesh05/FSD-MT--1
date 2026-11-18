
const express = require("express");
const app = express();

app.use(express.json());

let enrollments = [
  { id: 601, studentName: "Aarav Gupta", courseCode: "CS301", courseName: "Data Structures", semester: 3, attendance: 82 },
  { id: 602, studentName: "Meera Joshi", courseCode: "CS305", courseName: "Database Systems", semester: 3, attendance: 74 },
  { id: 603, studentName: "Kabir Khan", courseCode: "CS310", courseName: "Computer Networks", semester: 3, attendance: 91 }
];

// GET all enrollments
app.get("/api/enrollments", (req, res) => {
  res.status(200).json(enrollments);
});

// POST new enrollment
app.post("/api/enrollments", (req, res) => {
  const { studentName, courseCode, courseName, semester, attendance } = req.body;

  if (!studentName || !courseCode || !courseName ||
      !Number.isInteger(semester) || semester <= 0 ||
      typeof attendance !== "number" || attendance < 0 || attendance > 100) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const newEnrollment = {
    id: Date.now(),
    studentName,
    courseCode,
    courseName,
    semester,
    attendance
  };

  enrollments.push(newEnrollment);
  res.status(201).json(newEnrollment);
});

// GET enrollment by ID
app.get("/api/enrollments/:id", (req, res) => {
  const record = enrollments.find(e => e.id == req.params.id);

  if (!record)
    return res.status(404).json({ message: "Enrollment not found" });

  res.status(200).json(record);
});

// PUT update enrollment
app.put("/api/enrollments/:id", (req, res) => {
  const id = req.params.id;
  const record = enrollments.find(e => e.id == id);

  if (!record)
    return res.status(404).json({ message: "Enrollment not found" });

  const { studentName, courseCode, courseName, semester, attendance } = req.body;

  if (!studentName || !courseCode || !courseName ||
      !Number.isInteger(semester) || semester <= 0 ||
      typeof attendance !== "number" || attendance < 0 || attendance > 100) {
    return res.status(400).json({ message: "Invalid input" });
  }

  record.studentName = studentName;
  record.courseCode = courseCode;
  record.courseName = courseName;
  record.semester = semester;
  record.attendance = attendance;

  res.status(200).json(record);
});

// DELETE enrollment
app.delete("/api/enrollments/:id", (req, res) => {
  const id = req.params.id;
  const index = enrollments.findIndex(e => e.id == id);

  if (index === -1)
    return res.status(404).json({ message: "Enrollment not found" });

  enrollments.splice(index, 1);
  res.status(200).json({ message: "Enrollment deleted successfully" });
});

// Filter by semester
app.get("/api/enrollments/filter", (req, res) => {
  const semester = req.query.semester;
  const result = enrollments.filter(e => e.semester == semester);

  res.status(200).json(result);
});

// Low attendance (below 75)
app.get("/api/enrollments/low-attendance", (req, res) => {
  const result = enrollments.filter(e => e.attendance < 75);
  res.status(200).json(result);
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
