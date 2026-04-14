document.querySelectorAll('.filter-panel').forEach((panel) => {
  const targetId = panel.dataset.target;
  const targetGrid = document.getElementById(targetId);
  if (!targetGrid) return;

  const badgeLabels = {
    installment: {
      yes: 'Tra gop',
      no: 'Khong can tra gop',
    },
    warranty: {
      basic: 'Bao hanh tieu chuan',
      premium: 'Bao hanh nang cao',
    },
    segment: {
      budget: 'Phan khuc tiet kiem',
      mid: 'Phan khuc can bang',
      premium: 'Phan khuc cao cap',
    },
  };

  const cards = Array.from(targetGrid.querySelectorAll('.product-card'));
  const selects = Array.from(panel.querySelectorAll('.filter-select'));
  const result = panel.querySelector('.filter-result');
  const resetBtn = panel.querySelector('.filter-reset');

  const renderStoreBadges = () => {
    cards.forEach((card) => {
      const badgeValues = ['installment', 'warranty', 'segment']
        .map((key) => {
          const raw = (card.dataset[key] || '')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)[0];

          if (!raw || !badgeLabels[key] || !badgeLabels[key][raw]) return null;
          return { key, label: badgeLabels[key][raw] };
        })
        .filter(Boolean);

      if (!badgeValues.length || card.querySelector('.store-badges')) return;

      const badgeRow = document.createElement('div');
      badgeRow.className = 'store-badges';

      badgeValues.forEach(({ key, label }) => {
        const badge = document.createElement('span');
        badge.className = `store-badge badge-${key}`;
        badge.textContent = label;
        badgeRow.appendChild(badge);
      });

      const actions = card.querySelector('.product-actions');
      if (actions) {
        card.insertBefore(badgeRow, actions);
      } else {
        card.appendChild(badgeRow);
      }
    });
  };

  const applyFilter = () => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const isVisible = selects.every((select) => {
        const key = select.dataset.key;
        const selectedValue = select.value;
        if (selectedValue === 'all') return true;

        const values = (card.dataset[key] || '')
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean);

        return values.includes(selectedValue);
      });

      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (result) {
      result.textContent = `Dang hien thi ${visibleCount}/${cards.length} san pham phu hop.`;
    }
  };

  selects.forEach((select) => {
    select.addEventListener('change', applyFilter);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      selects.forEach((select) => {
        select.value = 'all';
      });
      applyFilter();
    });
  }

  renderStoreBadges();
  applyFilter();
});
