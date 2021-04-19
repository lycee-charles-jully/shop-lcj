# Shop LCJ

## À propos

[Shop LCJ](https://shop-lcj.fr/) est un site web de commandes d'objets réalisés par le lycée. Il prévoit un shop avec un
système de compte, ainsi qu'un panneau d'administration pour facilement gérer les commandes et les objets disponibles.


## Organisation du projet

Le projet est conçu pour être déployé sur une machine virtuelle ou une machine dédiée (pas de cloud).

Chaque morceau est isolé dans son conteneur [Docker](https://www.docker.com/), pour une plus grande modularité et un
déploiement plus facile.

Pour déployer ce projet, clonez le repo et effectuez la commande `docker-compose up -d --build` dans le même répertoire.

### Frontend

Le frontend est géré par [Haproxy](http://www.haproxy.org/), qui fait office de reverse proxy. 
L'HTTPS est géré par [Let's Encrypt](https://letsencrypt.org/fr/), via [Certbot](https://certbot.eff.org/).

### Backend

Le backend se divise en deux parties : le shop et le panneau d'admin. Les deux utilisent le framework
[Svelte kit](https://kit.svelte.dev/).

### Base de données

La base de données utilisée est [MongoDB](https://www.mongodb.com/fr/).


## Design du site

La maquette du site est [disponible ici sur Figma](https://www.figma.com/file/K71mb6RBgB8vV582IlGf71/Shop-LCJ?node-id=29%3A0).


## Ressources hors repo

Le nom de domaine `lcj-shop.fr` à été enregistré via [Google Domains](https://domains.google.com/). Il doit être
renouvelé automatiquement aux alentours de début avril.

[Cloudflare](https://www.cloudflare.com/fr-fr/) est utilisé comme DNS, et également pour tous les autres services
qu'il propose (caching, anti DDOS).


## Contributeurs

Le code et le design sont intégralement réalisés par [Julien Wolff](https://cefadrom.com/), élève de terminale générale.
