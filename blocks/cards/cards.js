import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-container';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-card';

    const cols = [...row.children];
    const col1 = cols[0];
    const col2 = cols[1];

    // Determine image position based on authoring order
    const col1HasImage = col1?.querySelector('picture') !== null;

    let imageDiv;
    let textDiv;

    if (col1HasImage) {
      // Image on left = appears on top
      imageDiv = col1;
      textDiv = col2;
      li.classList.add('image-top');
    } else {
      // Image on right = appears on bottom
      imageDiv = col2;
      textDiv = col1;
      li.classList.add('image-bottom');
    }

    // Create image section
    if (imageDiv) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'cards-card-image';
      imageWrapper.innerHTML = imageDiv.innerHTML;
      li.appendChild(imageWrapper);
    }

    // Create text section
    if (textDiv) {
      const textWrapper = document.createElement('div');
      textWrapper.className = 'cards-card-body';
      textWrapper.innerHTML = textDiv.innerHTML;
      li.appendChild(textWrapper);
    }

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  // Create slider wrapper for mobile/tablet
  const sliderWrapper = document.createElement('div');
  sliderWrapper.className = 'cards-slider';
  sliderWrapper.appendChild(ul);

  // Add navigation arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'cards-nav cards-prev';
  prevBtn.innerHTML = '&#8249;';
  prevBtn.setAttribute('aria-label', 'Previous');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cards-nav cards-next';
  nextBtn.innerHTML = '&#8250;';
  nextBtn.setAttribute('aria-label', 'Next');

  sliderWrapper.appendChild(prevBtn);
  sliderWrapper.appendChild(nextBtn);

  block.replaceChildren(sliderWrapper);

  // Slider functionality for mobile/tablet
  let currentIndex = 0;
  const cards = ul.querySelectorAll('.cards-card');
  const totalCards = cards.length;

  function updateSlider() {
    const isMobile = window.innerWidth < 900;
    if (isMobile) {
      ul.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else {
      ul.style.transform = 'none';
    }
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - 1) {
      currentIndex += 1;
      updateSlider();
    }
  });

  window.addEventListener('resize', () => {
    currentIndex = 0;
    updateSlider();
  });
}
