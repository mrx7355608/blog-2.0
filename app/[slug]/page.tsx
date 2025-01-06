'use client';
import { IBlog } from '@/types/blog.types';

export default function Page({ blog }: { blog: IBlog }) {
  return (
    <div className="mx-auto p-4 w-full text-center sm:w-3/4">
      <p className="font-medium text-gray-500">
        {new Date().toDateString().slice(4)}
      </p>

      <h1 className="text-3xl sm:text-4xl mt-5 text-gray-200 font-black">
        My blog title
      </h1>
      <hr className="border-gray-900 mt-5" />
    </div>
  );
}
