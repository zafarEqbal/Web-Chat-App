
import { USER } from "../models/user_module.js";
import { OtpModel } from "../models/OtpModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

// ✅ Send OTP to user's email
// export const sendOtp = async (req, res) => {
//   try {
//     const { Email } = req.body;
//     if (!Email) return res.status(400).json({ msg: "Email is required" });

//     const existingUser = await USER.findOne({ Email });
//     if (existingUser) return res.status(400).json({ msg: "User already exists" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await OtpModel.create({ email: Email, otp });

//     await sendOtpEmail(Email, otp);

//     res.status(200).json({ msg: "OTP sent to your email" });
//   } catch (err) {
//     console.error("Error sending OTP:", err);
//     res.status(500).json({ msg: "Failed to send OTP" });
//   }
// };

export const sendOtp = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) return res.status(400).json({ msg: "Email is required" });

    // ❌ Don't allow OTP request if user already registered
    const existingUser = await USER.findOne({ Email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // ✅ Check if an OTP was recently sent (within 15 seconds)
    const lastOtp = await OtpModel.findOne({ email: Email }).sort({ createdAt: -1 });

    if (lastOtp) {
      const timeElapsed = (Date.now() - new Date(lastOtp.createdAt)) / 1000;
      if (timeElapsed < 15) {
        return res.status(429).json({
          msg: `Please wait ${Math.ceil(15 - timeElapsed)} seconds before requesting a new OTP.`
        });
      }
    }

    // ✅ Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save OTP in database
    await OtpModel.create({ email: Email, otp });

    // ✅ Send OTP email
    await sendOtpEmail(Email, otp);

    res.status(200).json({ msg: "📨 OTP sent to your email." });

  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

// ✅ Verify OTP and register user
export const register = async (req, res) => {
  try {
    const { FullName, UserName, Email, Password, ConfirmPassword, Gender, otp } = req.body;

    if (!FullName || !UserName || !Email || !Password || !ConfirmPassword || !Gender || !otp) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) return res.status(400).json({ msg: "Invalid email format" });

    if (Password !== ConfirmPassword) return res.status(400).json({ msg: "Passwords do not match" });

    const otpRecord = await OtpModel.findOne({ email: Email }).sort({ createdAt: -1 });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const existingUser = await USER.findOne({ $or: [{ UserName }, { Email }] });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedpass = await bcrypt.hash(Password, 10);
    const avatarBase = "https://api.dicebear.com/8.x/avataaars/svg";
    const seed = `${UserName}-${Math.floor(Math.random() * 10000)}`;
    const profilePhoto = `${avatarBase}?seed=${seed}&gender=${Gender.toLowerCase()}`;

    await USER.create({
      FullName,
      UserName,
      Email,
      Password: hashedpass,
      Gender,
      ProfilePhoto: profilePhoto,
      isVerified: true,
    });

    await OtpModel.deleteMany({ email: Email }); // Clean OTPs

    res.status(201).json({ msg: "User registered successfully", success: true });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Login User
export const login = async (req, res) => {
  try {
    const { UserName, Password } = req.body;
    if (!UserName || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await USER.findOne({ UserName });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const tokendata = { userid: user._id };
    const token = jwt.sign(tokendata, process.env.secretkey, { expiresIn: '1d' });

    return res.status(200).cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'None',
      secure: true
    }).json({
      message: "User logged in successfully",
      _id: user._id,
      UserName: user.UserName,
      fullName: user.FullName,
      ProfilePhoto: user.ProfilePhoto
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Logout
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.log("Logout Error:", error);
  }
};

// ✅ Get Other Users
export const getuser = async (req, res) => {
  try {
    const loggedinid = req.id;
    const otheruser = await USER.find({ _id: { $ne: loggedinid } }).select("-Password");
    return res.status(200).json(otheruser);
  } catch (error) {
    console.log("Get Users Error:", error);
  }
};
