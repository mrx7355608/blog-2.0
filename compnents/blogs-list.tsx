import React from 'react';
import { IBlog } from '../types/blog.types';
import { BlogItem } from './blog-item';

export const BlogsList = ({ blogs }: { blogs: IBlog[] }) => {
  return (
    <div className="w-full lg:w-3/4 flex flex-col gap-12 mx-auto p-6">
      {blogs.map((blog, index) => (
        <BlogItem key={index} blog={blog} />
      ))}
    </div>
  );
};
