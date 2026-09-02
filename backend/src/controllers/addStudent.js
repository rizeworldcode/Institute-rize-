const { add_student, certificate_view, updateStudentdetails, deleteStudent } = require("../services/addStudent");

exports.add_student = async (req, res) => {
    try {
      const data = await add_student(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

exports.certificate_view = async (req, res) => {
    try {
      const data = await certificate_view(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

exports.updateStudentdetails= async (req, res) => {
    try {
      const data = await updateStudentdetails(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

exports.deleteStudent = async (req, res) => {
  try {
    const data = await deleteStudent(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(400).json(data);
    }
  } catch (error) {
    console.log("Error in deleteStudent controller:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};