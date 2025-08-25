// Blog List Component (React)
// Copy vào frontend React project của bạn

import React, { useState, useEffect } from 'react';
import BlogService from './blogService';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await BlogService.getAllBlogs();
      setBlogs(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await BlogService.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (err) {
        setError('Failed to delete blog');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading blogs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="blog-list">
      <h1>All Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="blogs-grid">
          {blogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <h3>{blog.title}</h3>
              <p className="author">By: {blog.author || 'Anonymous'}</p>
              <p className="content">{blog.content.substring(0, 150)}...</p>
              <p className="date">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>
              <div className="actions">
                <button 
                  onClick={() => window.location.href = `/blog/${blog.id}`}
                  className="btn-view"
                >
                  View
                </button>
                <button 
                  onClick={() => window.location.href = `/blog/edit/${blog.id}`}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(blog.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
