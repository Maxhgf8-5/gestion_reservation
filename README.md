# GestBiblio — Système de gestion des réservations

Application fullstack de réservation de livres en bibliothèque.

**Stack** : Laravel 10 · React · PostgreSQL

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- PHP >= 8.2 et Composer
- Node.js >= 18 et npm
- PostgreSQL
- Git

---

## Mise en place de la base de données

Créer la base de données `gestion_bibliotheque` :

```bash
# Connexion à PostgreSQL
set PGPASSWORD=votre_mot_de_passe         # Windows
psql -h localhost -p 5432 -U postgres

# Dans le shell PostgreSQL
CREATE DATABASE "gestion_bibliotheque";
\l   -- vérifier la création
\q   -- quitter
```

---

## Installation du backend (Laravel)

```bash
cd backend/GestionBiblio

composer install
cp .env.example .env
php artisan key:generate
```

Modifier le fichier `.env` :

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gestion_bibliotheque
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
```

Lancer les migrations et le serveur :

```bash
php artisan migrate --seed
php artisan serve
```

> Le backend tourne sur **http://localhost:8000**

---

## Installation du frontend (React)

```bash
cd frontend/mon-projet
```

Installer les dépendances et démarrer :

```bash
npm install
npm start
```

> Le frontend tourne sur **http://localhost:3000**

---

## Connexion à l'interface

pour migrer l'administrateur

```bash
php artisan db:seed --class=AdminSeeder
```

pour migrer les roles et permissions

```bash
php artisan db:seed --class=RoleSeeder
```

**Les identidiants**
Email admin@yopmail.com  
 Mot de passe : Admin1admin2

> **Note** : Une connexion internet est requise pour l'envoi d'emails (confirmation de compte avec identifiants,utiliser les mail jetable si possible : [https://yopmail.com/fr/]).

## Stack technique

### Backend — Laravel

Framework PHP avec architecture MVC, routing intégré, ORM Eloquent, validation et authentification. Idéal pour les API REST sécurisées.

### Frontend — React

Librairie JavaScript pour des interfaces dynamiques avec composants réutilisables et mise à jour sans rechargement de page.

### Base de données — PostgreSQL

SGBD relationnel robuste, performant sur les requêtes complexes, entièrement supporté par Laravel.

---

## Gestion des race conditions

Un problème classique de concurrence : deux requêtes simultanées peuvent réserver le même livre si la vérification de disponibilité et l'insertion ne sont pas atomiques.

**Solution** : transaction avec verrou pessimiste via Laravel.

```php
DB::transaction(function () use ($livreId, $lecteurId) {
    $livre = Livre::lockForUpdate()->findOrFail($livreId);

    if ($livre->statut !== 'disponible') {
        throw new \Exception('Livre non disponible.');
    }

    $livre->statut = 'reservé';
    $livre->save();

    Reservation::create([
        'livre_id'   => $livreId,
        'lecteur_id' => $lecteurId,
        'date_debut' => now(),
    ]);
});
```

`DB::transaction()` garantit l'atomicité et `lockForUpdate()` bloque les lectures simultanées jusqu'à la fin de la transaction.

---

## Structure du projet

```
gestion_reservation/
├── backend/
│        # API REST Laravel
└── frontend/
         # Application React
```
