import { getBlogsData, getAllBlogs } from '@/utils/get-blogs'


export default async function Page({ params }: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  const blog = await getBlogsData(slug + ".md")

  return (
    <div className="mx-auto p-4 w-full text-center sm:w-3/4">
      {/* DATE */}
      <p className="font-medium text-gray-500">
        {new Date(blog.date).toDateString().slice(4)}
      </p>

      {/* TITLE */}
      <h1 className="text-3xl sm:text-4xl mt-3 text-gray-200 font-black">{blog.title}</h1>

      {/* TAGS */}
      <div className="flex gap-2 items-center mt-3 flex-wrap w-full justify-center">
        {blog.tags.map((tag: string) => {
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
      <hr className="border-gray-900 mt-5 mb-12" />
      <section className="prose max-w-none text-left" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}


export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({
	slug: blog.slug
  }))
}
