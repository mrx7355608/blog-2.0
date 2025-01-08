import Link from 'next/link';
import { IBlog } from '../types/blog.types';

export const BlogItem = ({ blog }: { blog: IBlog }) => {
  return (
    <div className="w-full">
      {/* DATE */}
      <p className="text-gray-500 mb-2">
      	{new Date(blog.date).toDateString().slice(4)}
      </p>

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-3">
        <Link href={'/' + blog.slug} className="hover:underline">
          {blog.title}
        </Link>
      </h1>

      {/* TAGS */}
      <div className="flex gap-2 items-center flex-wrap">
        {blog.tags.map((tag) => {
          return (
            <span
              key={tag}
              className="text-sm sm:text-md bg-transparent border border-slate-900 p-3 py-1 rounded-md text-sky-500"
            >
              {tag}
            </span>
          );
        })}
      </div>

      {/* SUMMARY */}
      <p className="text-md sm:text-lg text-gray-400 mt-3 mb-7">{blog.summary.substring(0, 250)}...</p>

      {/* READ MORE LINK */}
      <Link href={'/' + blog.slug} className="text-sky-300">
      	Read more
      </Link>
      <hr className="border-gray-900 mt-5" />
    </div>
  );
};
