import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginLayout({ children }) {
  // Avoid using useSession directly if not wrapped in SessionProvider
  let session = null;
  let status = "unauthenticated";
  try {
    const { data, status: sessionStatus } = useSession() || {};
    session = data;
    status = sessionStatus;
  } catch (error) {
    // Fallback if SessionProvider is missing
    console.warn("SessionProvider missing, defaulting to unauthenticated");
  }

  if (status === "loading") {
    return (
      <div className="full-h flex flex-center">
        <div className="loading-bar">Loading</div>
      </div>
    );
  }

  const router = useRouter();

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  if (session) {
    return <>{children}</>;
  }
}