import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   try {
  //     const res = await fetch('/api/auth/signin', {
  //       method: 'POST',
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     })
  //     const data = await res.json();
  //     console.log("data", data)
  //     if (res.ok) {
  //       router.push("/");
  //     } else {
  //       setError(data.error || "Failed to sign in");
  //     }

  //   } catch (err) {
  //     setError("Error iN Login");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col flex-center wh_100">
      <form onSubmit={handleSubmit} >
        <h1 className="text-xl font-bold mb-4">Sign In</h1>
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


