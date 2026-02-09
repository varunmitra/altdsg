import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Social media SVG icons
 */
const socialIcons = {
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 2c5.523 0 10 4.504 10 10.06 0 5.023-3.656 9.185-8.437 9.94v-7.031h2.33l.443-2.908h-2.773v-1.886c0-.796.386-1.572 1.628-1.572h1.262V6.127s-1.144-.197-2.238-.197c-2.285 0-3.777 1.394-3.777 3.915v2.215h-2.54v2.909h2.54V22C5.656 21.245 2 17.083 2 12.06 2 6.504 6.477 2 12 2"></path>
  </svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.996 6.862a5.14 5.14 0 0 1 5.135 5.135 5.135 5.135 0 1 1-5.135-5.135m0 1.802a3.332 3.332 0 1 0-.001 6.665 3.332 3.332 0 0 0 .001-6.665"></path>
    <path fill="currentColor" d="M17.333 5.46a1.2 1.2 0 0 1 0 2.398 1.199 1.199 0 0 1 0-2.397"></path>
    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.996 2.001c2.714 0 3.056.012 4.127.056 1.067.047 1.794.217 2.429.464a5 5 0 0 1 1.77 1.155c.555.555.9 1.11 1.155 1.77.246.638.416 1.365.463 2.428.048 1.067.06 1.405.06 4.123s-.012 3.056-.06 4.123c-.047 1.067-.217 1.794-.463 2.429a5 5 0 0 1-1.156 1.77 4.9 4.9 0 0 1-1.77 1.155c-.638.246-1.364.416-2.428.463-1.067.048-1.405.06-4.123.06s-3.056-.012-4.123-.06c-1.067-.047-1.794-.217-2.429-.463a5 5 0 0 1-1.77-1.156 4.9 4.9 0 0 1-1.155-1.77c-.246-.638-.416-1.364-.463-2.428-.048-1.067-.06-1.409-.06-4.123s.012-3.056.06-4.12c.047-1.067.217-1.793.463-2.428.258-.655.6-1.214 1.156-1.77a4.9 4.9 0 0 1 1.77-1.155c.634-.246 1.36-.416 2.424-.463C8.94 2.013 9.282 2 11.996 2m0 1.802c-2.67 0-2.984.008-4.04.06-.976.043-1.503.21-1.856.344a3.06 3.06 0 0 0-1.152.746c-.349.35-.563.683-.746 1.151-.139.354-.3.881-.345 1.857-.047 1.055-.06 1.37-.06 4.04s.013 2.985.06 4.04c.044.976.21 1.503.345 1.857.179.468.397.802.746 1.15.35.35.683.564 1.152.747.353.139.88.301 1.856.345 1.056.047 1.37.06 4.04.06s2.985-.013 4.04-.06c.976-.044 1.503-.21 1.857-.345a3.06 3.06 0 0 0 1.15-.746c.35-.35.565-.683.747-1.151.139-.354.301-.881.345-1.857.047-1.056.06-1.37.06-4.04s-.013-2.985-.06-4.04c-.044-.976-.21-1.503-.345-1.857a3.06 3.06 0 0 0-.746-1.15 3.1 3.1 0 0 0-1.151-.747c-.354-.139-.881-.301-1.857-.345-1.055-.047-1.37-.06-4.04-.06"></path>
  </svg>`,
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" d="M15.882 16.594H14.6L8.42 7.762h1.293z"></path>
    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.5 2A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2zm-9.023 10.898-4.242 4.957h1.666l3.32-3.892 2.723 3.892h4.36l-4.682-6.703L17.59 6.5h-1.64l-3.071 3.588L10.373 6.5H6z"></path>
  </svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 5c.003 0 6.25 0 7.807.418a2.52 2.52 0 0 1 1.772 1.772C22 8.748 22 12 22 12s0 3.252-.41 4.81a2.5 2.5 0 0 1-1.772 1.772C18.25 19 12.003 19 12 19c0 0-6.25 0-7.807-.418a2.52 2.52 0 0 1-1.772-1.772C2 15.252 2 12 2 12s0-3.251.41-4.81a2.5 2.5 0 0 1 1.772-1.772C5.75 5 12 5 12 5m-2.046 9.958L15.182 12 9.954 9.042z"></path>
  </svg>`,
};

/**
 * Creates the social links section with SVG icons
 * @param {Element} section The social section element
 */
