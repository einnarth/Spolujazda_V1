'use client';

import React, { useState } from 'react';

interface AddRideFormProps {
    onAddRide: (name: string, price: number) => void;
}

export default function AddRideForm({ onAddRide }: AddRideFormProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('2.50');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onAddRide(name, parseFloat(price));
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Passenger Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border rounded-xl text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="number"
                step="0.1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="p-3 border rounded-xl text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700">
                Add Ride
            </button>
        </form>
    );
}