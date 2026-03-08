const supabaseUrl = 'https://cmaxbyfvohezirecfkbw.supabase.co';
const supabaseKey = 'sb_publishable_bPzzuOGmFitw5uxJBfWyFw_rSBsTjYe'; // Opdateret nøgle fra brugeren
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Global reference
window.supabaseClient = _supabase;

// Admin genvej (F2) - KUN for liamkurstein12@gmail.com og samanlalfam1234@gmail.com
document.addEventListener('keydown', async function(e) {
    if (e.key === 'F2') {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        const allowedEmails = ['liamkurstein12@gmail.com', 'samanlalfam1234@gmail.com'];
        
        if (session && allowedEmails.includes(session.user.email)) {
            window.location.href = 'admin.html';
        } else {
            console.log('Adgang nægtet: F2 er kun for admins.');
        }
    }
});
