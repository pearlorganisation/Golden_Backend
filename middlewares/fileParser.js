import chalk from "chalk";
import formidable from "formidable";

const fileParser = (req, res, next) => {
  console.log(chalk.red("File Parsing Middleware Invoked"));

  // Initialize Formidable with options
  const form = formidable({
    multiples: true, // Allows multiple file uploads
    maxFileSize: 10 * 1024 * 1024, // Set maximum file size to 10MB
    keepExtensions: true, // Keep file extensions
  });

  // Parse incoming form data
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err.message);
      return res.status(400).json({ error: "Error parsing form data" });
    }

    // Safely process fields
    req.body = {};
    for (const key in fields) {
      if (fields[key]) {
        const value = fields[key][0] || fields[key]; // Safely access the first item
        try {
          req.body[key] = JSON.parse(value); // Try parsing as JSON
        } catch (e) {
          req.body[key] = value; // Default to string
        }

        // Convert numeric fields to numbers
        if (!isNaN(req.body[key])) {
          req.body[key] = Number(req.body[key]);
        }
      }
    }

    // Safely process files
    req.files = {};
    for (const key in files) {
      if (files[key]) {
        req.files[key] = Array.isArray(files[key]) ? files[key] : files[key][0];
      }
    }

    // Pass control to the next middleware
    next();
  });
};

export default fileParser;
