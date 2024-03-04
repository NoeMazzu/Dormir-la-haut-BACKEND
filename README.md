# DESIGN PATTERN MVC

## ROUTES

Endpoints que des clients vont pouvoir requêter
An endpoint in the context of a server typically refers to a specific URL or URI (Uniform Resource Identifier) that client applications can interact with to access resources or perform actions

## CONTROLLERS

Les controllers, vont comme leur nom l'indique, contrôler tout le processus d'exécution des taches (services) liées à une route. Renvoie les reponses (res).

## MIDDLEWARES

Un programme/fonction qui s'exécute entre la req et la res (avant que le controller n'appelle les services) et qui a pour but d'opérer toutes les vérifications nécessaires au bon fonctionnement (authentification de la req, validation du body,...)

## SERVICES

Tout ce qui concerne l'échange avec la base de données, le traitement de la donnée, bref les requêtes à la db.
