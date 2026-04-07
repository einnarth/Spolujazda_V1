'use client';
import { Ride } from '@/types';
import { supabase } from '@/lib/supabase';

interface DebtListProps {
    rides: Ride[];
    isAdmin: boolean;
    onRefresh: () => void;
}

export default function DebtList({ rides, isAdmin, onRefresh }: DebtListProps) {
    const groupedRides: Record<string, Ride[]> = {};

    rides.forEach(ride => {
        ride.passengerNames.forEach(name => {
            if (name) {
                if (!groupedRides[name]) groupedRides[name] = [];
                groupedRides[name].push(ride);
            }
        });
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Naozaj vymazať túto jazdu?")) return;
        const { error } = await supabase.from('rides').delete().eq('id', id);
        if (error) alert(error.message);
        else onRefresh(); // Refreshne dáta v page.tsx
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedRides).map(([name, passengerRides]) => {
                const total = passengerRides.reduce((sum, r) => sum + r.pricePerPerson, 0);

                return (
                    <div key={name} className="p-6 bg-[#1e1e1e] rounded-3xl border border-[#2a2a2a] shadow-xl">
                        <h2 className="text-xl font-black mb-4 text-white uppercase tracking-tight border-b border-white/10 pb-2">
                            {name}
                        </h2>

                        <div className="space-y-2 mb-4">
                            {passengerRides.map((ride) => (
                                <div key={ride.id} className="flex justify-between items-center text-sm text-gray-400 group">
                                    <span>{new Date(ride.date).toLocaleDateString('sk-SK')}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">{ride.pricePerPerson.toFixed(2)} €</span>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(ride.id)}
                                                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-dashed border-white/20">
                            <span className="text-[10px] uppercase font-bold text-gray-500">Spolu na zaplatenie</span>
                            <span className="text-2xl font-black text-emerald-400">
                                {total.toFixed(2)} €
                            </span>
                        </div>
                    </div>
                );
            })}

            {Object.keys(groupedRides).length === 0 && (
                <p className="text-gray-500 text-center py-10 italic">Zatiaľ žiadne záznamy.</p>
            )}
        </div>
    );
}