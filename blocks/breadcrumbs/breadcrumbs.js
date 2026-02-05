/**
 * Formats a URL segment into readable text
 * @param {string} segment - URL segment (e.g., "article-name")
 * @returns {string} Formatted text (e.g., "Article Name")
 */
function formatSegment(segment) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generates breadcrumbs from the current URL path
 * @returns {HTMLOListElement} Ordered list of breadcrumb items
 */
function generateBreadcrumbs() {
  const ol = document.createElement('ol');
  const { pathname } = window.location;

  // Always start with Home
  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  homeLi.appendChild(homeLink);
  ol.appendChild(homeLi);

  // Split path and build breadcrumbs
  const segments = pathname.split('/').filter((segment) => segment !== '');

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const li = document.createElement('li');

    // Last item is current page - no link
    if (index === segments.length - 1) {
      li.textContent = formatSegment(segment);
    } else {
      const link = document.createElement('a');
      link.href = currentPath;
      link.textContent = formatSegment(segment);
      li.appendChild(link);
    }

    ol.appendChild(li);
  });

  return ol;
}

export default function decorate(block) {
  // Clear any existing content
  block.textContent = '';

  // Generate breadcrumbs from URL
  const ol = generateBreadcrumbs();
  block.appendChild(ol);
}
