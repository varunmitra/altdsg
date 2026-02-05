export default function decorate(block) {
  const rows = [...block.children];

  // Row 1: Heading
  const headingRow = rows[0];
  // Row 2: Links (can be in paragraphs or list)
  const linksRow = rows[1];

  // Extract heading text
  const headingText = headingRow?.textContent?.trim() || '';

  // Extract links - could be in ul/ol or in separate paragraphs
  let links = [];
  const linksList = linksRow?.querySelector('ul, ol');
  if (linksList) {
    links = [...linksList.querySelectorAll('a')];
  } else {
    // Links are in paragraphs
    links = [...(linksRow?.querySelectorAll('a') || [])];
  }

  // Clear block
  block.textContent = '';

  // Create heading section
  const headingSection = document.createElement('div');
  headingSection.className = 'explore-heading';
  const h3 = document.createElement('h3');
  h3.textContent = headingText;
  headingSection.appendChild(h3);
  block.appendChild(headingSection);

  // Create links section with 2 columns
  const linksSection = document.createElement('div');
  linksSection.className = 'explore-links';

  // Split links into 2 columns
  const midpoint = Math.ceil(links.length / 2);
  const col1Links = links.slice(0, midpoint);
  const col2Links = links.slice(midpoint);

  // Column 1
  const col1 = document.createElement('ul');
  col1.className = 'explore-col';
  col1Links.forEach((link) => {
    const li = document.createElement('li');
    li.appendChild(link.cloneNode(true));
    col1.appendChild(li);
  });
  linksSection.appendChild(col1);

  // Column 2
  const col2 = document.createElement('ul');
  col2.className = 'explore-col';
  col2Links.forEach((link) => {
    const li = document.createElement('li');
    li.appendChild(link.cloneNode(true));
    col2.appendChild(li);
  });
  linksSection.appendChild(col2);

  block.appendChild(linksSection);
}
