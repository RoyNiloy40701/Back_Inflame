import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ContactEdit() {
  const router = useRouter();
  const { id } = router.query;
  const contactId = id;

  const [form, setForm] = useState({
    name: "", lname: "", email: "", company: "", phone: "", country: "", project: [], description: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (contactId) fetchContact();
    // eslint-disable-next-line
  }, [contactId]);

  async function fetchContact() {
    try {
      const res = await axios.get(`/api/contacts?id=${contactId}`);
      setForm({
        name: res.data.name || "",
        lname: res.data.lname || "",
        email: res.data.email || "",
        company: res.data.company || "",
        phone: res.data.phone || "",
        country: res.data.country || "",
        project: res.data.project || [],
        description: res.data.description || ""
      });
      setLoading(false);
    } catch {
      setError("Failed to load contact.");
      setLoading(false);
    }
  }

  async function updateContact(ev) {
    ev.preventDefault();
    setMessage(""); setError("");
    try {
      await axios.put("/api/contacts", { _id: contactId, ...form });
      setMessage("Contact updated successfully!");
      setTimeout(() => router.push("/contacts"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update contact.");
    }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleProjectChange = projectName =>
    setForm(form => ({
      ...form,
      project: form.project.includes(projectName)
        ? form.project.filter(p => p !== projectName)
        : [...form.project, projectName]
    }));

  if (loading) return <div>Loading...</div>;
  if (error && !loading) return <div>Error: {error}</div>;

  return (
    <form onSubmit={updateContact}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="First name" required />
      <input name="lname" value={form.lname} onChange={handleChange} placeholder="Last name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="company" value={form.company} onChange={handleChange} placeholder="Company" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
      <select name="country" value={form.country} onChange={handleChange}>
        <option value="">Select Country</option>
        <option value="Afghanistan">Afghanistan</option>
        <option value="Albania">Albania</option>
        {/* add more countries as needed */}
      </select>
      <div>
        {["Website Developer","App Developer","Software Developer","Design System","E-commerce Site","Performance Evaluation"].map(opt => (
          <label key={opt}>
            <input type="checkbox" value={opt} checked={form.project.includes(opt)} onChange={() => handleProjectChange(opt)} />
            {opt}
          </label>
        ))}
      </div>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Project Description" />
      <button type="submit">Update</button>
      {message && <div style={{color:"green"}}>{message}</div>}
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
}
