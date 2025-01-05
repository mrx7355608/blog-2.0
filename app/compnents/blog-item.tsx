import React from 'react';
import { IBlog } from '../types/blog.types';

export const BlogItem = ({ blog }: { blog: IBlog }) => {
  return (
    <div className="w-full">
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
        {blog.title}
      </h1>

      {/* TAGS */}
      <div className="flex gap-2 items-center mt-1 flex-wrap">
        {blog.tags.map((tag) => {
          return (
            <span
              key={tag}
              className="text-sm sm:text-md bg-gray-900 p-3 py-1 text-sm rounded-md text-sky-600"
            >
              {tag}
            </span>
          );
        })}
      </div>

      {/* SUMMARY */}
      <p className="text-md sm:text-lg text-gray-400 mt-5">{blog.summary}</p>

      {/* DATE & READ BUTTON */}
      <div className="flex justify-between items-center mt-8">
        <p className="text-gray-600 text-sm mb-1">
          {new Date(blog.date).toDateString().slice(4)}
        </p>
        <a href={'/' + blog.slug} className="text-sky-400">
          Read blog →
        </a>
      </div>
      <hr className="border-gray-900 mt-5" />
    </div>
  );
};
