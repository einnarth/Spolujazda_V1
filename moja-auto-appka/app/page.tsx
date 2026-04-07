'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Ride } from "@/types";
import CalendarView from '../components/CalendarView';
import DebtList from '../components/DebtList';
import Auth from '../components/Auth';

interface Passenger {
  id: string;
  name: string;
  color: string;
  user_id: string;
  is_admin: boolean;
}

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [price, setPrice] = useState('2.50');
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchInitialData();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchInitialData();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchInitialData() {
    const { data: pData } = await supabase.from('passengers').select('*');
    if (pData) setPassengers(pData);
    fetchRides();
  }

  async function fetchRides() {
    const { data } = await supabase
        .from('rides')
        .select('*')
        .order('date', { ascending: false });

    if (data) {
      setRides(data.map(r => ({
        id: r.id,
        date: new Date(r.date),
        passengerNames: [r.passengerName],
        pricePerPerson: Number(r.price) || 0
      })));
    }
  }

  const handleAddRide = async () => {
    if (!selectedPassenger || !selectedDate) return alert("Vyber pasažiera!");

    const { error } = await supabase.from('rides').insert([
      {
        date: selectedDate.toISOString().split('T')[0],
        passengerName: selectedPassenger.name,
        price: parseFloat(price)
      }
    ]);

    if (error) {
      alert("Chyba: " + error.message);
    } else {
      fetchRides();
      setSelectedPassenger(null);
    }
  };

  if (loading) return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-white italic font-black uppercase tracking-widest">
        Načítavam...
      </div>
  );

  if (!session) return <Auth />;

  const currentUserPassenger = passengers.find(p => p.user_id === session.user.id);
  const isAdmin = currentUserPassenger?.is_admin === true;

  const displayRides = isAdmin
      ? rides
      : rides.filter(r => r.passengerNames.includes(currentUserPassenger?.name || ''));

  return (
      <main className="min-h-screen bg-brand-bg text-gray-400 p-4 md:p-8 font-sans italic">
        <div className="max-w-7xl mx-auto space-y-10">

          <header className="flex justify-between items-end border-b border-brand-border pb-8">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                Ride Tracker
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-green-500'}`}></div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">
                  {isAdmin ? 'Admin Mode' : `Pasažier: ${currentUserPassenger?.name || 'Hosť'}`}
                </span>
              </div>
            </div>
            <button
                onClick={() => supabase.auth.signOut()}
                className="text-[10px] text-gray-600 hover:text-white uppercase tracking-widest font-black transition-colors"
            >
              [ Odhlásiť ]
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {isAdmin && (
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-brand-card p-8 rounded-5xl border border-brand-border shadow-2xl">
                    <h2 className="text-[10px] font-bold text-blue-500 uppercase mb-5 tracking-[0.2em]">1. Vyber pasažiera</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {passengers.map(p => (
                          <button key={p.id} onClick={() => setSelectedPassenger(p)}
                                  style={{
                                    backgroundColor: selectedPassenger?.id === p.id ? 'white' : 'transparent',
                                    color: selectedPassenger?.id === p.id ? 'black' : 'white',
                                    borderColor: selectedPassenger?.id === p.id ? 'white' : 'var(--color-brand-border)'
                                  }}
                                  className="px-4 py-4 rounded-2xl text-[11px] font-black uppercase transition-all border-2"
                          >
                            {p.name}
                          </button>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-brand-border">
                      <h2 className="text-[10px] font-bold text-blue-500 uppercase mb-5 tracking-[0.2em]">2. Cena jazdy (€)</h2>
                      <input
                          type="number"
                          step="0.10"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full bg-brand-bg border-2 border-brand-border rounded-2xl p-5 text-white font-black text-2xl text-center focus:border-blue-600 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="bg-brand-card p-8 rounded-5xl border border-brand-border shadow-2xl">
                    <h2 className="text-[10px] font-bold text-blue-500 uppercase mb-6 tracking-[0.2em]">3. Zvoľ dátum</h2>
                    <div className="flex justify-center">
                      <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    </div>
                  </div>

                  <button
                      onClick={handleAddRide}
                      className="w-full bg-blue-600 hover:bg-blue-500 py-7 rounded-4xl text-white font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/30"
                  >
                    Pridať jazdu
                  </button>
                </div>
            )}

            <div className={isAdmin ? "lg:col-span-8" : "lg:col-span-12 max-w-3xl mx-auto w-full"}>
              <div className="bg-brand-card p-10 rounded-5xl border border-brand-border shadow-2xl min-h-150">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-10 text-white border-l-4 border-blue-600 pl-6">
                  {isAdmin ? "Prehľad všetkých dlhov" : "Moje jazdy a dlh"}
                </h2>

                <DebtList
                    rides={displayRides}
                    isAdmin={isAdmin}
                    onRefresh={fetchRides}
                />
              </div>
            </div>

          </div>
        </div>
      </main>
  );
}