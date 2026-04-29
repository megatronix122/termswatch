const { createPatch } = require('diff');

function computeDiff(oldText, newText) {
  if (!oldText || !newText) {
    return { text: 'Initial capture - no previous version to compare.', html: '<p>Initial capture - no previous version to compare.</p>' };
  }

  const patch = createPatch('document', oldText, newText, 'Previous Version', 'Current Version');
  
  // Build a simple HTML diff
  const lines = patch.split('\n');
  let html = '<div class="diff">';
  let text = '';
  
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      html += `<div class="diff-added">${escapeHtml(line.substring(1))}</div>`;
      text += `+ ${line.substring(1)}\n`;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      html += `<div class="diff-removed">${escapeHtml(line.substring(1))}</div>`;
      text += `- ${line.substring(1)}\n`;
    }
  }
  
  html += '</div>';
  
  return { text: text || 'No significant text changes detected.', html };
}

function findKeywords(text) {
  const keywords = [
    'liability', 'indemnification', 'jurisdiction', 'governing law',
    'data processing', 'personal data', 'gdpr', 'ccpa', 'privacy',
    'cookies', 'tracking', 'third party', 'third-party', 'affiliate',
    'termination', 'suspension', 'refund', 'chargeback',
    'intellectual property', 'ip', 'copyright', 'trademark',
    'warranty', 'disclaimer', 'limitation of liability',
    'arbitration', 'class action', 'opt-out', 'consent',
    'children', 'coppa', 'age', 'minimum age',
    'health', 'hipaa', 'medical', 'biometric',
    'automated decision', 'profiling', 'ai', 'artificial intelligence',
    'subprocessor', 'data transfer', 'international transfer',
    'breach', 'security incident', 'notification',
  ];
  
  const found = [];
  const lowerText = text.toLowerCase();
  
  for (const keyword of keywords) {
    if (lowerText.includes(keyword)) {
      found.push(keyword);
    }
  }
  
  return found;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { computeDiff, findKeywords };
