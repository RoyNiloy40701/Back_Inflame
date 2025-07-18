import { mongooseConnect } from "@/lib/mongoose";
import { Profile } from "@/models/Profile";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await mongooseConnect();

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body;

        const existingUser = await Profile.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Profile.create({ email, password: hashedPassword, });
        return res.status(201).json(user);

      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    case "GET":
      try {
        const users = await Profile.find();
        return res.status(200).json({ success: true, users });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
