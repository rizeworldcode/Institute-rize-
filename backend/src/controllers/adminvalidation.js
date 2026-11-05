const { 
  admin_login, 
  admin_logout, 
  sendOtpTOadmin, 
  verifyOtp, 
  admin_forgatePassword,
  get_admin_profile,
  get_all_staff,
  create_staff,
  update_staff,
  delete_staff
} = require("../services/adminvalidation.js");
exports.admin_login = async (req, res) => {
    try {
      const data = await admin_login(req, res);
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

  exports.admin_logout = async (req, res) => {
    try {
      const data = await admin_logout(req, res);
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

  exports.sendOtpTOadmin = async (req, res) => {
    try {
      const data = await sendOtpTOadmin(req, res);
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
  
  exports.verifyOtp = async (req, res) => {
    try {
      const data = await verifyOtp(req, res);
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

  exports.admin_forgatePassword = async (req, res) => {
    try {
      const data = await admin_forgatePassword(req, res);
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

  exports.get_admin_profile = async (req, res) => {
    try {
      const data = await get_admin_profile(req, res);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(401).json(data);
      }
    } catch (error) {
      console.log("Error in get_admin_profile:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.get_all_staff = async (req, res) => {
    try {
      const data = await get_all_staff(req, res);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error in get_all_staff:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.create_staff = async (req, res) => {
    try {
      const data = await create_staff(req, res);
      if (data.success) {
        res.status(201).json(data);
      } else {
        res.status(400).json(data);
      }
    } catch (error) {
      console.log("Error in create_staff:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.update_staff = async (req, res) => {
    try {
      const data = await update_staff(req, res);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(400).json(data);
      }
    } catch (error) {
      console.log("Error in update_staff:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.delete_staff = async (req, res) => {
    try {
      const data = await delete_staff(req, res);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(400).json(data);
      }
    } catch (error) {
      console.log("Error in delete_staff:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
