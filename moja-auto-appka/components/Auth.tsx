'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [color, setColor] = useState('#3b82f6'); // Predvolená modrá
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        if (!email || !password || (isSignUp && !name)) {
            alert("Prosím, vyplň všetky údaje.");
            return;
        }
        setLoading(true);

        if (!isSignUp) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) alert(error.message);
        } else {
            const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) {
                alert(signUpError.message);
            } else if (data?.user) {
                const { error: dbError } = await supabase.from('passengers').insert([{
                    name,
                    color,
                    user_id: data.user.id,
                    is_admin: false
                }]);
                if (dbError) alert("DB Error: " + dbError.message);
                else {
                    alert("Účet vytvorený!");
                    setIsSignUp(false);
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-white font-sans italic">
            <div className="bg-brand-card p-10 rounded-5xl border border-brand-border shadow-2xl w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">{isSignUp ? 'Registrácia' : 'Ride Tracker'}</h1>
                </div>

                <div className="space-y-4">
                    {isSignUp && (
                        <>
                            <input type="text" placeholder="Tvoje Meno" value={name} onChange={(e) => setName(e.target.value)}
                                   className="w-full bg-brand-bg p-4 rounded-2xl border border-brand-border outline-none focus:border-blue-600 transition-all text-white font-bold italic" />
                            <div className="flex items-center gap-4 p-2 bg-brand-bg rounded-2xl border border-brand-border">
                                <span className="text-[10px] uppercase font-bold ml-2 text-gray-500">Tvoja farba:</span>
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 bg-transparent cursor-pointer" />
                            </div>
                        </>
                    )}
                    <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
                           className="w-full bg-brand-bg p-4 rounded-2xl border border-brand-border outline-none focus:border-blue-600 transition-all text-white font-bold italic" />
                    <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)}
                           className="w-full bg-brand-bg p-4 rounded-2xl border border-brand-border outline-none focus:border-blue-600 transition-all text-white font-bold italic" />
                </div>

                <button onClick={handleAuth} disabled={loading} className="w-full bg-blue-600 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20">
                    {loading ? "Pracujem..." : (isSignUp ? "Zaregistrovať sa" : "Prihlásiť sa")}
                </button>
                <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-white">
                    {isSignUp ? "Mám účet? Prihlásiť sa" : "Nemám účet? Vytvoriť"}
                </button>
            </div>
        </div>
    );
}