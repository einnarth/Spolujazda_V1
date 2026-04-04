import { Ride } from '@/types';

export default function DebtList({ rides }: { rides: Ride[] }) {
    const balances: Record<string, number> = {};

    rides.forEach(ride => {
        ride.passengerNames.forEach(name => {
            if (name) {
                balances[name] = (balances[name] || 0) + ride.pricePerPerson;
            }
        });
    });

    return (
        <div className="p-6 bg-[#1e1e1e] rounded-3xl border border-[#2a2a2a] shadow-xl">
            <h2 className="text-xl font-black mb-6 text-white uppercase tracking-tight">
                Prehľad dlhov
            </h2>
            <div className="space-y-3">
                {Object.entries(balances).map(([name, amount]) => (
                    <div key={name} className="flex justify-between items-center p-4 bg-[#2a2a2a] rounded-2xl border border-white/5">
                        <span className="font-bold text-gray-200">{name}</span>
                        <span className="text-xl font-black text-emerald-400">
              {amount.toFixed(2)} €
            </span>
                    </div>
                ))}
                {Object.keys(balances).length === 0 && (
                    <p className="text-gray-500 text-center py-4 italic">Zatiaľ žiadne záznamy.</p>
                )}
            </div>
        </div>
    );
}