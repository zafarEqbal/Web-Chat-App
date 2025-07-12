import { USER } from "../models/user_module.js";
export const verifyEmail = async (req, res) => {

  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ msg: "Token missing" });

    const decoded = jwt.verify(token, process.env.secretkey);

    const user = await USER.findOne({ Email: decoded.email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ msg: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "Invalid or expired token" });
  }
};
