import { BlogsList } from './compnents/blogs-list';

export default function Home() {
  const blogs = [
    {
      title: 'The Future of Web Development',
      summary:
        'Explore the latest trends and technologies shaping the future of web development, from AI-powered tools to the rise of serverless architecture.',
      slug: 'the-future-of-web-development',
      tags: ['Web Development', 'AI', 'Serverless', 'Tech Trends'],
      date: '2025-01-01',
    },
    {
      title: 'Mastering JavaScript: Best Practices',
      summary:
        'A comprehensive guide to writing clean, efficient, and maintainable JavaScript code, including common pitfalls and how to avoid them.',
      slug: 'mastering-javascript-best-practices',
      tags: ['JavaScript', 'Programming', 'Best Practices', 'Coding Tips'],
      date: '2024-12-15',
    },
    {
      title: 'How to Build Scalable Applications',
      summary:
        'Learn how to design and implement scalable applications that can handle high traffic while maintaining performance and reliability.',
      slug: 'how-to-build-scalable-applications',
      tags: [
        'Software Architecture',
        'Scalability',
        'Tech Tips',
        'Performance',
      ],
      date: '2024-11-30',
    },
    {
      title: 'Introduction to Machine Learning for Developers',
      summary:
        'An introductory guide to machine learning concepts for developers, focusing on how to integrate ML models into your applications.',
      slug: 'introduction-to-machine-learning-for-developers',
      tags: ['Machine Learning', 'AI', 'Developer Guide', 'Data Science'],
      date: '2024-10-20',
    },
    {
      title: 'Building a Personal Portfolio Website',
      summary:
        'Step-by-step tutorial on creating a stunning personal portfolio website to showcase your work and skills to potential employers.',
      slug: 'building-a-personal-portfolio-website',
      tags: ['Portfolio', 'Web Design', 'Personal Branding', 'Career'],
      date: '2024-09-10',
    },
  ];

  return <BlogsList blogs={blogs} />;
}
