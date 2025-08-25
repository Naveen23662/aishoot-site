/*
  scripts.js
  This file adds interactivity to the AIShoot website. It attaches event listeners
  for the before/after slider, model skin tone and pose selections, background
  filtering and preview, and the contact form submission. All DOM queries are
  wrapped in checks to gracefully degrade on pages where elements aren't present.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Highlight active navigation link based on current path
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.navbar a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /**
   * Before/After slider functionality
   * The overlay image width shrinks as the range slider increases so the
   * enhanced image is revealed. When the slider is at max, the overlay width
   * is zero and only the enhanced photo is visible.
   */
  const slider = document.getElementById('slider-range');
  const overlay = document.querySelector('.slider-container .overlay-img');
  if (slider && overlay) {
    // initialise overlay width based on default value
    overlay.style.width = `${100 - slider.value}%`;
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      overlay.style.width = `${100 - val}%`;
    });
  }

  /**
   * Model & Pose simulation logic
   * Skin tones adjust the hue of the images via CSS filters. Poses switch
   * between the three pose images.
   */
  const skinButtons = document.querySelectorAll('.skin-choice');
  const poseButtons = document.querySelectorAll('.pose-choice');
  const poseImages = document.querySelectorAll('.model-display .pose-img');
  // Update the images displayed in the model view to a new source when the user selects a skin tone.
  const updateSkinTone = (imageSrc) => {
    poseImages.forEach(img => {
      // Preserve any inline transform (poses) while changing only the source
      const currentTransform = img.style.transform;
      img.src = imageSrc;
      img.style.transform = currentTransform;
    });
  };
  if (skinButtons.length) {
    // Default active skin
    skinButtons[0].classList.add('active');
    updateSkinTone(skinButtons[0].dataset.image);
    skinButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        skinButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSkinTone(btn.dataset.image);
      });
    });
  }
  if (poseButtons.length) {
    // Set default pose
    poseButtons[0].classList.add('active');
    const defaultPoseId = poseButtons[0].dataset.pose;
    const defaultImg = document.getElementById(defaultPoseId);
    if (defaultImg) defaultImg.classList.add('active');
    poseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        poseButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const poseId = btn.dataset.pose;
        poseImages.forEach(img => img.classList.remove('active'));
        const imgToShow = document.getElementById(poseId);
        if (imgToShow) imgToShow.classList.add('active');
      });
    });
  }

  /**
   * Background gallery filtering and preview
   * Filter buttons show/hide cards by category. Clicking a card updates
   * the preview background image.
   */
  const filterButtons = document.querySelectorAll('.filter-buttons .filter');
  const bgCards = document.querySelectorAll('.background-grid .background-card');
  const preview = document.getElementById('bg-preview');
  if (filterButtons.length && bgCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category;
        bgCards.forEach(card => {
          if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
    // Default filter to show all
    filterButtons[0].classList.add('active');
  }
  if (bgCards.length && preview) {
    // Initialise preview with first card's image
    const firstCardImage = bgCards[0].dataset.image;
    if (firstCardImage) {
      preview.style.backgroundImage = `url('${firstCardImage}')`;
    }
    bgCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgPath = card.dataset.image;
        preview.style.backgroundImage = `url('${imgPath}')`;
      });
    });
  }

  /**
   * Contact form submission
   * Prevents default form submission and displays a temporary success message.
   */
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (successMsg) {
        successMsg.classList.remove('hidden');
        // Hide the success message after 5 seconds
        setTimeout(() => successMsg.classList.add('hidden'), 5000);
      }
      contactForm.reset();
    });
  }
});