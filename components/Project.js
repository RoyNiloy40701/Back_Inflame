
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Spinner from "./Spinner";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";
import { MdDeleteForever } from "react-icons/md";

export default function Project({

  _id 
  title: existingTitle,
  slug: existingslug,
  images: existingimages,
  description: existingdescription,
  blogCategory: existingblogCategory,
  tags: existingtags,
  status: existingstatus,




}) {

  const [title, setTitle] = useState(existingTitle || '');
  const [slug, setSlug] = useState(existingslug || '');
  const [images, setImages] = useState(existingimages || []);
  const [description, setDescription] = useState(existingdescription || '');
  const [blogCategory, setBlogCategory] = useState(existingblogCategory || []);
  const [tags, setTags] = useState(existingtags || []);
  const [status, setStatus] = useState(existingstatus || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Load existing blog data for editing
  useEffect(() => {
    if (_id) {
      axios
        .get(`/api/blogs?id=${_id}`)
        .then((response) => {
          const blog = response.data;
          setTitle(blog.title || "");
          setSlug(blog.slug || "");
          setImages(Array.isArray(blog.images) ? blog.images : []);
          setDescription(blog.description || "");
          setBlogCategory(Array.isArray(blog.blogcategory) ? blog.blogcategory : []);
          setTags(Array.isArray(blog.tags) ? blog.tags : []);
          setStatus(blog.status || "");
        })
        .catch((error) => {
          console.error("Failed to load blog:", error.response?.data || error.message);
          toast.error("Failed to load blog data");
        });
    }
  }, [_id]);

  // Handle redirect after successful save
  useEffect(() => {
    if (isSubmitting && !isUploading) {
      router.push("/blogs");
    }
  }, [isSubmitting, isUploading, router]);

  async function createBlog(ev) {
    ev.preventDefault();

    if (isUploading) {
      toast.error("Please wait for images to finish uploading");
      return;
    }

    if (!slug) {
      toast.error("Slug is required");
      return;
    }

    const data = {
      title,
      slug,
      images,
      description,
      blogcategory: blogCategory,
      tags,
      status: status || "draft",
    };

    console.log("Data being sent to /api/blogs:", data);

    try {
      setIsSubmitting(true);
      if (_id) {
        await axios.put("/api/blogs", { ...data, _id });
        toast.success("Blog Updated");
      } else {
        await axios.post("/api/blogs", data);
        toast.success("Blog Created");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error("Error saving blog:", error.response?.data || error.message);
      toast.error(`Failed to save blog: ${errorMessage}`);
      setIsSubmitting(false);
    }
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const uploadImagesQueue = [];
      const newLinks = [];

      for (const file of files) {
        console.log(`Uploading file: ${file.name}, Size: ${file.size}, Type: ${file.type}`);
        const data = new FormData();
        data.append("file", file);
        uploadImagesQueue.push(
          axios
            .post("/api/upload", data, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
              // Handle different possible response structures
              const links = res.data.links || (res.data.data?.links ? res.data.data.links : []);
              if (Array.isArray(links) && links.length > 0) {
                newLinks.push(...links);
              } else {
                console.error("Invalid response format or no links:", res.data);
                toast.error(`Failed to process upload for ${file.name}`);
              }
            })
            .catch((error) => {
              console.error(`Error uploading file ${file.name}:`, error.response?.data || error.message);
              toast.error(`Failed to upload ${file.name}`);
              return null;
            })
        );
      }

      try {
        await Promise.all(uploadImagesQueue);
        setImages((oldImages) => [...oldImages, ...newLinks]);
        setIsUploading(false);
        toast.success("Images Uploaded");
      } catch (error) {
        console.error("Upload error:", error.response?.data || error.message);
        setIsUploading(false);
        toast.error("Failed to upload images");
      }
    } else {
      toast.error("No files selected");
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }

  async function handleDeleteImage(index) {
    const imageToDelete = images[index];
    try {
      await axios.delete("/api/upload", { data: { link: imageToDelete } });
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
      toast.success("Image Deleted Successfully");
    } catch (error) {
      console.error("Delete image failed:", error.response?.data || error.message);
      toast.error("Failed to delete image");
    }
  }

  function handleSlugChange(ev) {
    const inputValue = ev.target.value;
    const newSlug = inputValue
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(newSlug);
  }

  function handleCategoryChange(e) {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setBlogCategory([...new Set(selected)]);
  }

  function handleTagsChange(e) {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setTags([...new Set(selected)]);
  }

  return (
    <>
      <form className="addWebsiteform" onSubmit={createBlog}>
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter small title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
          />
        </div>
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="slug">Slug (SEO-friendly URL)</label>
          <input
            type="text"
            id="slug"
            placeholder="Enter slug URL title"
            value={slug}
            onChange={handleSlugChange}
            required
          />
        </div>
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="category">Category</label>
          <select
            onChange={handleCategoryChange}
            value={blogCategory}
            name="category"
            id="category"
            multiple
          >
            <option value="Node Js">Web Development</option>
            <option value="React Js">Software Development</option>
            <option value="Next Js">Creative Design</option>
            <option value="CSS">Organic Marketing</option>
            <option value="Digital Marketing">Paid Marketing</option>
            <option value="Flutter Dev">Products</option>
          </select>
        </div>
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="fileInput">Images</label>
          <input
            type="file"
            id="fileInput"
            className="mt-1"
            accept="image/*"
            multiple
            onChange={uploadImages}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="w-100 flex-center mt-2">
              <Spinner />
            </div>
          )}
        </div>
        {!isUploading && images.length > 0 && (
          <div className="flex">
            <ReactSortable
              list={images}
              setList={updateImagesOrder}
              animation={200}
              className="flex gap-1"
            >
              {images.map((link, index) => (
                <div className="uploading" key={link}>
                  <img
                    src={link}
                    alt="Uploaded image"
                    className="object-cover"
                    style={{ width: "100px", height: "100px" }}
                    onError={(e) => {
                      console.error(`Failed to load image: ${link}`);
                      toast.error(`Failed to load image: ${link}`);
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="deleteimg">
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        )}
        <div className="Description w-100 flex flex-col flex-left mb-2">
          <label htmlFor="description">
            Blog content (for image: first upload and copy link and paste in{" "}
            <code>![alt text](link)</code>)
          </label>
          <MarkdownEditor
            value={description}
            onChange={(ev) => setDescription(ev.text)}
            style={{ width: "100%", height: "400px" }}
            renderHTML={(text) => (
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return inline ? (
                      <code>{children}</code>
                    ) : (
                      <div style={{ position: "relative" }}>
                        <pre
                          style={{
                            padding: "10px",
                            borderRadius: "5px",
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          <code>{children}</code>
                        </pre>
                        <button
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "#eee",
                            border: "none",
                            padding: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            navigator.clipboard
                              .writeText(String(children).trim())
                              .then(() => toast.success("Code copied!"))
                              .catch((err) =>
                                console.error("Failed to copy:", err)
                              );
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    );
                  },
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          />
        </div>
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="tags">Tags</label>
          <select
            onChange={handleTagsChange}
            value={tags}
            name="tags"
            id="tags"
            multiple
          >
            <option value="html">html</option>
            <option value="css">css</option>
            <option value="javascript">javascript</option>
            <option value="nextjs">nextjs</option>
            <option value="reactjs">reactjs</option>
            <option value="database">database</option>
          </select>
        </div>
        <div className="w-100 flex flex-col flex-left mb-2">
          <label htmlFor="status">Status</label>
          <select
            onChange={(ev) => setStatus(ev.target.value)}
            value={status}
            name="status"
            id="status"
          >
            <option value="">No select</option>
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
        </div>
        <div className="w-100 mb-1 mt-2">
          <button
            type="submit"
            className="w-100 addwebbtn flex-center"
            disabled={isUploading || isSubmitting}
          >
            {isUploading ? "Uploading Images..." : isSubmitting ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </form>
    </>
  );
}

