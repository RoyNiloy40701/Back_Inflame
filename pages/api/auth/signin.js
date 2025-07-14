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

        const user = await Profile.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: "User Not Found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid password" });
        }

        return res.status(200).json({ message: "Sign in successful", user });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }




    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
