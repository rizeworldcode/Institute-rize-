const {student_login,student_logout } = require("../services/studentValidation")

exports.student_login = async (req, res) => {
    try {
      const data = await student_login(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          // Return 401 Unauthorized for login failures instead of 403 Forbidden
          res.status(401).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

    exports.student_logout = async (req, res) => {
      try {
        const data = await student_logout(req, res);
        if (data.success) {
          res.status(200).json(data);
        }
        else{
            res.status(401).json(data);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };