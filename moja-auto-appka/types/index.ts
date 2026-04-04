export interface Ride {
    id: string;
    date: Date;
    passengerNames: string[];
    pricePerPerson: number;
}

export interface UserDebt{
    name: string;
    totalAmount: number;
}