import React from 'react';
import { IBlog } from '../types/blog.types';
import { BlogItem } from './blog-item';

export const BlogsList = ({ blogs }: { blogs: IBlog[] }) => {
  return (
    <>
      {blogs.map((blog, index) => (
        <BlogItem key={index} blog={blog} />
      ))}
    </>
  );
};
