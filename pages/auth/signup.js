import { useState } from "react";
import { useRouter } from "next/router";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json();

      if (res.ok) {
        router.push("/auth/signin");
      } else {
        setError(data.error || "Failed to sign up");
      }

    } catch (err) {
      setError("Error creating user");
    }
  };

  return (
    <div className="flex flex-col flex-center wh_100">
      <form onSubmit={handleSubmit} >
        <h1 className="text-xl font-bold mb-4">Sign Up</h1>
        {error && <p className="text-red-600">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );

}