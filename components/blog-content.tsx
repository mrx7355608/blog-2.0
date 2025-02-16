'use client';

import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-ini';
// Plugins
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/autolinker/prism-autolinker';

export default function BlogContent({ content }: { content: string }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <section
      className="prose max-w-none text-left mb-12 line-numbers match-braces"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
