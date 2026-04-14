const hubSearch = document.getElementById('hub-search');
const hubResult = document.getElementById('hub-result');
const profileButtons = Array.from(document.querySelectorAll('.hub-profile-btn'));
const brandCards = Array.from(document.querySelectorAll('.hub-brand-card'));

if (hubSearch && hubResult && profileButtons.length && brandCards.length) {
  const STORAGE_PROFILE_KEY = 'studytechHubActiveProfile';
  const STORAGE_SEARCH_KEY = 'studytechHubSearchKeyword';

  const profileTagLabel = {
    budget: 'Hop tiet kiem',
    balanced: 'Hop can bang',
    performance: 'Hop hieu nang',
  };

  const availableProfiles = profileButtons.map((button) => button.dataset.profile || '');
  const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY) || '';
  const savedSearch = localStorage.getItem(STORAGE_SEARCH_KEY) || '';

  let activeProfile = availableProfiles.includes(savedProfile) ? savedProfile : 'balanced';

  const renderHubTags = () => {
    brandCards.forEach((card) => {
      if (card.querySelector('.hub-tags')) return;

      const profiles = (card.dataset.profile || '').toLowerCase().split(/\s+/).filter(Boolean);
      const tags = profiles
        .map((profile) => profileTagLabel[profile])
        .filter(Boolean);

      if (!tags.length) return;

      const tagRow = document.createElement('div');
      tagRow.className = 'hub-tags';

      tags.forEach((tagLabel) => {
        const tag = document.createElement('span');
        tag.className = 'hub-tag';
        tag.textContent = tagLabel;
        tagRow.appendChild(tag);
      });

      const title = card.querySelector('h3');
      if (title) {
        title.insertAdjacentElement('afterend', tagRow);
      } else {
        card.appendChild(tagRow);
      }
    });
  };

  const applyHubFilter = () => {
    const keyword = hubSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    brandCards.forEach((card) => {
      const profiles = (card.dataset.profile || '').toLowerCase().split(/\s+/).filter(Boolean);
      const profileMatched = activeProfile === 'all' || profiles.includes(activeProfile);

      const keyText = `${card.textContent} ${card.dataset.keywords || ''}`.toLowerCase();
      const keywordMatched = !keyword || keyText.includes(keyword);

      const visible = profileMatched && keywordMatched;
      card.classList.toggle('is-hidden', !visible);
      if (visible) visibleCount += 1;
    });

    const profileLabel = {
      all: 'tat ca',
      budget: 'goi y tiet kiem',
      balanced: 'goi y can bang',
      performance: 'goi y hieu nang',
    }[activeProfile] || 'tat ca';

    hubResult.textContent = `Dang hien thi ${visibleCount}/${brandCards.length} hang theo ${profileLabel}.`;

    localStorage.setItem(STORAGE_PROFILE_KEY, activeProfile);
    localStorage.setItem(STORAGE_SEARCH_KEY, hubSearch.value);
  };

  profileButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeProfile = button.dataset.profile || 'all';
      profileButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      applyHubFilter();
    });
  });

  profileButtons.forEach((button) => {
    button.classList.toggle('active', (button.dataset.profile || '') === activeProfile);
  });

  hubSearch.value = savedSearch;
  renderHubTags();
  hubSearch.addEventListener('input', applyHubFilter);
  applyHubFilter();
}
