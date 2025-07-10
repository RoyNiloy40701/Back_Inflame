import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBlog } from "react-icons/fa";

export default function DeleteProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!id) return;
    else {
      axios.get("/api/blogs?id=" + id).then((response) => {
        if (response.data) {
          setProductInfo(response.data);
        }
      });
    }
  }, [id]);

  function goBack() {
    router.push("/blogs");
  }
  async function deleteBlog() {
    await axios.delete("/api/blogs?id =" + id);
    toast.success("delete successfully ");
    goBack();
  }

  return (
    <>
      <Head>
        <title>Delete blog</title>
      </Head>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              Delete <span>{productInfo?.title}</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <BsPostcard />
            <span>/</span>
            <span>Delete Blog </span>
          </div>
        </div>
        <div className="deletesec flex flex-center wh_100">
          <div className="deletecard">
            <svg>viewBox="0 0 24 24 " fill ="red" height="6em" width='6em'</svg>
          </div>
        </div>
      </div>
    </>
  );
}
