import { useState } from "react";
import { useRouter } from "next/router";
import connectToDatabase from "@/lib/mongodb";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = await connectToDatabase();
      const collection = db.collection("admin");
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        setError("User already exists");
        return;
      }
      await collection.insertOne({ email, password });
      router.push("/auth/signin");
    } catch (err) {
      setError("Error creating user");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col flex-center wh_100">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}