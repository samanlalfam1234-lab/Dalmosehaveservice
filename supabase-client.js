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

// Admin shortcut (F2) - Works globally on all pages importing this script
document.addEventListener('keydown', async function(e) {
    if (e.key === 'F2') {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session && window.isAdmin(session.user.email)) {
            window.location.href = 'admin.html';
        }
    }
});
