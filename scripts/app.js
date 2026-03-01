/* ============================================
   POETRYTUBE — app.js
   Where African Voices Live Forever
   AI Features + UI Interactivity
   ============================================ */

// ── Global language state ─────────────────────
const LANGUAGE_LABELS = {
  en: 'English', sw: 'Swahili', zu: 'isiZulu',
  yo: 'Yorùbá',  am: 'አማርኛ',   fr: 'Français',
};

let globalLanguage = localStorage.getItem('pt-lang') || 'en';

window.setGlobalLanguage = function(lang, saveToDb = true) {
  globalLanguage = lang;
  localStorage.setItem('pt-lang', lang);

  // Update header button label + active state
  const nameEl = document.getElementById('header-lang-name');
  if (nameEl) nameEl.textContent = LANGUAGE_LABELS[lang] || 'English';

  document.querySelectorAll('.header-lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  // Persist to Supabase profile if signed in
  if (saveToDb && window.currentUser && window.db) {
    window.db.from('profiles')
      .update({ language: lang })
      .eq('id', window.currentUser.id)
      .then(() => {});
  }
};

// ── AI API helper (proxied via /api/ai — key stays server-side) ──
async function callOpenAI(systemPrompt, userContent, language = null) {
  const lang = language || globalLanguage;
  const body  = { systemPrompt, userContent };
  if (lang && lang !== 'en') body.language = lang;

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}

// ── Global language selector (header) ────────
function initLanguageSelector() {
  const selector  = document.getElementById('header-lang-selector');
  const btn       = document.getElementById('header-lang-btn');
  const dropdown  = document.getElementById('header-lang-dropdown');
  if (!selector || !btn) return;

  // Restore saved language on load
  window.setGlobalLanguage(globalLanguage, false);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    selector.classList.toggle('open');
  });

  dropdown && dropdown.querySelectorAll('.header-lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      window.setGlobalLanguage(opt.dataset.lang);
      selector.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) selector.classList.remove('open');
  });
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

  // Per-feature language override from the panel's lang buttons
  let panelLang = null;
  const panelLangBtns = document.querySelectorAll('#lang-selector-watch .lang-btn');
  panelLangBtns.forEach(b => {
    b.addEventListener('click', () => {
      panelLangBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      // Map button data-lang values to ISO codes
      const map = { english: 'en', swahili: 'sw', zulu: 'zu', yoruba: 'yo', amharic: 'am', french: 'fr' };
      panelLang = map[b.dataset.lang] || null;
    });
  });

  completeBtn.addEventListener('click', async () => {
    const userPoem = poemTextarea.value.trim();
    const lang = panelLang || globalLanguage;
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
      const result = await callOpenAI(SYSTEM_PROMPT, userPoem, lang);
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
      const result = await callOpenAI(SYSTEM_PROMPT, description, globalLanguage);

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

// ════════════════════════════════════════════════
// BOOKS PAGE — Book Shelf
// ════════════════════════════════════════════════
function initBooksPage() {
  if (!document.getElementById('books-grid')) return;

  let allBooks      = [];
  let activeLang    = 'all';
  let activeGenre   = 'all';

  // Load books from Supabase
  async function loadBooks() {
    if (!window.db) return;
    const { data } = await window.db
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    // Clear skeletons
    const grid = document.getElementById('books-grid');
    grid.innerHTML = '';

    allBooks = data || [];
    renderBooks();
  }

  function renderBooks() {
    const grid   = document.getElementById('books-grid');
    const emptyEl = document.getElementById('books-empty-msg');
    if (!grid) return;

    const filtered = allBooks.filter(b => {
      const langOk  = activeLang  === 'all' || b.language === activeLang;
      const genreOk = activeGenre === 'all' || b.genre    === activeGenre;
      return langOk && genreOk;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      emptyEl && emptyEl.classList.remove('hidden');
      return;
    }
    emptyEl && emptyEl.classList.add('hidden');

    filtered.forEach((book, idx) => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.style.animationDelay = `${idx * 0.04}s`;

      const langLabel = { en:'EN', sw:'SW', zu:'ZU', yo:'YO', am:'AM', fr:'FR' }[book.language] || book.language?.toUpperCase();
      const coverContent = book.cover_url
        ? `<img src="${book.cover_url}" alt="${escBooksHtml(book.title)}" loading="lazy" />`
        : '📖';

      card.innerHTML = `
        <div class="book-cover">
          ${coverContent}
          ${book.language && book.language !== 'en' ? `<span class="book-lang-badge">${langLabel}</span>` : ''}
        </div>
        <div class="book-info">
          <div class="book-title">${escBooksHtml(book.title)}</div>
          <div class="book-author">${escBooksHtml(book.author_name || '')}</div>
          ${book.genre ? `<span class="book-genre-tag">${book.genre.replace('-', ' ')}</span>` : ''}
          <a class="book-download-btn" href="${book.file_url}" target="_blank" rel="noopener"
             onclick="incrementDownload('${book.id}')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Free PDF
          </a>
        </div>`;
      grid.appendChild(card);
    });
  }

  window.incrementDownload = async function(bookId) {
    if (!window.db) return;
    const { data } = await window.db.from('books').select('download_count').eq('id', bookId).single();
    if (data) {
      await window.db.from('books').update({ download_count: (data.download_count || 0) + 1 }).eq('id', bookId);
    }
  };

  function escBooksHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Wire language filter buttons
  document.querySelectorAll('.books-filter-btn:not(.genre-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.books-filter-btn:not(.genre-btn)').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLang = btn.dataset.lang;
      renderBooks();
    });
  });

  // Wire genre filter buttons
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGenre = btn.dataset.genre;
      renderBooks();
    });
  });

  // Upload book modal
  const uploadBtn   = document.getElementById('upload-book-btn');
  const modal       = document.getElementById('upload-book-modal');
  const closeBtn    = document.getElementById('upload-book-close');
  const form        = document.getElementById('upload-book-form');

  uploadBtn?.addEventListener('click', () => {
    if (!window.currentUser) { window.openAuthModal('signin'); return; }
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeUploadModal = () => {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  };
  closeBtn?.addEventListener('click', closeUploadModal);
  modal?.querySelector('.upload-book-backdrop')?.addEventListener('click', closeUploadModal);

  // File label updates
  document.getElementById('book-cover-file')?.addEventListener('change', function() {
    document.getElementById('cover-label-text').textContent = this.files[0]?.name || 'Choose cover image';
  });
  document.getElementById('book-pdf-file')?.addEventListener('change', function() {
    document.getElementById('pdf-label-text').textContent = this.files[0]?.name || 'Choose PDF file';
  });

  // Upload form submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!window.currentUser || !window.db) return;

    const submitBtn  = document.getElementById('upload-book-submit-btn');
    const errEl      = document.getElementById('upload-book-error');
    const progressEl = document.getElementById('upload-progress');
    const fillEl     = document.getElementById('progress-fill');
    const labelEl    = document.getElementById('progress-label');
    const pdfFile    = document.getElementById('book-pdf-file').files[0];
    const coverFile  = document.getElementById('book-cover-file').files[0];

    if (!pdfFile) { errEl.textContent = 'Please select a PDF file.'; return; }

    submitBtn.disabled = true;
    errEl.textContent = '';
    progressEl?.classList.remove('hidden');

    try {
      const bookId = crypto.randomUUID();

      // Upload PDF
      if (labelEl) labelEl.textContent = 'Uploading PDF…';
      if (fillEl)  fillEl.style.width = '30%';

      const pdfPath = `${window.currentUser.id}/${bookId}/book.pdf`;
      const { error: pdfErr } = await window.db.storage.from('books').upload(pdfPath, pdfFile);
      if (pdfErr) throw pdfErr;
      const { data: pdfData } = window.db.storage.from('books').getPublicUrl(pdfPath);

      if (fillEl) fillEl.style.width = '60%';

      // Upload cover if provided
      let coverUrl = null;
      if (coverFile) {
        if (labelEl) labelEl.textContent = 'Uploading cover…';
        const coverExt  = coverFile.name.split('.').pop();
        const coverPath = `${bookId}/cover.${coverExt}`;
        const { error: covErr } = await window.db.storage.from('covers').upload(coverPath, coverFile);
        if (!covErr) {
          const { data: covData } = window.db.storage.from('covers').getPublicUrl(coverPath);
          coverUrl = covData?.publicUrl;
        }
      }

      if (fillEl) fillEl.style.width = '85%';

      // Save metadata
      if (labelEl) labelEl.textContent = 'Saving…';
      const { error: dbErr } = await window.db.from('books').insert({
        id:          bookId,
        user_id:     window.currentUser.id,
        title:       document.getElementById('book-title').value.trim(),
        author_name: document.getElementById('book-author').value.trim(),
        description: document.getElementById('book-description').value.trim(),
        language:    document.getElementById('book-language').value,
        genre:       document.getElementById('book-genre').value,
        file_url:    pdfData?.publicUrl,
        cover_url:   coverUrl,
      });
      if (dbErr) throw dbErr;

      if (fillEl) fillEl.style.width = '100%';
      if (labelEl) labelEl.textContent = 'Published!';

      // Refresh grid
      await loadBooks();
      setTimeout(() => { closeUploadModal(); form.reset(); }, 800);

    } catch (err) {
      errEl.textContent = err.message || 'Upload failed. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Publish to Shelf';
      setTimeout(() => progressEl?.classList.add('hidden'), 1000);
    }
  });

  // Auth state: show/hide upload button
  const showUploadIfSignedIn = () => {
    if (uploadBtn) uploadBtn.classList.toggle('hidden', !window.currentUser);
  };
  document.addEventListener('supabaseAuthChange', showUploadIfSignedIn);

  // Initial load (wait for Supabase to be ready)
  const tryLoad = () => {
    if (window.db) { loadBooks(); }
    else { setTimeout(tryLoad, 150); }
  };
  tryLoad();
}

// ── Init all ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyMoodColors();
  initLanguageSelector();
  initMobileSidebar();
  initMoodFilter();
  initWriteWithMe();
  initTitleGenerator();
  initMoodAutoTagger();
  initLikeButton();
  initBooksPage();
});