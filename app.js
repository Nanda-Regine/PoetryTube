/* ============================================
   POETRYTUBE — app.js
   Where African Voices Live Forever
   AI Features + UI Interactivity
   ============================================ */

// ── OpenAI API helper ─────────────────────────
async function callOpenAI(systemPrompt, userContent) {
  const OPENAI_KEY = window.OPENAI_API_KEY || '';
  if (!OPENAI_KEY) {
    console.warn('PoetryTube: OPENAI_API_KEY not set. Set window.OPENAI_API_KEY or use .env with a build tool.');
    throw new Error('API key not configured. Please add your OPENAI_API_KEY.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userContent }
      ],
      max_tokens: 400,
      temperature: 0.85
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// ── Mood filter bar (homepage) ────────────────
function initMoodFilter() {
  const filterBar = document.querySelector('.mood-filter-bar');
  if (!filterBar) return;

  const btns = filterBar.querySelectorAll('.mood-filter-btn');
  const sections = document.querySelectorAll('.video-section[data-moods]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedMood = btn.dataset.mood;

      if (selectedMood === 'all') {
        sections.forEach(s => s.classList.remove('hidden'));
        document.querySelectorAll('.video-card').forEach(c => c.style.display = '');
        return;
      }

      // Filter individual cards by mood
      sections.forEach(section => {
        const cards = section.querySelectorAll('.video-card');
        let anyVisible = false;

        cards.forEach(card => {
          const cardMoods = (card.dataset.moods || '').split(',').map(m => m.trim().toLowerCase());
          const match = cardMoods.includes(selectedMood.toLowerCase());
          card.style.display = match ? '' : 'none';
          if (match) anyVisible = true;
        });

        section.classList.toggle('hidden', !anyVisible);
      });
    });
  });

  // Also wire mood pill clicks on cards
  document.querySelectorAll('.mood-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const mood = pill.dataset.mood;
      const targetBtn = filterBar.querySelector(`[data-mood="${mood}"]`);
      if (targetBtn) targetBtn.click();
      filterBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

// ── Mobile sidebar ────────────────────────────
function initMobileSidebar() {
  const hamburger  = document.querySelector('.hamburger-btn');
  const sidebar    = document.querySelector('.sidebar');
  const overlay    = document.querySelector('.sidebar-overlay');

  if (!hamburger || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay && overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay && overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay && overlay.addEventListener('click', closeSidebar);

  // Close on nav item click (mobile)
  sidebar.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
}

// ════════════════════════════════════════════════
// AI FEATURE 1 — "Write With Me" Co-Creator Panel
// ════════════════════════════════════════════════
function initWriteWithMe() {
  const poemTextarea  = document.getElementById('poem-input');
  const completeBtn   = document.getElementById('complete-poem-btn');
  const outputBox     = document.getElementById('ai-output-box');
  const poemOutput    = document.getElementById('ai-poem-text');
  const copyBtn       = document.getElementById('copy-poem-btn');
  const whatsappBtn   = document.getElementById('whatsapp-share-btn');

  if (!poemTextarea || !completeBtn) return;

  const SYSTEM_PROMPT = `You are a poet who writes in the African spoken word tradition. Complete the following poem opening in 4-6 lines that honor the emotional tone and imagery the writer has begun. Write only the poem continuation — no explanation, no preamble. Make it powerful.`;

  completeBtn.addEventListener('click', async () => {
    const userPoem = poemTextarea.value.trim();
    if (!userPoem) {
      poemTextarea.focus();
      poemTextarea.style.borderColor = 'var(--burgundy-light)';
      setTimeout(() => poemTextarea.style.borderColor = '', 1500);
      return;
    }

    completeBtn.disabled = true;
    completeBtn.innerHTML = `<span class="loading-dots"><span></span><span></span><span></span></span> Writing...`;
    outputBox.classList.remove('visible');

    try {
      const result = await callOpenAI(SYSTEM_PROMPT, userPoem);
      poemOutput.textContent = result;
      outputBox.classList.add('visible');

      // Wire share buttons with fresh content
      if (copyBtn) {
        copyBtn.onclick = () => {
          const fullPoem = userPoem + '\n\n' + result;
          navigator.clipboard.writeText(fullPoem).then(() => {
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" fill="none" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" fill="none" stroke-width="2"/></svg> Copy`, 2000);
          });
        };
      }

      if (whatsappBtn) {
        whatsappBtn.onclick = () => {
          const fullPoem = userPoem + '\n\n' + result + '\n\n✍️ Written with PoetryTube AI — Where African Voices Live Forever';
          const encoded  = encodeURIComponent(fullPoem);
          window.open(`https://wa.me/?text=${encoded}`, '_blank');
        };
      }

    } catch (err) {
      outputBox.classList.add('visible');
      poemOutput.textContent = `⚠️ ${err.message}`;
      poemOutput.style.color = '#E85D26';
      setTimeout(() => poemOutput.style.color = '', 3000);
    } finally {
      completeBtn.disabled = false;
      completeBtn.innerHTML = '🌹 Complete My Poem with AI';
    }
  });

  // Mobile panel toggle
  const trigger = document.querySelector('.mobile-panel-trigger');
  const panel   = document.querySelector('.write-with-me-panel');
  const overlay = document.querySelector('.panel-overlay');

  if (trigger && panel) {
    trigger.addEventListener('click', () => {
      panel.classList.toggle('panel-open');
    });
    overlay && overlay.addEventListener('click', () => panel.classList.remove('panel-open'));
  }
}

// ════════════════════════════════════════════════
// AI FEATURE 2 — Title Generator (Upload page)
// ════════════════════════════════════════════════
function initTitleGenerator() {
  const poemDescTextarea = document.getElementById('poem-description');
  const generateBtn      = document.getElementById('generate-titles-btn');
  const titleChips       = document.getElementById('title-chips');
  const titleInput       = document.getElementById('video-title-input');

  if (!generateBtn || !poemDescTextarea) return;

  const SYSTEM_PROMPT = `Generate 5 compelling titles for a spoken word performance based on the content provided. Each title must be different in style:
1. Provocative and political
2. Poetic and abstract
3. Deeply personal and intimate
4. Universal and philosophical
5. Short and punchy (under 4 words)

Return ONLY a numbered list of titles. No explanations.`;

  generateBtn.addEventListener('click', async () => {
    const description = poemDescTextarea.value.trim();
    if (!description) {
      poemDescTextarea.focus();
      poemDescTextarea.style.borderColor = 'var(--burgundy-light)';
      setTimeout(() => poemDescTextarea.style.borderColor = '', 1500);
      return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span class="loading-dots"><span></span><span></span><span></span></span> Generating...`;
    titleChips && titleChips.classList.remove('visible');

    try {
      const result = await callOpenAI(SYSTEM_PROMPT, description);

      // Parse numbered list
      const lines = result.split('\n').filter(l => l.trim());
      const titles = lines.map(l => l.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean);

      if (titleChips) {
        titleChips.innerHTML = '';
        const styleLabels = ['Provocative', 'Poetic', 'Intimate', 'Philosophical', 'Punchy'];

        titles.forEach((title, i) => {
          const chip = document.createElement('button');
          chip.className = 'title-chip';
          chip.innerHTML = `<span class="chip-num">${styleLabels[i] || `Option ${i+1}`}</span>${title}`;
          chip.addEventListener('click', () => {
            if (titleInput) {
              titleInput.value = title;
              titleInput.focus();
            }
            titleChips.querySelectorAll('.title-chip').forEach(c => c.style.background = '');
            chip.style.background = 'rgba(74,14,42,0.6)';
            chip.style.borderColor = 'var(--burgundy-light)';
            chip.style.color = 'var(--text)';
          });
          titleChips.appendChild(chip);
        });

        titleChips.classList.add('visible');
      }

    } catch (err) {
      if (titleChips) {
        titleChips.innerHTML = `<p style="color: #E85D26; font-size: 0.8rem;">⚠️ ${err.message}</p>`;
        titleChips.classList.add('visible');
      }
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '✨ Get AI Title Ideas';
    }
  });
}

// ════════════════════════════════════════════════
// AI FEATURE 3 — Mood Auto-Tagger (Upload page)
// ════════════════════════════════════════════════
function initMoodAutoTagger() {
  const autoTagBtn = document.getElementById('auto-tag-btn');
  const poemDesc   = document.getElementById('poem-description');

  if (!autoTagBtn) return;

  const SYSTEM_PROMPT = `You are a poetry curator. Read the following poem or description and return ONLY a JSON array of 1-3 mood tags from this exact list: ['Defiant', 'Tender', 'Grief', 'Joy', 'Resistance', 'Love', 'Identity', 'Hope']

Example: ["Love", "Tender"]

Return ONLY the JSON array. Nothing else.`;

  autoTagBtn.addEventListener('click', async () => {
    const description = (poemDesc?.value || '').trim();
    if (!description) {
      poemDesc && poemDesc.focus();
      return;
    }

    autoTagBtn.disabled = true;
    autoTagBtn.innerHTML = `<span class="loading-dots"><span></span><span></span><span></span></span>`;

    try {
      const result = await callOpenAI(SYSTEM_PROMPT, description);

      // Parse JSON array safely
      const cleaned = result.replace(/```json|```/g, '').trim();
      let moods = JSON.parse(cleaned);

      if (!Array.isArray(moods)) moods = [moods];

      // Select matching chips
      const chips = document.querySelectorAll('.mood-tag-chip');
      chips.forEach(chip => {
        const chipMood = chip.dataset.mood;
        const isSelected = moods.some(m => m.toLowerCase() === chipMood.toLowerCase());
        chip.classList.toggle('selected', isSelected);
      });

    } catch (err) {
      console.warn('Mood auto-tag error:', err);
    } finally {
      autoTagBtn.disabled = false;
      autoTagBtn.innerHTML = '🏷️ Auto-Tag Mood';
    }
  });

  // Manual mood chip toggling
  document.querySelectorAll('.mood-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });
}

// ── Mood tag chip colors ──────────────────────
const MOOD_COLORS = {
  defiant:    '#E85D26',
  tender:     '#C77AC2',
  grief:      '#5B8FD4',
  joy:        '#E8C84A',
  resistance: '#4CAF72',
  love:       '#D4506A',
  identity:   '#6DB8A0',
  hope:       '#8BC34A'
};

function applyMoodColors() {
  document.querySelectorAll('[data-mood]').forEach(el => {
    const mood  = el.dataset.mood?.toLowerCase();
    const color = MOOD_COLORS[mood];
    if (color) el.style.setProperty('--mood-color', color);
  });
}

// ── Like button toggle ────────────────────────
function initLikeButton() {
  const likeBtn = document.getElementById('like-btn');
  if (!likeBtn) return;
  likeBtn.addEventListener('click', () => {
    const isLiked = likeBtn.classList.toggle('liked');
    const countEl = likeBtn.querySelector('.like-count');
    if (countEl) {
      const base = parseInt(countEl.dataset.base || '0', 10);
      countEl.textContent = isLiked ? base + 1 : base;
    }
  });
}

// ── Init all ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyMoodColors();
  initMobileSidebar();
  initMoodFilter();
  initWriteWithMe();
  initTitleGenerator();
  initMoodAutoTagger();
  initLikeButton();
});