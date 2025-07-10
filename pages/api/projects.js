import { Project } from "@/models/Project";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const {
          title,
          slug,
          images,
          description,
          client,
          projectcategory,
          tags,
          livepreview,
          status,
        } = req.body;

        if (!slug) {
          return res.status(400).json({ success: false, error: "Slug is required" });
        }

        const projectDoc = await Project.create({
          title: title || "",
          slug,
          images: images || [],
          description: description || "",
          client: client || "",
          projectcategory: projectcategory || [],
          tags: tags || [],
          livepreview: livepreview || "",
          status: status || "draft",
        });

        return res.status(201).json(projectDoc);
      } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "GET":
      try {
        if (req.query?.id) {
          const project = await Project.findById(req.query.id);
          if (!project) {
            return res.status(404).json({ success: false, error: "Project not found" });
          }
          return res.status(200).json(project);
        } else {
          const projects = await Project.find().sort({ createdAt: -1 });
          return res.status(200).json(projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "PUT":
      try {
        const {
          _id,
          title,
          slug,
          images,
          description,
          client,
          projectcategory,
          tags,
          livepreview,
          status,
        } = req.body;

        if (!_id || !slug) {
          return res.status(400).json({ success: false, error: "ID and slug are required" });
        }

        const updatedProject = await Project.findByIdAndUpdate(
          _id,
          {
            title: title || "",
            slug,
            images: images || [],
            description: description || "",
            client: client || "",
            projectcategory: projectcategory || [],
            tags: tags || [],
            livepreview: livepreview || "",
            status: status || "draft",
          },
          { new: true }
        );

        return res.status(200).json(updatedProject);
      } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    case "DELETE":
      try {
        if (!req.query?.id) {
          return res.status(400).json({ success: false, error: "ID is required" });
        }

        await Project.findByIdAndDelete(req.query.id);
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
