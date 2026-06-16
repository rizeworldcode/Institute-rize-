const { referred_login,referred_logout, get_referrer_dashboard_data,admin_forgatePassword,sendOtpTOadmin,verifyOtp} = require("../../services/refferel/reffereValidation");



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

exports.get_referrer_dashboard_data = async (req, res) => {
  try {
    const data = await get_referrer_dashboard_data(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.referred_login = async (req, res) => {
    try {
      const data = await referred_login(req, res);
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

  exports.referred_logout = async (req, res) => {
    try {
      const data = await referred_logout(req, res);
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