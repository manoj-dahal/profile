/* =================================================
   MODAL MODULE
   Opens project details in a glass modal
================================================= */
export function initModal() {
  const modal         = document.getElementById('modal');
  const modalTitle    = document.getElementById('modalTitle');
  const modalDesc     = document.getElementById('modalDesc');
  const modalTags     = document.getElementById('modalTags');
  const modalVisual   = document.getElementById('modalVisual');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalClose    = document.getElementById('modalClose');

  if (!modal) return;

  function openModal(key) {
    const data = window.projectData && window.projectData[key];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalVisual.innerHTML = `<span>${data.icon}</span>`;
    modalTags.innerHTML = data.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
    modalHighlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');
    modal.classList.add('open');
  }

  function closeModal() {
    modal.classList.remove('open');
  }

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger.dataset.modal);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}
