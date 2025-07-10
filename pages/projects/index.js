import { FaBlog } from "react-icons/fa";
import useFetchData from "@/hooks/useFetchData";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Projects() {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(7);
    const [searchQuery, setSearchQuery] = useState("");

    const { allData, loading } = useFetchData("/api/projects");

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredBlogs =
        searchQuery.trim() === ""
            ? allData || []
            : (allData || []).filter((blog) =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

    const indexOfFirstBlog = (currentPage - 1) * perPage;
    const indexOfLastBlog = currentPage * perPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(filteredBlogs.length / perPage);

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this blog?")) {
            try {
                await axios.delete(`/api/blogs?id=${id}`);
                window.location.reload();
            } catch (error) {
                console.error("Error deleting blog:", error);
            }
        }
    };

    const handleEdit = (id) => {
        router.push(`/blogs/edit/${id}`);
    };
    return <>
        <div className="blogpage">
            <div className="titledashboard flex flex-sb">
                <div>
                    <h2>
                        All published <span>Project</span>
                    </h2>
                    <h3>ADMIN PANEL</h3>
                </div>
                <div className="breadcrumb">
                    <FaBlog />
                    <span>/</span> <span>Blogs</span>
                </div>
            </div>

            <div className="blogstable">
                <div className="flex gap-2 mb-1">
                    <h2>Search project :</h2>
                    <input
                        type="text"
                        placeholder="Search by title.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <table className="table table-styling">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Edit/Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4">Loading...</td>
                            </tr>
                        ) : currentBlogs.length > 0 ? (
                            currentBlogs.map((blog, index) => (
                                <tr key={blog._id}>
                                    <td>{indexOfFirstBlog + index + 1}</td>
                                    <td>
                                        {blog.images && blog.images.length > 0 ? (
                                            <img
                                                src={blog.images[0]}
                                                alt={blog.title}
                                                style={{ width: "50px", height: "50px" }}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td>{blog.title}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(blog._id)}
                                            className="border rounded px-2 py-1 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="border rounded px-2 py-1"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No Project found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={currentPage === i + 1 ? "active" : ""}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

    </>
}