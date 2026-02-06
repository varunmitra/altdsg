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
    // No image found, just return
    return;
  }

  // Clear block
  block.textContent = '';

  // Create container
  const container = document.createElement('div');
  container.className = 'author-container';

  // Create image section
  const imageSection = document.createElement('div');
  imageSection.className = 'author-image';
  imageSection.innerHTML = imageCol.innerHTML;

  // Create text section - preserve all HTML/styling
  const textSection = document.createElement('div');
  textSection.className = 'author-text';
  textSection.innerHTML = textCol.innerHTML;

  // Append in correct order based on original authoring
  if (imageFirst) {
    container.appendChild(imageSection);
    container.appendChild(textSection);
  } else {
    container.appendChild(textSection);
    container.appendChild(imageSection);
  }

  block.appendChild(container);

  // Add class to indicate image position for CSS
  if (imageFirst) {
    block.classList.add('image-left');
  } else {
    block.classList.add('image-right');
  }
}
