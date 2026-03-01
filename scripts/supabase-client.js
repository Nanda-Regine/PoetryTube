/* ============================================================
   POETRYTUBE — supabase-client.js
   Supabase client init, auth state, auth modal
   Loaded on every page after the Supabase CDN script.
   ============================================================ */

// ── Client init ──────────────────────────────────────────────
const SUPABASE_URL      = 'https://wsxbdudidvsaijsnozzz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeGJkdWRpZHZzYWlqc25venp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNDg0NzEsImV4cCI6MjA4NzkyNDQ3MX0.1wIoh07nppoUg0reB1_4KEt-lygCG4EOeldaNKfTSMc';

const { createClient } = window.supabase;
window.db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth state ───────────────────────────────────────────────
// Leave window.currentUser undefined until onAuthStateChange fires.
// This lets other scripts distinguish "not yet resolved" from "signed out".

window.db.auth.onAuthStateChange((event, session) => {
  window.currentUser = session?.user ?? null;
  updateHeaderForUser(window.currentUser);

  // Notify other scripts (profile.js, books page)
  document.dispatchEvent(new CustomEvent('supabaseAuthChange', { detail: { user: window.currentUser } }));

  // Sync preferred language from profile on sign-in
  if (event === 'SIGNED_IN' && window.currentUser) {
    syncUserLanguage(window.currentUser.id);
  }
});

async function syncUserLanguage(uid) {
  const { data } = await window.db
    .from('profiles')
    .select('language')
    .eq('id', uid)
    .single();
  if (data?.language && window.setGlobalLanguage) {
    window.setGlobalLanguage(data.language, false); // false = don't re-save to db
  }
}

// ── Header avatar update ─────────────────────────────────────
function updateHeaderForUser(user) {
  const avatarEls = document.querySelectorAll('.avatar-btn');
  avatarEls.forEach(avatar => {
    if (user) {
      const initials = getInitials(user.user_metadata?.display_name || user.email);
      avatar.textContent = initials;
      avatar.title = user.user_metadata?.display_name || user.email;
      avatar.style.cursor = 'pointer';
      avatar.onclick = () => { window.location.href = 'profile.html'; };
    } else {
      avatar.textContent = '?';
      avatar.title = 'Sign in';
      avatar.style.cursor = 'pointer';
      avatar.onclick = () => openAuthModal('signin');
    }
  });
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Auth modal open/close ────────────────────────────────────
window.openAuthModal = function(mode = 'signin') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  switchAuthTab(mode);
  // Focus first input
  setTimeout(() => {
    const input = modal.querySelector(`#${mode}-form input`);
    input && input.focus();
  }, 120);
};

window.closeAuthModal = function() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  clearAuthErrors();
};

function switchAuthTab(mode) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === mode));
  document.querySelectorAll('.auth-form-panel').forEach(p => p.classList.toggle('active', p.id === `${mode}-form`));
}

function clearAuthErrors() {
  document.querySelectorAll('.auth-error').forEach(el => { el.textContent = ''; });
}

// ── Auth actions ─────────────────────────────────────────────
async function handleSignIn(e) {
  e.preventDefault();
  const form    = document.getElementById('signin-form');
  const email   = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;
  const errEl   = document.getElementById('signin-error');
  const btn     = form.querySelector('.auth-submit-btn');

  btn.disabled = true;
  btn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
  errEl.textContent = '';

  const { error } = await window.db.auth.signInWithPassword({ email, password });

  btn.disabled = false;
  btn.textContent = 'Sign In';

  if (error) {
    errEl.textContent = error.message;
  } else {
    window.closeAuthModal();
  }
}

async function handleSignUp(e) {
  e.preventDefault();
  const form        = document.getElementById('signup-form');
  const displayName = form.querySelector('input[name="displayName"]').value.trim();
  const email       = form.querySelector('input[type="email"]').value.trim();
  const password    = form.querySelector('input[type="password"]').value;
  const errEl       = document.getElementById('signup-error');
  const btn         = form.querySelector('.auth-submit-btn');

  btn.disabled = true;
  btn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span>';
  errEl.textContent = '';

  const { error } = await window.db.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  btn.disabled = false;
  btn.textContent = 'Create Account';

  if (error) {
    errEl.textContent = error.message;
  } else {
    errEl.style.color = 'var(--gold)';
    errEl.textContent = 'Account created! Check your email to confirm, then sign in.';
    setTimeout(() => switchAuthTab('signin'), 2500);
  }
}

window.signOut = async function() {
  await window.db.auth.signOut();
  window.currentUser = null;
  updateHeaderForUser(null);
};

// ── Wire auth modal on DOM ready ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  // Tab switching
  modal.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  // Form submissions
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  signinForm && signinForm.addEventListener('submit', handleSignIn);
  signupForm && signupForm.addEventListener('submit', handleSignUp);

  // Close on backdrop click or close button
  modal.querySelector('.auth-backdrop')?.addEventListener('click', window.closeAuthModal);
  modal.querySelector('.auth-close')?.addEventListener('click', window.closeAuthModal);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) window.closeAuthModal();
  });
});
