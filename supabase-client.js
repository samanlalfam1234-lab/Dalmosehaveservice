const supabaseUrl = 'https://cmaxbyfvohezirecfkbw.supabase.co';
const supabaseKey = 'sb_publishable_bPzzuOGmFitw5uxJBfWyFw_rSBsTjYe'; // Opdateret nøgle fra brugeren
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Global reference
window.supabaseClient = _supabase;

// Global configuration
window.allowedAdmins = [
    'liamkurstein12@gmail.com',
    'liamkurstien12@gmail.com',
    'samanlalfam1234@gmail.com',
    'samanlalfam1234@gamil.com',
    'liamkurstien12@gamil.com',
    'liamkurstein12@gamil.com'
];

// Helper to check admin status
window.isAdmin = function(email) {
    if (!email) return false;
    // Normalize: trim spaces/dots and lowercase, also handle common typo
    const normalized = email.trim().toLowerCase().replace(/\.$/, '').replace('@gamil.com', '@gmail.com');
    const adminEmails = window.allowedAdmins.map(e => e.trim().toLowerCase());
    return adminEmails.includes(normalized) || adminEmails.includes(email.trim().toLowerCase());
};

// Global Mobile Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Handle Login/Logout visibility globally
    const loginWrapper = document.getElementById('loginWrapper');
    const logoutWrapper = document.getElementById('logoutWrapper');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (loginWrapper && logoutWrapper) {
        if (isLoggedIn) {
            loginWrapper.style.display = 'none';
            logoutWrapper.style.display = 'block';
        } else {
            loginWrapper.style.display = 'block';
            logoutWrapper.style.display = 'none';
        }
    }
});

// Admin shortcut (F2) - Works globally on all pages importing this script
document.addEventListener('keydown', async function(e) {
    if (e.key === 'F2') {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session && window.isAdmin(session.user.email)) {
            window.location.href = 'admin.html';
        }
    }
});

// Global clean notification function
window.showNotification = function(message, isError = false) {
    // Remove existing if any
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${isError ? 'error' : ''}`;
    toast.innerHTML = `
        <span class="toast-icon">${isError ? '⚠️' : '✅'}</span>
        <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('active'), 10);

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};
