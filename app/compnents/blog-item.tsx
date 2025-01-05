import React from 'react';
import { IBlog } from '../types/blog.types';

export const BlogItem = ({ blog }: { blog: IBlog }) => {
  return (
    <div className="w-full">
      <h1>{blog.title}</h1>
    </div>
  );
};
