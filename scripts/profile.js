/* ============================================================
   POETRYTUBE — profile.js
   Creator Profile page logic
   Depends on: supabase-client.js (window.db, window.currentUser)
   ============================================================ */

const LANGUAGE_DISPLAY = {
  en: 'English', sw: 'Swahili', zu: 'isiZulu',
  yo: 'Yorùbá',  am: 'አማርኛ',   fr: 'Français',
};

// ── Determine whose profile to show ──────────
function getTargetUid() {
  const params = new URLSearchParams(window.location.search);
  return params.get('uid') || null;
}

// ── Show/hide helpers ─────────────────────────
function show(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hide(id) { document.getElementById(id)?.classList.add('hidden'); }
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val || ''; }

// ── Render profile data into the DOM ─────────
function renderProfile(profile, isOwn) {
  hide('profile-loading');
  hide('profile-signin-prompt');
  show('profile-content');

  // Avatar
  const avatarEl = document.getElementById('profile-avatar');
  if (avatarEl) {
    if (profile.avatar_url) {
      avatarEl.innerHTML = `<img src="${profile.avatar_url}" alt="${profile.display_name}" />`;
    } else {
      const initials = (profile.display_name || profile.username || '?')
        .split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
      avatarEl.textContent = initials;
    }
  }

  // Cover gradient based on username hash
  const cover = document.getElementById('profile-cover');
  if (cover) {
    const hue = (profile.username || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    cover.style.background = `linear-gradient(135deg, hsl(${hue},40%,18%) 0%, #0A0A1A 100%)`;
  }

  // Text fields
  setText('profile-display-name', profile.display_name || profile.username);
  setText('profile-handle', `@${profile.username || '—'}`);
  setText('profile-bio', profile.bio || '');
  setText('stat-videos',    profile.video_count   || 0);
  setText('stat-books',     profile.book_count    || 0);
  setText('stat-followers', profile.follower_count || 0);
  setText('stat-following', profile.following_count || 0);

  // Page title
  document.title = `${profile.display_name || profile.username} — PoetryTube`;

  // Badges
  const badgesEl = document.getElementById('profile-badges');
  if (badgesEl) {
    badgesEl.innerHTML = '';
    if (profile.language && profile.language !== 'en') {
      const badge = document.createElement('span');
      badge.className = 'profile-badge';
      badge.textContent = `🌍 ${LANGUAGE_DISPLAY[profile.language] || profile.language}`;
      badgesEl.appendChild(badge);
    }
    if (profile.location) {
      const locBadge = document.createElement('span');
      locBadge.className = 'profile-badge';
      locBadge.textContent = `📍 ${profile.location}`;
      badgesEl.appendChild(locBadge);
    }
  }

  // About tab
  setText('about-bio-text',     profile.bio || '—');
  setText('about-lang-text',    LANGUAGE_DISPLAY[profile.language] || 'English');
  setText('about-location-text', profile.location || '—');
  setText('about-joined-text',  `Joined ${new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`);

  const websiteLink = document.getElementById('about-website-link');
  if (websiteLink) {
    if (profile.website) {
      websiteLink.textContent = profile.website.replace(/^https?:\/\//, '');
      websiteLink.href = profile.website;
      show('about-website-row');
    } else {
      hide('about-website-row');
    }
  }

  // Action buttons
  if (isOwn) {
    show('edit-profile-btn');
    show('signout-profile-btn');
    show('avatar-upload-label');
    hide('follow-btn');
  } else {
    hide('edit-profile-btn');
    hide('signout-profile-btn');
    hide('avatar-upload-label');
    show('follow-btn');
    checkFollowState(profile.id);
  }

  // Pre-fill edit form
  if (isOwn) {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    setVal('edit-display-name', profile.display_name);
    setVal('edit-bio', profile.bio);
    setVal('edit-location', profile.location);
    setVal('edit-website', profile.website);
    const langSel = document.getElementById('edit-language');
    if (langSel) langSel.value = profile.language || 'en';
  }
}

// ── Load profile ──────────────────────────────
async function loadProfile(uid, isOwn) {
  const { data, error } = await window.db
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();

  if (error || !data) {
    hide('profile-loading');
    setText('profile-display-name', 'Profile not found');
    show('profile-content');
    return;
  }

  renderProfile(data, isOwn);
  loadVideos(uid);
  loadBooks(uid);
}

// ── Load user videos ──────────────────────────
async function loadVideos(uid) {
  const { data } = await window.db
    .from('videos')
    .select('id, title, thumbnail_url, moods, view_count, like_count, duration_seconds, created_at')
    .eq('user_id', uid)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const grid = document.getElementById('profile-videos-grid');
  const empty = document.getElementById('videos-empty');
  if (!grid) return;

  if (!data || data.length === 0) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.remove();

  data.forEach(video => {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="video-thumbnail">
        <div class="thumbnail-gradient thumb-1" style="height:100%">
          <span class="thumb-title">${escHtml(video.title)}</span>
        </div>
        ${video.duration_seconds ? `<span class="video-duration">${formatDuration(video.duration_seconds)}</span>` : ''}
        <div class="play-overlay"><div class="play-icon"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></div>
      </div>
      <div class="video-info">
        <h3 class="video-title">${escHtml(video.title)}</h3>
        <div class="video-meta">
          <span class="video-views">${formatCount(video.view_count)} views</span>
        </div>
        ${video.moods?.length ? `<div class="mood-pills">${video.moods.map(m => `<span class="mood-pill" data-mood="${m.toLowerCase()}">${m}</span>`).join('')}</div>` : ''}
      </div>`;
    grid.appendChild(card);
  });

  // Apply mood colors
  if (window.applyMoodColors) window.applyMoodColors();
}

// ── Load user books ───────────────────────────
async function loadBooks(uid) {
  const { data } = await window.db
    .from('books')
    .select('id, title, author_name, cover_url, language, genre, download_count')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });

  const grid = document.getElementById('profile-books-grid');
  const empty = document.getElementById('books-empty');
  if (!grid) return;

  if (!data || data.length === 0) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.remove();

  data.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card-sm';
    card.innerHTML = `
      <div class="book-cover-sm">
        ${book.cover_url ? `<img src="${book.cover_url}" alt="${escHtml(book.title)}" />` : '📖'}
        ${book.language && book.language !== 'en' ? `<span class="book-lang-badge-sm">${book.language.toUpperCase()}</span>` : ''}
      </div>
      <div class="book-info-sm">
        <div class="book-title-sm">${escHtml(book.title)}</div>
        <div class="book-author-sm">${escHtml(book.author_name || '')}</div>
      </div>`;
    grid.appendChild(card);
  });
}

// ── Follow / Unfollow ─────────────────────────
async function checkFollowState(targetUid) {
  if (!window.currentUser) return;
  const followBtn = document.getElementById('follow-btn');
  if (!followBtn) return;

  const { data } = await window.db
    .from('follows')
    .select('follower_id')
    .eq('follower_id', window.currentUser.id)
    .eq('following_id', targetUid)
    .maybeSingle();

  if (data) {
    followBtn.textContent = 'Following ✓';
    followBtn.classList.add('following');
  }

  followBtn.addEventListener('click', () => toggleFollow(targetUid));
}

async function toggleFollow(targetUid) {
  if (!window.currentUser) { window.openAuthModal('signin'); return; }
  const followBtn = document.getElementById('follow-btn');
  const isFollowing = followBtn?.classList.contains('following');
  const followerCountEl = document.getElementById('stat-followers');

  if (isFollowing) {
    await window.db.from('follows').delete()
      .eq('follower_id', window.currentUser.id)
      .eq('following_id', targetUid);
    followBtn.textContent = 'Follow';
    followBtn.classList.remove('following');
    if (followerCountEl) followerCountEl.textContent = Math.max(0, parseInt(followerCountEl.textContent) - 1);
  } else {
    await window.db.from('follows').insert({
      follower_id: window.currentUser.id,
      following_id: targetUid,
    });
    followBtn.textContent = 'Following ✓';
    followBtn.classList.add('following');
    if (followerCountEl) followerCountEl.textContent = parseInt(followerCountEl.textContent) + 1;
  }
}

// ── Edit profile ──────────────────────────────
function initEditModal() {
  const editBtn   = document.getElementById('edit-profile-btn');
  const modal     = document.getElementById('edit-modal');
  const closeBtn  = document.getElementById('edit-modal-close');
  const form      = document.getElementById('edit-profile-form');

  editBtn?.addEventListener('click', () => {
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeModal = () => {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  modal?.querySelector('.edit-modal-backdrop')?.addEventListener('click', closeModal);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!window.currentUser) return;
    const saveBtn = document.getElementById('edit-save-btn');
    const errEl   = document.getElementById('edit-error');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
    errEl.textContent = '';

    const updates = {
      display_name: document.getElementById('edit-display-name').value.trim(),
      bio:          document.getElementById('edit-bio').value.trim(),
      location:     document.getElementById('edit-location').value.trim(),
      website:      document.getElementById('edit-website').value.trim(),
      language:     document.getElementById('edit-language').value,
    };

    const { error } = await window.db
      .from('profiles')
      .update(updates)
      .eq('id', window.currentUser.id);

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Changes';

    if (error) {
      errEl.textContent = error.message;
    } else {
      // Refresh displayed data
      setText('profile-display-name', updates.display_name);
      setText('profile-bio', updates.bio);
      setText('about-bio-text', updates.bio || '—');
      setText('about-lang-text', LANGUAGE_DISPLAY[updates.language] || 'English');
      setText('about-location-text', updates.location || '—');
      if (updates.language) window.setGlobalLanguage && window.setGlobalLanguage(updates.language, false);
      closeModal();
    }
  });
}

// ── Avatar upload ─────────────────────────────
function initAvatarUpload() {
  const input = document.getElementById('avatar-file-input');
  if (!input) return;

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file || !window.currentUser) return;
    const ext  = file.name.split('.').pop();
    const path = `${window.currentUser.id}/avatar.${ext}`;

    const { error: upErr } = await window.db.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (upErr) { console.error('Avatar upload error:', upErr); return; }

    const { data } = window.db.storage.from('avatars').getPublicUrl(path);
    const publicUrl = data?.publicUrl;

    await window.db.from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', window.currentUser.id);

    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) avatarEl.innerHTML = `<img src="${publicUrl}?t=${Date.now()}" alt="Avatar" />`;
  });
}

// ── Tab switching ─────────────────────────────
function initProfileTabs() {
  const tabs   = document.querySelectorAll('.profile-tab');
  const panels = document.querySelectorAll('.profile-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => { p.classList.add('hidden'); p.classList.remove('active'); });
      tab.classList.add('active');
      const panel = document.getElementById(`tab-${tab.dataset.tab}`);
      panel?.classList.remove('hidden');
      panel?.classList.add('active');
    });
  });
}

// ── Utility helpers ───────────────────────────
function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDuration(secs) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}
function formatCount(n) {
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return n || 0;
}

// ── Entry point ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initProfileTabs();
  initEditModal();
  initAvatarUpload();

  const targetUid = getTargetUid();

  // Wait for auth to resolve (supabase-client.js fires onAuthStateChange)
  // Wait for supabase-client.js to resolve auth state, then load
  document.addEventListener('supabaseAuthChange', () => {
    const isOwn = !targetUid || targetUid === window.currentUser?.id;
    const uid   = targetUid || window.currentUser?.id;

    if (!uid) {
      hide('profile-loading');
      show('profile-signin-prompt');
      return;
    }

    loadProfile(uid, isOwn);
  }, { once: true });
});
