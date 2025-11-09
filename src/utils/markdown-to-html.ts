export const markdownToHtml = (markdown: string) => {
  if (!markdown) return '';
  
  // Log the markdown being converted
  //console.log("Converting markdown to HTML:", markdown);
  
  // Extract code blocks first to avoid processing their content
  const codeBlocks: string[] = [];
  const languages: string[] = [];
  
  let html = markdown.replace(/```([\w]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(code.trim());
    languages.push(lang.trim());
    return placeholder;
  });
  
  // Store inline code snippets to avoid processing
  const inlineCodeSnippets: string[] = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodeSnippets.length}__`;
    inlineCodeSnippets.push(code.trim());
    return placeholder;
  });
  
  // Convert images ![alt](url) - do this before links to avoid conflicts
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  
  // Convert links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert headers (# Header)
  html = html
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic (*text*)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert unordered lists
  html = html.replace(/^\s*-\s*(.*$)/gim, '<li>$1</li>');
  html = html.replace(/<li>(.*?)<\/li>/g, function(match) {
    return '<ul>' + match + '</ul>';
  }).replace(/<\/ul><ul>/g, '');
  
  // Convert ordered lists (1. item)
  html = html.replace(/^\s*\d+\.\s*(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)(?!<ul>|<\/li>)/g, function(match) {
    return '<ol>' + match + '</ol>';
  }).replace(/<\/ol><ol>/g, '');
  
  // Convert line breaks
  html = html.replace(/\n$/gim, '<br />');
  
  // Convert paragraphs (blank lines between text)
  html = html.replace(/^(?!<[hou]l|<li|<h)(.+)$/gim, '<p>$1</p>');
  
  // Restore code blocks with proper formatting
  html = html.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
    const idx = parseInt(index);
    const code = codeBlocks[idx];
    const lang = languages[idx];
    
    const langClass = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${langClass}>${escapeHtml(code)}</code></pre>`;
  });
  
  // Restore inline code snippets
  html = html.replace(/__INLINE_CODE_(\d+)__/g, (match, index) => {
    const code = inlineCodeSnippets[parseInt(index)];
    return `<span class="inline-code">${escapeHtml(code)}</span>`;
  });
  
  // Log the HTML result
  //console.log("Converted HTML:", html);
  
  return html;
}

// Helper function to escape HTML in code blocks
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}