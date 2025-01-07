import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

// Path to the content folder
const postsDirectory = path.join(process.cwd(), 'blogs');
console.log(postsDirectory)

// Get all file names inside the 'blog' directory
export function getBlogsFilenames() {
  return fs.readdirSync(postsDirectory);
}

// Get post data (including content) from a single file
export async function getBlogsData(filename) {
  const filePath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  // Parse the Markdown file and extract frontmatter and content
  const { data, content } = matter(fileContents);

  // Convert Markdown content to HTML using remark
  const processedContent = await remark()
    .use(remarkHtml)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug: filename.replace(".md", ""),
    content: contentHtml,
    title: data.title,
    summary: data.summary,
    date: data.date,
    tags: data.tags,
  };
}

// Get a list of all posts with the required metadata
export function getAllBlogs() {
  const filenames = getBlogsFilenames();
  const allPostsData = filenames.map((filename) => {
    return getBlogsData(filename);
  });

  // Wait for all posts to be processed
  return Promise.all(allPostsData);
}

