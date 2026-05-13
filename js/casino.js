/**
 * Casino Engine - Centralized Logic for Balance and Leaderboard
 * Handles Supabase communication and UI synchronization.
 */
const SUPABASE_URL = 'https://bnewlzfxazyvcqdwlzzg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZXdsemZ4YXp5dmNxZHdsenpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDkxNTIsImV4cCI6MjA5NDA4NTE1Mn0.4FqiWgVVKmKu8sZnhpVXYCH-mzW2ZYait2WDBrXp218';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const Casino = {
    user: null,
    balance: 0,

    async init() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            this.user = user;
            await this.refreshData();
        }
        this.updateLeaderboard();
    },

    /**
     * Refreshes local balance from Supabase
     */
    async refreshData() {
        if (!this.user) return;
        const { data, error } = await supabase
            .from('profiles')
            .select('balance, xp')
            .eq('id', this.user.id)
            .single();

        if (data) {
            this.balance = data.balance;
            this.updateUI();
        }
    },

    /**
     * The primary function for games to call. 
     * Handles the win/loss logic and updates the DB.
     */
    async processBet(amount, win, multiplier = 2) {
        if (amount > this.balance) throw new Error("Insufficient Funds");

        const payout = win ? Math.floor(amount * multiplier) : -amount;
        const newBalance = this.balance + payout;

        // Update Database
        const { error } = await supabase
            .from('profiles')
            .update({ 
                balance: newBalance,
                xp: this.balance + Math.abs(payout) // Gain XP on every bet
            })
            .eq('id', this.user.id);

        if (!error) {
            this.balance = newBalance;
            this.updateUI();
            this.updateLeaderboard();
            return { success: true, newBalance, payout };
        }
        throw error;
    },

    updateUI() {
        const el = document.getElementById('global-balance');
        if (el) {
            // Animate number counting for a "smooth" feel
            this.animateValue(el, parseInt(el.innerText) || 0, this.balance, 500);
        }
    },

    animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    async updateLeaderboard() {
        const { data, error } = await supabase
            .from('profiles')
            .select('username, balance, xp')
            .order('balance', { ascending: false })
            .limit(5);

        const list = document.getElementById('leaderboard-list');
        if (list && data) {
            list.innerHTML = data.map((player, i) => `
                <div class="leader-item">
                    <span>#${i+1} ${player.username || 'Anon'}</span>
                    <span class="gold">$${player.balance.toLocaleString()}</span>
                </div>
            `).join('');
        }
    }
};

// Initialize on load
Casino.init();
