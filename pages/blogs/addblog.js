import { FaBlogger } from "react-icons/fa";
import Blog from "@/components/Blog";

export default function Addblog(appOpen) {
  return (
    <>
      <div className="addblogspage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Add <span>Blog</span>
            </h2>
            <h3>ADMIN PANNEL</h3>
          </div>
          <div clasName="breadcrumb">
            <FaBlogger />
            <span>/</span> <span>Addblog</span>
          </div>
        </div>
        <div className="blogsadd"></div>
        <Blog />
      </div>
    </>
  );
}
