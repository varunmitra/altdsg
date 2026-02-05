export default function decorate(block) {
  // Expected structure from authoring:
  // Row 1: Image
  // Row 2: Heading
  // Row 3: Sub heading
  // Row 4: Photo credit

  const rows = [...block.children];

  // Get content from rows
  const imageRow = rows[0];
  const headingRow = rows[1];
  const subheadingRow = rows[2];
  const creditRow = rows[3];

  // Extract image
  const picture = imageRow?.querySelector('picture');

  // Extract text content
  const heading = headingRow?.textContent?.trim() || '';
  const subheading = subheadingRow?.textContent?.trim() || '';
  const credit = creditRow?.textContent?.trim() || '';

  // Clear block
  block.textContent = '';

  // Build hero structure
  if (picture) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-image';
    imageWrapper.appendChild(picture);
    block.appendChild(imageWrapper);
  }

  // Content overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';

  const content = document.createElement('div');
  content.className = 'hero-content';

  if (heading) {
    const h1 = document.createElement('h1');
    h1.className = 'hero-heading';
    h1.textContent = heading;
    content.appendChild(h1);
  }

  if (subheading) {
    const p = document.createElement('p');
    p.className = 'hero-subheading';
    p.textContent = subheading;
    content.appendChild(p);
  }

  overlay.appendChild(content);
  block.appendChild(overlay);

  // Photo credit - append to wrapper (outside hero block)
  if (credit) {
    const creditEl = document.createElement('div');
    creditEl.className = 'hero-credit';
    creditEl.textContent = credit;
    // Append to wrapper after block renders
    const wrapper = block.closest('.hero-wrapper');
    if (wrapper) {
      wrapper.appendChild(creditEl);
    } else {
      block.parentElement.appendChild(creditEl);
    }
  }
}
