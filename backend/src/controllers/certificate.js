const {certificateData } = require("../services/certificate")

exports.certificateData = async (req, res) => {
    try {
      const data = await certificateData(req, res);
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