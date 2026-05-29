const {certificate_uplode,certificate_delete,certificate_view,updateCertificate } = require("../services/certificate")

exports.certificate_uplode = async (req, res) => {
    try {
      const data = await certificate_uplode(req, res);
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
exports.certificate_delete = async (req, res) => {
    try {
      const data = await certificate_delete(req, res);
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
exports.updateCertificate= async (req, res) => {
    try {
      const data = await updateCertificate(req, res);
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