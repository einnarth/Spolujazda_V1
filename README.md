# Ride Tracker

Webová aplikácia na sledovanie jázd a správu nákladov na spolujazdu medzi priateľmi.

## Popis aplikácie
Aplikácia slúži na prehľadné zaznamenávanie spoločných ciest autom. Admin má k dispozícii rozhranie s kalendárom, cez ktoré priraďuje jazdy konkrétnym pasažierom. Systém automaticky prepočítava celkový dlh pre každú osobu a generuje detailnú históriu ciest s konkrétnymi dátumami. Prístup je podmienený prihlásením, pričom bežní používatelia vidia výhradne svoje vlastné záznamy a sumu na zaplatenie.

## Live Demo
Aplikácia je dostupná na: [https://spolujazda-v1.vercel.app/]

## Hlavné funkcie
* **Správa jázd:** Jednoduché priraďovanie jázd pasažierom cez kalendár.
* **Prehľad dlhov:** Automatický výpočet sumy na zaplatenie pre každého člena.
* **História ciest:** Detailný zoznam jázd s dátumami a cenou.
* **Admin nástroje:** Možnosť mazať záznamy a spravovať zoznam pasažierov.
* **Bezpečnosť:** Autentifikácia a ochrana dát cez Supabase Auth a RLS politiky.
