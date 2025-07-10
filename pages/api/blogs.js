import { mongooseConnect } from "@/lib/mongoose";
import { Blog } from "@/models/Blog"; 

export default async function handler(req, res) {
  await mongooseConnect();

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { title, slug, images, description, blogcategory, tags, status } = req.body;

        if (!slug) {
          return res.status(400).json({ success: false, error: "Slug is required" });
        }

        const blogDoc = await Blog.create({
          title: title || "",
          slug,
          images: images || [],
          description: description || "",
          blogcategory: blogcategory || [],
          tags: tags || [],
          status: status || "draft",
        });

        return res.status(201).json(blogDoc);
      } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "GET":
      try {
        if (req.query?.id) {
          const blog = await Blog.findById(req.query.id);
          if (!blog) {
            return res.status(404).json({ success: false, error: "Blog not found" });
          }
          return res.status(200).json(blog);
        } else {
          const blogs = await Blog.find().sort({ createdAt: -1 }); // ✅ better than .reverse()
          return res.status(200).json(blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "PUT":
      try {
        const { _id, title, slug, images, description, blogcategory, tags, status } = req.body;

        if (!_id || !slug) {
          return res.status(400).json({ success: false, error: "ID and slug are required" });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
          _id,
          {
            title: title || "",
            slug,
            images: images || [],
            description: description || "",
            blogcategory: blogcategory || [],
            tags: tags || [],
            status: status || "draft",
          },
          { new: true }
        );

        return res.status(200).json(updatedBlog);
      } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "DELETE":
      try {
        if (!req.query?.id) {
          return res.status(400).json({ success: false, error: "ID is required" });
        }

        await Blog.findByIdAndDelete(req.query.id);
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
