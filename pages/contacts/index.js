import { FaBlog } from "react-icons/fa";
import useFetchData from "@/hooks/useFetchData";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function contacts() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");

  const { allData, loading } = useFetchData("/api/contacts");

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredContacts =
    searchQuery.trim() === ""
      ? allData || []
      : (allData || []).filter((contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const indexOfFirstContact = (currentPage - 1) * perPage;
  const indexOfLastContact = currentPage * perPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const publishedContacts = currentContacts;
  const totalPages = Math.ceil(filteredContacts.length / perPage);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`/api/contacts?id=${id}`);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/contacts/edit/${id}`);
  };

  return (
    <>
      <div className="blogpage">
        <div className="titledashboard flex flex-sb">
          <div>
            <h2>
              All <span>Contact</span>
            </h2>
            <h3>ADMIN PANEL</h3>
          </div>
          <div className="breadcrumb">
            <FaBlog />
            <span>/</span> <span>Contact</span>
          </div>
        </div>

        <div className="blogstable">
          <div className="flex gap-2 mb-1">
            <h2>Search Contact by name :</h2>
            <input
              type="text"
              placeholder="Search by name.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <table className="table table-styling">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Email</th>
                <th>Phone no</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : currentContacts.length > 0 ? (
                currentContacts.map((contact, index) => (
                  <tr key={contact._id}>
                    <td>{indexOfFirstContact + index + 1}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.project}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(contact._id)}
                        className="border rounded px-2 py-1 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="border rounded px-2 py-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Contacts found</td>
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
  );
}