function decorateSocialLinks(section) {
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // Find existing links in the authored content
  const links = wrapper.querySelectorAll('a');
  const socialLinksData = [];

  links.forEach((link) => {
    const href = link.href.toLowerCase();
    let platform = null;
    let label = '';

    if (href.includes('facebook')) {
      platform = 'facebook';
      label = 'follow us on facebook';
    } else if (href.includes('instagram')) {
      platform = 'instagram';
      label = 'follow us on instagram';
    } else if (href.includes('twitter') || href.includes('x.com')) {
      platform = 'twitter';
      label = 'follow us on X';
    } else if (href.includes('youtube')) {
      platform = 'youtube';
      label = 'follow us on youtube';
    }

    if (platform) {
      socialLinksData.push({ href: link.href, platform, label });
    }
  });

  // Create new social links container
  const socialContainer = document.createElement('div');
  socialContainer.className = 'footer-social-links';

  socialLinksData.forEach(({ href, platform, label }) => {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.setAttribute('aria-label', label);
    anchor.innerHTML = socialIcons[platform];
    socialContainer.appendChild(anchor);
  });

  // Add tagline
  const tagline = document.createElement('p');
  tagline.className = 'footer-social-tagline';
  tagline.innerHTML = '<strong>Follow us.</strong> We\'ll guide you.';
  socialContainer.appendChild(tagline);

  // Replace wrapper content
  wrapper.innerHTML = '';
  wrapper.appendChild(socialContainer);
}

/**
 * Decorates the top section with logo and contact info
 * Parses "Label: Content" format from bullet items
 * @param {Element} section The top section element
 */
function decorateTopSection(section) {
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // Find bullet list items with "Label: Content" format
  const listItems = wrapper.querySelectorAll('li');

  listItems.forEach((li) => {
    const text = li.textContent;
    const colonIndex = text.indexOf(':');

    if (colonIndex > 0) {
      const label = text.substring(0, colonIndex).trim();
      const content = text.substring(colonIndex + 1).trim();

      // Check if content contains a link
      const link = li.querySelector('a');

      // Create structured element
      const infoBlock = document.createElement('div');
      infoBlock.className = 'footer-info-block';

      const labelEl = document.createElement('strong');
      labelEl.textContent = label;

      const contentEl = document.createElement('span');
      if (link) {
        // If there's a link, use it
        const newLink = link.cloneNode(true);
        newLink.textContent = content || link.textContent;
        contentEl.appendChild(newLink);
      } else {
        contentEl.textContent = content;
      }

      infoBlock.appendChild(labelEl);
      infoBlock.appendChild(contentEl);

      // Replace li content
      li.innerHTML = '';
      li.appendChild(infoBlock);
    }
  });

  // Remove bullet styling from the list
  const ul = wrapper.querySelector('ul');
  if (ul) {
    ul.classList.add('footer-info-list');
  }
}

/**
 * Decorates the footer link sections with accordion functionality for mobile
 * Parses h2 headings followed by ul lists and creates column structure
 * @param {Element} section The section containing link columns
 */
function decorateAccordions(section) {
  const wrapper = section.querySelector('.default-content-wrapper');
  if (!wrapper) return;

  // Find all h2 elements - each represents a column
  const headings = wrapper.querySelectorAll('h2');
  if (headings.length === 0) return;

  // Create columns container
  const columnsContainer = document.createElement('div');
  columnsContainer.className = 'footer-links-container';

  headings.forEach((heading) => {
    // Find the ul that follows this h2
    let list = heading.nextElementSibling;
    while (list && list.tagName !== 'UL') {
      list = list.nextElementSibling;
    }

    if (!list) return;

    // Create column wrapper
    const column = document.createElement('div');
    column.className = 'footer-link-column';

    // Create accordion structure
    const accordion = document.createElement('div');
    accordion.className = 'footer-accordion';

    // Create accordion header
    const header = document.createElement('button');
    header.className = 'footer-accordion-header';
    header.setAttribute('aria-expanded', 'false');
    header.innerHTML = `
      <span>${heading.textContent}</span>
      <span class="footer-accordion-icon">+</span>
    `;

    // Create accordion content
    const content = document.createElement('div');
    content.className = 'footer-accordion-content';
    content.appendChild(list.cloneNode(true));

    // Toggle accordion on click (mobile only)
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      accordion.classList.toggle('is-open', !isExpanded);
      header.querySelector('.footer-accordion-icon').textContent = isExpanded ? '+' : '−';
    });

    accordion.appendChild(header);
    accordion.appendChild(content);
    column.appendChild(accordion);
    columnsContainer.appendChild(column);
  });

  // Replace wrapper content with new structure
  wrapper.innerHTML = '';
  wrapper.appendChild(columnsContainer);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/fragments/nav/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';

  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Get all sections
  const sections = footer.querySelectorAll('.section');

  sections.forEach((section, index) => {
    if (index === 0) {
      // Section 1: Top bar (logo, help, customer service)
      section.classList.add('footer-top');
      decorateTopSection(section);
    } else if (index === 1) {
      // Section 2: Link columns with accordions
      section.classList.add('footer-links');
      decorateAccordions(section);
    } else if (index === 2) {
      // Section 3: Social icons
      section.classList.add('footer-social');
      decorateSocialLinks(section);
    }
  });

  block.append(footer);
}
