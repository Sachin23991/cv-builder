/**
 * Profile Item Component
 */

const ICON_MAP = {
  github: '⌂',
  linkedin: 'in',
  twitter: 'tw',
  facebook: 'fb',
  instagram: 'ig',
  youtube: 'yt',
  default: '●'
};

function getIcon(network) {
  return ICON_MAP[network?.toLowerCase()] || ICON_MAP.default;
}

export function ProfileItem(item = {}, options = {}) {
  const {
    layout = 'icons',
    cssVars = ''
  } = options;

  const { network, username, website } = item;

  const icon = getIcon(network);
  const displayText = username || website?.label || website?.url || network;

  if (layout === 'icons') {
    const url = website?.url || '';
    const content = url
      ? `<a href="${url}" target="_blank" style="font-size: 9pt; color: var(--page-text-color);">${icon} ${displayText}</a>`
      : `<span style="font-size: 9pt;">${icon} ${displayText}</span>`;

    return `
      <div class="profile-item" style="margin-bottom: 4pt;">
        ${content}
      </div>
    `;
  }

  // Simple list layout
  return `
    <div class="profile-item" style="margin-bottom: 4pt; font-size: 10pt;">
      <span class="profile-network">${network}:</span>
      <span class="profile-username">${username || displayText}</span>
    </div>
  `;
}

export default ProfileItem;