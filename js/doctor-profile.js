document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profile-form');
  const saveButton = document.getElementById('save-profile');
  const saveStatus = document.getElementById('save-status');
  const toastContainer = document.getElementById('toast-container');

  const profilePhotoInput = document.getElementById('photo-input');
  const profileSaveButton = document.getElementById('photo-save');
  const profileCurrentImage = document.getElementById('current-profile-photo');
  const profilePreview = document.getElementById('photo-preview');
  const profileActions = document.getElementById('photo-actions');

  const galleryInput = document.getElementById('gallery-input');
  const galleryTreatmentSelect = document.getElementById('gallery-treatment');
  const gallerySaveButton = document.getElementById('gallery-save');
  const galleryPreview = document.getElementById('gallery-preview');
  const galleryForm = document.getElementById('gallery-form');
  const galleryGrid = document.getElementById('gallery-grid');

  const addTreatmentButton = document.getElementById('add-treatment');
  const treatmentsGrid = document.getElementById('treatments-grid');

  let isDirty = false;
  let profileSelected = null;
  let profileCropped = null;
  let gallerySelected = null;
  let galleryCropped = null;

  const treatments = [
    { id: 1, title: 'Cataract Surgery' },
    { id: 2, title: 'Cornea Care' },
    { id: 3, title: 'Dry Eye Treatment' },
    { id: 4, title: 'Refractive Surgery' }
  ];

  const galleryTreatmentOptions = [
    'Cataract Surgery',
    'Cornea Care',
    'Dry Eye Treatment',
    'Refractive Surgery',
    'PDEK',
    'Medical Retina Care',
    'Anti-VEGF Treatment',
    'Laser Treatment'
  ];

  function updateDirty(value) {
    isDirty = value;
    saveStatus.textContent = value ? 'Unsaved changes' : 'All changes saved';
    saveButton.disabled = !value;
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast--${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  function setEmptyPreview(previewTarget, text) {
    previewTarget.innerHTML = `<div class="admin-photo-frame__empty">${text}</div>`;
  }

  function setPreviewContent(previewTarget, src, alt) {
    previewTarget.innerHTML = '';
    const previewImg = document.createElement('img');
    previewImg.src = src;
    previewImg.alt = alt;
    previewImg.className = 'preview-image';
    previewTarget.appendChild(previewImg);
  }

  function cropToSquare(image) {
    const size = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const sx = (image.naturalWidth - size) / 2;
    const sy = (image.naturalHeight - size) / 2;
    ctx.drawImage(image, sx, sy, size, size, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  function renderTreatments() {
    treatmentsGrid.innerHTML = '';
    treatments.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'admin-list-card';
      card.innerHTML = `
        <div class="admin-list-card__head">
          <div>
            <h4 class="admin-list-card__title">${item.title}</h4>
          </div>
          <div class="treatment-actions"></div>
        </div>
      `;
      const actions = card.querySelector('.treatment-actions');
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'admin-mini-button';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        const updated = prompt('Edit treatment title', item.title);
        if (updated && updated.trim()) {
          item.title = updated.trim();
          renderTreatments();
          updateDirty(true);
        }
      });
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'admin-mini-button admin-mini-button--danger';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        if (confirm(`Delete treatment "${item.title}"?`)) {
          const index = treatments.findIndex((t) => t.id === item.id);
          if (index > -1) {
            treatments.splice(index, 1);
            renderTreatments();
            updateDirty(true);
          }
        }
      });
      actions.appendChild(editButton);
      actions.appendChild(deleteButton);
      treatmentsGrid.appendChild(card);
    });
  }

  function addGalleryCard(source, treatmentName) {
    const card = document.createElement('article');
    card.className = 'admin-gallery-card';
    card.dataset.treatment = treatmentName;
    card.innerHTML = `
      <div class="admin-gallery-card__media"><img src="${source}" alt="${treatmentName} gallery image"></div>
      <div class="admin-gallery-card__body">
        <div>
          <h4 class="admin-gallery-card__title">${treatmentName}</h4>
          <div class="admin-gallery-card__caption">Saved to gallery</div>
        </div>
        <div class="gallery-item-actions">
          <button type="button" class="admin-mini-button">Edit</button>
          <button type="button" class="admin-mini-button admin-mini-button--danger">Delete</button>
        </div>
      </div>
    `;

    card.querySelector('.admin-mini-button:not(.admin-mini-button--danger)').addEventListener('click', () => {
      const updated = prompt('Update treatment name', card.dataset.treatment || treatmentName);
      if (updated && updated.trim()) {
        const nextTreatment = updated.trim();
        card.dataset.treatment = nextTreatment;
        card.querySelector('.admin-gallery-card__title').textContent = nextTreatment;
        updateDirty(true);
        showToast('Treatment updated.', 'success');
      }
    });

    card.querySelector('.admin-mini-button--danger').addEventListener('click', () => {
      card.remove();
      updateDirty(true);
      showToast('Gallery image removed.', 'success');
    });

    galleryGrid.prepend(card);
  }

  function setInputListeners() {
    profileForm.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => updateDirty(true));
    });
  }

  function resetProfileSelection() {
    profileSelected = null;
    profileCropped = null;
    profilePhotoInput.value = '';
    setEmptyPreview(profilePreview, 'Choose a photo to preview');
    profileActions.classList.add('hidden');
  }

  function resetGallerySelection() {
    gallerySelected = null;
    galleryCropped = null;
    galleryInput.value = '';
    galleryTreatmentSelect.value = galleryTreatmentOptions[0];
    galleryForm.classList.add('hidden');
    setEmptyPreview(galleryPreview, 'Choose an image to preview');
  }

  function previewImage(file, previewTarget, altText, onReady) {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        onReady(image, reader.result);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  profilePhotoInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    previewImage(file, profilePreview, 'Selected profile image', (image, dataUrl) => {
      profileSelected = image;
      profileCropped = cropToSquare(image);
      setPreviewContent(profilePreview, profileCropped, 'Cropped profile image');
      profileActions.classList.remove('hidden');
    });
  });

  galleryInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    previewImage(file, galleryPreview, 'Selected gallery image', (image, dataUrl) => {
      gallerySelected = image;
      galleryCropped = cropToSquare(image);
      setPreviewContent(galleryPreview, galleryCropped, 'Cropped gallery image');
      galleryForm.classList.remove('hidden');
    });
  });

  profileSaveButton.addEventListener('click', () => {
    if (!profileCropped) {
      showToast('Choose a photo before saving.', 'error');
      return;
    }
    profileCurrentImage.src = profileCropped;
    updateDirty(true);
    showToast('Profile photo saved successfully.', 'success');
    resetProfileSelection();
  });

  gallerySaveButton.addEventListener('click', () => {
    if (!galleryCropped) {
      showToast('Choose an image before saving.', 'error');
      return;
    }
    const treatmentName = galleryTreatmentSelect.value.trim();
    if (!treatmentName) {
      showToast('Select a treatment before saving.', 'error');
      return;
    }
    addGalleryCard(galleryCropped, treatmentName);
    updateDirty(true);
    showToast(`Image saved under ${treatmentName}.`, 'success');
    resetGallerySelection();
  });

  addTreatmentButton.addEventListener('click', () => {
    const title = prompt('New treatment title');
    if (!title || !title.trim()) return;
    treatments.push({ id: Date.now(), title: title.trim() });
    renderTreatments();
    updateDirty(true);
  });

  saveButton.addEventListener('click', () => {
    const nameField = document.getElementById('doctor-name');
    const roleField = document.getElementById('doctor-role');
    if (!nameField.value.trim() || !roleField.value.trim()) {
      showToast('Please provide a valid name and title before saving.', 'error');
      return;
    }
    updateDirty(false);
    showToast('All changes saved successfully.', 'success');
  });

  setInputListeners();
  renderTreatments();
  updateDirty(false);

  window.addEventListener('beforeunload', (event) => {
    if (!isDirty) return undefined;
    event.preventDefault();
    event.returnValue = '';
    return '';
  });
});
