import { BlogsList } from '@/components/blogs-list';
import { SearchModal } from '@/components/search-modal';
import { getAllBlogs } from "@/utils/get-blogs";

export default async function Home() {
  const blogs = await getAllBlogs();

  return (
    <>
      <BlogsList blogs={blogs} />
      <SearchModal blogs={blogs} />
    </>
  );
}
