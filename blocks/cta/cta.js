export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const row = rows[0];
  const cols = [...row.children];

  if (cols.length < 2) return;

  const col1 = cols[0];
  const col2 = cols[1];

  // Determine which column has the image
  const col1HasImage = col1.querySelector('picture') !== null;
  const col2HasImage = col2.querySelector('picture') !== null;

  let imageCol;
  let textCol;
  let imageFirst = false;

  if (col1HasImage) {
    imageCol = col1;
    textCol = col2;
    imageFirst = true;
  } else if (col2HasImage) {
    imageCol = col2;
    textCol = col1;
    imageFirst = false;
  } else {
    // No image found
    return;
  }

  // Clear block
  block.textContent = '';

  // Create container
  const container = document.createElement('div');
  container.className = 'cta-container';

  // Create text section
  const textSection = document.createElement('div');
  textSection.className = 'cta-text';
  textSection.innerHTML = textCol.innerHTML;

  // Check if this is an email variant
  const isEmailVariant = block.classList.contains('email');
  if (isEmailVariant) {
    // Add email form if not already present
    if (!textSection.querySelector('.cta-form')) {
      const form = document.createElement('div');
      form.className = 'cta-form';
      form.innerHTML = `
        <input type="email" placeholder="Email Address" class="cta-email-input" aria-label="Email Address">
        <button type="button" class="cta-submit">SIGN UP</button>
      `;
      textSection.appendChild(form);
    }
  }

  // Create image section
  const imageSection = document.createElement('div');
  imageSection.className = 'cta-image';
  imageSection.innerHTML = imageCol.innerHTML;

  // Append in correct order based on original authoring
  if (imageFirst) {
    // Image on left in authoring = image on left in display
    container.appendChild(imageSection);
    container.appendChild(textSection);
    block.classList.add('image-left');
  } else {
    // Image on right in authoring = image on right in display (default layout)
    container.appendChild(textSection);
    container.appendChild(imageSection);
    block.classList.add('image-right');
  }

  block.appendChild(container);
}
