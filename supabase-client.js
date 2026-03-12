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
    const updateAuthUI = async () => {
        const loginWrappers = document.querySelectorAll('#loginWrapper');
        const logoutWrappers = document.querySelectorAll('#logoutWrapper');
        
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        
        loginWrappers.forEach(el => {
            el.style.display = session ? 'none' : 'block';
        });
        
        logoutWrappers.forEach(el => {
            el.style.display = session ? 'block' : 'none';
        });
    };

    updateAuthUI();

    // Listen for auth changes
    window.supabaseClient.auth.onAuthStateChange(() => {
        updateAuthUI();
    });

    // Global Logout Handler
    document.addEventListener('click', async (e) => {
        const logoutBtn = e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn');
        if (logoutBtn) {
            e.preventDefault();
            
            // Create custom confirm modal if it doesn't exist
            let confirmModal = document.getElementById('logoutConfirmModal');
            if (!confirmModal) {
                confirmModal = document.createElement('div');
                confirmModal.id = 'logoutConfirmModal';
                confirmModal.className = 'modal-overlay';
                confirmModal.innerHTML = `
                    <div class="modal-content">
                        <h2>Log ud?</h2>
                        <p>Er du sikker på, at du vil logge ud af din konto?</p>
                        <div class="modal-btns" style="flex-direction: row; gap: 15px;">
                            <button id="confirmLogoutBtn" class="btn btn-primary" style="flex: 1;">JA, LOG UD</button>
                            <button id="cancelLogoutBtn" class="btn btn-outline" style="flex: 1; border-color: #ddd !important; color: #666 !important;">FORTRYD</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(confirmModal);
                
                // Add events
                document.getElementById('cancelLogoutBtn').addEventListener('click', () => {
                    confirmModal.style.display = 'none';
                });
                
                document.getElementById('confirmLogoutBtn').addEventListener('click', async () => {
                    await window.supabaseClient.auth.signOut();
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    window.location.href = 'index.html';
                });
            }
            
            confirmModal.style.display = 'flex';
        }
    });

    // Scroll Reveal Logic
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 100;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Run once on load
});

// Admin shortcut (F2) - Works globally on all pages importing this script
document.addEventListener('keydown', async function(e) {
    if (e.key === 'F2') {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session) {
            if (window.isAdmin(session.user.email)) {
                window.location.href = 'admin.html';
            } else {
                if (window.showNotification) {
                    window.showNotification("Adgang nægtet: Du er ikke admin", true);
                }
            }
        } else {
            if (window.showNotification) {
                window.showNotification("Log ind som admin først", true);
            }
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
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
