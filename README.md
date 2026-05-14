<<<<<<< HEAD
# gestion_reservation
une app web de reservation de livres (laravel+react)
=======
**System de gestion des reservations**
*Application fullstack - Backend laravel / Frontend React /PostgreSql*

**_Structure du projet__*

gestion_reservation--->back(api rest laravel 10)+front (react)

**_Outils technique_*

**avoir installer :**

php au moins 8.2 et le composer
node.js au moins 18 et le npm
postgreSql
git

**_Base de donnee_**
 creer une base de donnee (gestion_bibliotheque)
 1-dans le terminal (windows) taper les commande
 -`set  PGPASSWORD=votre mot_de_passe`
-`psql -h localhost -p le_port(5432 par defaut) -U postgres(le username par defaut)`
-`create database "gestion_bibliotheque"`
-`\l` pour voir la DB creer

**_Installer laravel_**
faire `cd backend` puis `cd GestionBiblio` et taper
`composer install`
`cp .env.example .env`
`php artisan key:generate`
-modifier le fichier .env
**DB_CONNECTION=pgsql**
**DB_HOST=127.0.0.1**
**DB_PORT=5432(par defaut)**
**DB_USERNAME=postgres(par defaut)**
**DB_PASSWORD=votre_mot_de_psse**

-Lancer les migration
`php artisan migrate --seed`
`php artisan serve`

normalement il tourne sur le ***localhost:8000***


*******Installer le front******



dans le terminal `cd frontent`, `cd mon-projet`
creer un fichier .env a la racine du dossier mon-projet s'il existe pas , coller ce code
**REACT_APP_API_URL=http://localhost:8000**
puis un autre fichier api.js dans src s'il n'existe pas et coller :
**import axios from "axios";**
**const api = axios.create({**
  **baseURL: process.env.REACT_APP_API_URL + "/api",** // 
**});**

**export default api;**
***NB***: vous devez installer le dom-router et axios
taper npm start puis lancer le server
il va normalement tourner sur du localhost:3000

*****Stack technique***
il s'agit d'une app web de gestion de reservation de livre
-techonologie utilisé:
**Backend**:laravel
c'est un frame php rapide a developper ,car il fournit un routing, des orm ,des validation, il a une arhitecture tres simple MVC, avec une manipulation simple avec la BD sans ecrire des requete sql brute, tres securisé , il est pratique pour des cas d'API rest : Notre cas

**Front**: React 
une librairie js avec une interface dynamique , sans recharger la page il arrive a mettre a jours ces composents qui sont d'ailleur reuitiisable . une experience utilisateur tres fluide

**Base de D**: PostgreSql
robuste fiable pour des donnée relationnelle comme notre cas ,tres performant en requete complexe, gratuit et est supporter par laravel

 


 Exercice 

 Le probleme avec ce code est juste le meme livre va etre reservé 2 fois , puisque le programme verifie bien si le livre choisi est disponible ou pas , mais l'action de verification et d'ajout sont pas proteger ce qui fait que si 2 requete vienne au meme moment , elle vont s'executer toute 2 au meme moment . pour eviter ca en laravel on peut une utiliser la function transaction fournit par DB
>>>>>>> 1a28d50 (init:gestion de reservation de livres)
