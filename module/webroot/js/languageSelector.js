import { t, getAvailableLanguages, saveLanguagePreference, getCurrentLanguage } from './i18n.js';
import router_state from './router.js';
import { exec, toast } from './kernelsu.js';

export async function initLanguageSettings() {
  // Get or create language settings menu
  const settingsCard = document.querySelector('.settings');
  
  if (!settingsCard) return;
  
  // Create language settings group if it doesn't exist
  let langGroup = document.getElementById('language-settings-group');
  if (!langGroup) {
    langGroup = document.createElement('div');
    langGroup.id = 'language-settings-group';
    langGroup.className = 'collapsible-group';
    
    langGroup.innerHTML = `
      <div class="collapsible-header">
        <h4>${t('language')}</h4>
        <span class="arrow">▼</span>
      </div>
      <div class="collapsible-content">
        <div class="setting-group">
          <div class="setting-row">
            <label for="language-select">${t('language')}</label>
            <select id="language-select" class="dropdown">
              ${getAvailableLanguages().map(lang => 
                `<option value="${lang.code}" ${lang.code === getCurrentLanguage() ? 'selected' : ''}>${lang.name}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      </div>
    `;
    
    // Insert before the Apply button group
    const applyGroup = settingsCard.querySelector('.setting-group:has(#apply)') || settingsCard.querySelector('.setting-group:last-of-type');
    if (applyGroup) {
      applyGroup.parentNode.insertBefore(langGroup, applyGroup);
    } else {
      settingsCard.appendChild(langGroup);
    }
    
    // Add collapsible functionality
    setupCollapsible(langGroup);
  }
  
  // Add change event listener
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      saveLanguagePreference(e.target.value);
      location.reload(); // Reload to apply translations
    });
  }
}

function setupCollapsible(group) {
  const header = group.querySelector('.collapsible-header');
  const content = group.querySelector('.collapsible-content');
  
  if (!header || !content) return;
  
  content.classList.add('collapsed');
  
  header.addEventListener('click', () => {
    header.classList.toggle('active');
    content.classList.toggle('collapsed');
  });
}

export function updateLanguageSelectorUI() {
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = getCurrentLanguage();
  }
}
