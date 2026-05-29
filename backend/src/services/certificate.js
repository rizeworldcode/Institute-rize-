const certificate_model = require("../models/certificate");
const bcrypt = require("bcryptjs");
const path = require('path');
const fs = require('fs');

exports.certificate_uplode = async (req,res) => {
    try {
        const { student_name, student_ID, status,student_password } = req.body

        // Main Photo
        let certificate_photo = "";

    if (
      req.files &&
      req.files["certificate_photo"] &&
      req.files["certificate_photo"].length > 0
    ) {

      // store DB path relative to public (so file is reachable at /uploads/<filename>)
      certificate_photo = `uploads/${req.files["certificate_photo"][0].filename}`;
    }

        const existingStudentTc = await certificate_model.findOne({ student_ID: student_ID })
        if (existingStudentTc) {
            return {
                message: "student certificate alrady exiest",
                success: false,
            };
        }
        const hashedPassword = await bcrypt.hash(student_password, 10);
    const certificate_Data = new certificate_model({ student_name, student_ID, status, certificate_photo:certificate_photo, student_password:hashedPassword });
    if (!certificate_Data) {
      return {
        message: "student certificate uplodation faild",
        success: false,
      };
    }

    // Persist to database
    const saved = await certificate_Data.save();

    return {
      certificate_Data: saved,
      message: "student certificate uplode successfully",
      success: true,
    };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
}

exports.certificate_delete = async (req, res) => {
    try {
        const {student_ID} = req.body
        const certificate_data = await certificate_model.findOne({student_ID})

        if(certificate_data.certificate_photo){
                       const filePath = path.join(
        __dirname,
        "..",
        "public",
        certificate_data.certificate_photo
      );

      try {
        await fs.unlink(filePath);
        console.log("Photo deleted successfully");
      } catch (err) {
        console.log("Photo already deleted or not found");
      }
        }



        const delete_certificate = await certificate_model.findOneAndDelete({student_ID})
        if(!delete_certificate){
            return{
                message:"certificate not delete ",
                success:false,
            }
        }
        return{
            message:"certificate delete successfully",
            success:true
        }
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
}

exports.certificate_view = async (req,res)=>{
  const { student_ID } = req.params || {};
  try {
    // Accept either the external student_ID (e.g., DWPS2026001) or a Mongo ObjectId
    let certificate_data = null;
    try {
      const mongoose = require('mongoose');
      if (mongoose.isValidObjectId(student_ID)) {
        certificate_data = await certificate_model.findById(student_ID);
      }
    } catch (innerErr) {
      // ignore mongoose require errors and fallback to lookup by student_ID
    }

    if (!certificate_data) {
      certificate_data = await certificate_model.findOne({ student_ID });
    }

    if(!certificate_data){
      return{
        message:"certificate not found",
        success:false
      }
    }

    return{
      certificate_data,
      certificate_photo:certificate_data.certificate_photo,
      message:"certificate fetch successfully",
      success:true
    }
  } catch (error) {
    console.log(error);
    return{
      message:error.message || "Internal server error",
      success: false,
    }
  }
}

exports.updateCertificate = async (req, res) => {
  try {

    const { student_iD } = req.params || {};

    const {
      student_ID,
      student_name,
      student_password,
      status,
    } = req.body;

    // Find existing TC by student_ID (model stores student_ID)
    const existingcertificate = await certificate_model.findOne({ student_ID: student_iD });

    if (!existingcertificate) {
      return {
        success: false,
        message: "certificate not found",
      };
    }

    if (student_ID) {
      existingcertificate.student_ID = student_ID;
    }

    if (student_name) {
      existingcertificate.student_name = student_name;
    }

    if (student_password) {
      const hashedPassword = await bcrypt.hash(student_password, 10);
      existingcertificate.student_password = hashedPassword;
    }

    // Handle new certificate photo if uploaded
    if (
      req.files &&
      req.files["certificate_photo"] &&
      req.files["certificate_photo"].length > 0
    ) {
      // Delete old photo if it exists
      if (existingcertificate.certificate_photo) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "public",
          existingcertificate.certificate_photo
        );
        try {
          if (fs.existsSync(oldFilePath)) {
            await fs.unlink(oldFilePath);
            console.log("Old photo deleted successfully");
          }
        } catch (err) {
          console.log("Error deleting old photo:", err);
        }
      }

      // Store new path
      existingcertificate.certificate_photo = `uploads/${req.files["certificate_photo"][0].filename}`;
    }

    existingcertificate.status = status || existingcertificate.status;

    existingcertificate.updated_at = Date.now();

    await existingcertificate.save();

    return {
      success: true,
      message: 'certificate updated successfully',
      data: existingcertificate,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message || 'Internal server error',
    };

  }
};