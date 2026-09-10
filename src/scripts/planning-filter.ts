/**
 * Filtre du planning par thématique. Progressif : les boutons sont masqués
 * dans le HTML et révélés ici, donc sans JS tout le programme reste visible.
 * Le filtre ne fait que masquer, jamais révéler du contenu absent.
 */
const filters = document.querySelector<HTMLElement>('[data-planning-filters]');
const list = document.querySelector<HTMLElement>('[data-planning-list]');
const empty = document.querySelector<HTMLElement>('[data-planning-empty]');

if (filters && list) {
  filters.hidden = false;
  filters.classList.replace('hidden', 'flex');

  filters.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-filter-value]');
    if (!button) return;

    const value = button.dataset.filterValue!;

    for (const b of filters.querySelectorAll<HTMLButtonElement>('[data-filter-value]')) {
      b.setAttribute('aria-pressed', String(b === button));
    }

    let visible = 0;
    for (const item of list.querySelectorAll<HTMLElement>('[data-filter]')) {
      // Les pauses (data-filter="none") se masquent avec le reste : pas de
      // pauses orphelines autour d'un programme filtré.
      const shown = value === 'all' || item.dataset.filter === value;
      item.hidden = !shown;
      if (shown) visible++;
    }

    if (empty) empty.hidden = visible > 0;
  });
}
