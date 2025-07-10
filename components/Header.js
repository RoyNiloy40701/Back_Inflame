import { RiBarChartHorizontalLine } from "react-icons/ri";
import { BiExitFullscreen } from "react-icons/bi";
import { GoScreenFull } from "react-icons/go";
import { useState } from "react";
import LoginLayout from "./LoginLayout";

export default function Header({ handleAsideOpen }) {
  const [isFullscreen, setFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Add basic cross-browser support
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => {
          setFullscreen(true);
        }).catch((err) => console.error("Fullscreen request failed:", err));
      } else if (document.documentElement.webkitRequestFullscreen) { // Safari
        document.documentElement.webkitRequestFullscreen().then(() => {
          setFullscreen(true);
        }).catch((err) => console.error("Fullscreen request failed:", err));
      }
    } else {
      // Add basic cross-browser support
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setFullscreen(false);
        }).catch((err) => console.error("Fullscreen exit failed:", err));
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen().then(() => {
          setFullscreen(false);
        }).catch((err) => console.error("Fullscreen exit failed:", err));
      }
    }
  };

  return (
    // <LoginLayout>
    <header className="header flex flex-sb">
      <div className="logo flex gap-2">
        <h1>ADMIN</h1>
        <div className="headerham flex flex-center" onClick={handleAsideOpen}>
          <RiBarChartHorizontalLine /> {/* Add the sidebar toggle icon */}
        </div>
      </div>
      <div className="rightnav flex gap-2">
        <div onClick={toggleFullScreen}>
          {isFullscreen ? <BiExitFullscreen /> : <GoScreenFull />}
        </div>
        <div className="notification">
          <img src="/img/notification.png" alt="notification" onError={(e) => (e.target.style.display = 'none')} />
        </div>
        <div className="profilenav">
          <img src="/img/user.png" alt="user" onError={(e) => (e.target.style.display = 'none')} />
        </div>
      </div>
    </header>
    //  </LoginLayout>
  );
}