const SUPABASE_URL = 'https://bnewlzfxazyvcqdwlzzg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZXdsemZ4YXp5dmNxZHdsenpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDkxNTIsImV4cCI6MjA5NDA4NTE1Mn0.4FqiWgVVKmKu8sZnhpVXYCH-mzW2ZYait2WDBrXp218';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const Casino = {
    user: null,
    balance: 1000,
    xp: 0,

    async init() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) this.user = user;
        } catch(e) {}
        await this.refreshData();
        this.updateLeaderboard();
    },

    async refreshData() {
        if (!this.user) return;
        const { data } = await supabase.from('profiles').select('balance, xp').eq('id', this.user.id).single();
        if (data) {
            this.balance = data.balance || 1000;
            this.xp = data.xp || 0;
            this.updateUI();
        }
    },

    async processBet(amount, win, multiplier = 1.95) {
        if (amount <= 0 || amount > this.balance) throw new Error("Invalid bet amount");

        const payout = win ? Math.floor(amount * multiplier) : -amount;
        const newBalance = this.balance + payout;
        const newXP = this.xp + Math.floor(amount * 0.6);

        const { error } = await supabase.from('profiles')
            .update({ balance: newBalance, xp: newXP })
            .eq('id', this.user.id);

        if (error) throw error;

        this.balance = newBalance;
        this.xp = newXP;
        this.updateUI();
        this.updateLeaderboard();
        return { payout };
    },

    updateUI() {
        const bal = document.getElementById('user-balance');
        const xpEl = document.getElementById('user-xp');
        if (bal) bal.textContent = this.balance.toLocaleString();
        if (xpEl) xpEl.textContent = `XP: ${this.xp}`;
    },

    async updateLeaderboard() {
        const { data } = await supabase.from('profiles')
            .select('username, balance')
            .order('balance', { ascending: false })
            .limit(5);

        const container = document.getElementById('leaderboard-data');
        if (data && container) {
            container.innerHTML = data.map((p, i) => `
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #333;">
                    <span>#${i+1} ${p.username || 'Player'}</span>
                    <span style="color:#ffd700">$${p.balance.toLocaleString()}</span>
                </div>
            `).join('');
        }
    }
};