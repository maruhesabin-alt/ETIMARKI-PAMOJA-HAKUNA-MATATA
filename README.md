# ETIMARKI PAMOJA HAKUNA MATATA — Site web institutionnel

Site complet et fonctionnel : pages publiques, administration sécurisée, base de données, stockage des médias, formulaire de contact, SEO, multilingue.
**« Un pour tous, tous pour un »**

> **Aucune dépendance à installer.** Le serveur utilise uniquement Node.js (version **22.13 ou plus récente**) et sa base SQLite intégrée.
> Il n'y a donc ni `npm install`, ni base de données à configurer, ni paquet externe à surveiller.

---

## 1. Démarrage en 3 minutes (ordinateur)

1. Installez Node.js **22 LTS ou plus** : <https://nodejs.org> (vérifiez avec `node -v`).
2. Ouvrez le dossier du projet dans **Visual Studio Code**, puis un terminal (`Terminal > Nouveau terminal`).
3. Lancez :
   ```bash
   npm start
   ```
4. Au **premier démarrage**, le terminal affiche l'e-mail et un **mot de passe administrateur aléatoire** (une seule fois). Notez-le.
5. Ouvrez **http://localhost:3000** (site) et **http://localhost:3000/admin** (administration).

> Pour choisir vous-même le mot de passe : copiez `.env.example` en `.env`, remplissez `ADMIN_PASSWORD` (10 caractères minimum, lettres + chiffres) **avant** le premier démarrage.
> L'extension *Live Server* ne convient plus : le site est dynamique (base de données, administration) et doit être lancé avec `npm start`.

Vérifier que tout fonctionne : `npm test` (53 contrôles automatiques : pages, sécurité, uploads, administration, formulaire, anti-spam).

---

## 2. Ce que contient le site

| Page | Contenu |
|---|---|
| Accueil | Hero avec vos vraies photos, devise, 3 boutons, à propos, domaines, projets, impact, carte, galerie, vidéos, actualités, partenaires, soutien, réseaux |
| À propos | Présentation, devise (Pamoja / Hakuna Matata), histoire / mission / vision / valeurs (affichées dès qu'elles sont renseignées) |
| Nos projets | Filtres dynamiques (Tous, Goma, Autres régions, Humanitaire, Formation, Jeunesse, Développement communautaire…) + **page détaillée par projet** (galerie, vidéos, fiche, partenaires, partage) |
| Nos actions | Carte interactive de la RDC (OpenStreetMap) : un repère par projet localisé + Goma (base) |
| Actualités | Articles avec catégories, images, vidéo YouTube, partage |
| Galerie | Grille, filtres par catégorie/projet, visionneuse plein écran (zoom, pincement, balayage, clavier), lien vers le projet |
| Vidéos | Vidéos (YouTube/MP4) + dernières vidéos de votre chaîne YouTube |
| Partenaires | Logos, présentation, lien, projets concernés |
| Nous soutenir | 7 façons de contribuer ; moyens de don **uniquement ceux que vous saisissez** |
| Contact | Téléphone/WhatsApp, e-mail, formulaire anti-spam, réseaux officiels |

Aussi : bouton WhatsApp flottant, menu hamburger mobile, animations au défilement (désactivées pour les personnes qui le demandent), `sitemap.xml`, `robots.txt`, Open Graph, données structurées (schema.org), favicon, manifest.

### Ressources issues de votre ZIP
- **9 projets** détectés d'après vos dossiers (01 à 09), **68 photos** (1 doublon ignoré), **logo officiel** (couleurs conservées — le vert, le rouge et l'or du site en sont tirés), **4 logos de partenaires** : BEMI en Afriko, Kuri Por Kongo, Max Chess Club from Africa, Orchestre Williams.
- Photos converties en WebP (version 1800 px + miniature 640 px) : 90 Mo → 18 Mo. Vos fichiers **originaux restent dans votre ZIP**, intacts.
- Médiathèque organisée dans `public/media/` : `logo/ projets/ partenaires/ actualites/ galerie/ videos/ documents/ autres/`.
- Aucune vidéo ni aucun document n’était présent dans le ZIP : l'espace vidéo est prêt (YouTube + MP4 en admin).

### Authenticité : rien n'est inventé
Seules les informations déduites de **vos noms de dossiers** et de **votre message** sont utilisées (ex. « plus de 50 familles » → statistique « 50+ »). Tout ce qui manque (dates, lieux précis, objectifs, résultats, bénéficiaires, histoire, mission, vision, valeurs, moyens de don, adresse) est **vide et modifiable en administration** — et **non affiché** tant qu'il est vide. Le tableau de bord liste ce qu'il reste à compléter.

---

## 3. Administration (`/admin`)

Tableau de bord, **projets** (ajout/modification/suppression, photos illimitées, couverture, ordre, vidéos YouTube/MP4, partenaires, position sur la carte, publier/dépublier), **actualités**, **galerie**, **partenaires**, **messages** reçus, **contenus du site** (association, coordonnées, réseaux sociaux, accueil/à propos, domaines, chiffres d'impact, soutien et moyens de don, carte, SEO), **catégories**, **comptes** (administrateurs/éditeurs, mot de passe).

- Les photos sont **redimensionnées dans le navigateur avant envoi** (rapide même en connexion lente).
- Rôles : *Administrateur* (tout, y compris les comptes) et *Éditeur* (contenus).
- Pour localiser un projet sur la carte : renseignez sa latitude/longitude (clic droit sur Google Maps ou OpenStreetMap → copier les coordonnées). Un lieu non confirmé = pas de coordonnées = pas de repère.

---

## 4. Sécurité (déjà en place)

Mots de passe hachés (scrypt) · sessions par cookie `HttpOnly` + `SameSite=Strict` (+ `Secure` en HTTPS) · jeton **CSRF** + contrôle de l'origine sur chaque modification · blocage des tentatives de connexion (429) · rôles · **uploads validés par signature réelle du fichier** (JPEG/PNG/WebP/MP4/WebM seulement, jamais SVG), taille limitée, noms aléatoires · protection contre la traversée de chemins · requêtes SQL préparées uniquement · base hors du dossier public (`storage/data`) · contenu des articles échappé (anti-XSS) · **CSP stricte** (aucun script en ligne), HSTS, `nosniff`, `frame-ancestors 'none'` · formulaire de contact : champ piège, délai minimum, jeton signé, limite par IP · **aucune clé secrète dans le navigateur**.

Bonnes pratiques : HTTPS obligatoire en production, mot de passe long, sauvegardes régulières (§6), ne jamais publier le fichier `.env`.

---

## 5. Déploiement (mise en ligne)

Le site a besoin d'un hébergement qui exécute **Node.js ≥ 22.13** avec un **disque persistant** (la base et les photos envoyées sont dans `storage/`). Un hébergement mutualisé « PHP/cPanel » sans Node ne convient pas.

**Option A — Serveur VPS (le plus simple à maîtriser)** : Ubuntu 22/24, Node 22, un nom de domaine.
```bash
sudo apt install -y nodejs   # (Node 22 via NodeSource, voir nodejs.org)
git clone … /var/www/etimarki   # ou copiez le dossier
cd /var/www/etimarki && cp .env.example .env && nano .env   # SITE_URL, ADMIN_PASSWORD, NODE_ENV=production, TRUST_PROXY=1
sudo cp deploy/etimarki.service /etc/systemd/system/ && sudo systemctl enable --now etimarki
sudo apt install -y caddy && sudo cp deploy/Caddyfile /etc/caddy/Caddyfile   # HTTPS automatique (Let's Encrypt)
```
(Modèle Nginx fourni aussi : `deploy/nginx.conf`.)

**Option B — Plateformes (Render, Railway, Fly.io…)** : un `Dockerfile` est fourni. Créez un service web depuis le dépôt, ajoutez un **volume/disque persistant monté sur `/app/storage`**, puis définissez les variables : `SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NODE_ENV=production`, `TRUST_PROXY=1`. Sans disque persistant, les photos ajoutées et la base seraient perdues à chaque redéploiement.

**Après la mise en ligne** : définissez `SITE_URL` (sinon les liens de partage et le sitemap restent relatifs), connectez-vous à `/admin`, changez le mot de passe, complétez les contenus, puis déclarez `https://votre-domaine/sitemap.xml` dans Google Search Console.

---

## 6. Sauvegarde et restauration

Tout ce qui change est dans **`storage/`** : `storage/data/etimarki.db` (base) et `storage/uploads/` (médias envoyés). Sauvegardez ce dossier (arrêtez le site ou copiez aussi les fichiers `-wal`/`-shm`). Restaurer = remettre le dossier en place. Vos contenus initiaux (`public/media`, `seed/`) sont versionnés avec le code.

---

## 7. Langues (architecture prête)

Français actif. Pour ajouter une langue : créer `src/i18n/<code>.js` (voir `en.js` : seules les clés à traduire sont nécessaires, le reste retombe sur le français), puis `LANGS=fr,en,sw` dans `.env`. Les pages deviennent accessibles sous `/en/…`, `/sw/…`, avec `hreflang` et sitemap multilingue. Les contenus saisis en admin se traduisent via la table `translations` (API `/api/admin/translations`) ; l'interface de saisie des traductions n'est pas encore dans l'administration.

---

## 8. Points à connaître

- **Carte** : Leaflet (v1.9.4, cdnjs) et les tuiles OpenStreetMap sont chargés **seulement quand la carte approche de l'écran** et nécessitent Internet. Sans connexion, la liste des lieux s'affiche à la place. Pour un fort trafic, utilisez un fournisseur de tuiles dédié (voir la politique d'usage d'OpenStreetMap) en changeant l'URL dans `public/js/map.js`.
- **Dernières vidéos YouTube** : le serveur lit le flux public de la chaîne (identifiant détecté automatiquement depuis le lien YouTube, ou `YOUTUBE_CHANNEL_ID`). Cette fonction **n'a pas pu être testée ici (pas d'accès Internet)** ; en cas d'échec, la section affiche simplement les vidéos ajoutées en admin et le bouton vers la chaîne.
- **Messages du formulaire** : enregistrés et lisibles dans l'administration ; pas d'envoi d'e-mail intégré (évite d'exposer des identifiants SMTP). Option : `CONTACT_WEBHOOK_URL` (Make, Zapier, n8n…) pour être notifié instantanément.
- **Vidéos MP4 envoyées** : limitées par `MAX_VIDEO_MB` (60 Mo par défaut), non transcodées — YouTube reste préférable pour les longues vidéos.
- **Pas de paiement en ligne intégré** : aucun moyen de paiement n'a été fourni, rien n'est inventé. Ajoutez vos numéros/comptes officiels dans *Contenus du site > Nous soutenir*.

## 9. Structure du projet

```
server.js            point d'entrée (HTTP, routes, sitemap, robots)
src/                 config, db (SQLite), sécurité, API admin, rendu des pages, i18n
public/              css, js, polices (Lora + Poppins, licence OFL), admin/, media/
seed/seed.json       contenu initial issu de votre ZIP (importé au 1er démarrage)
tools/               build_media.py (re-génère les images depuis le ZIP), smoke-test.js (npm test)
storage/             base de données + médias envoyés (à sauvegarder)
deploy/              systemd, Caddy, Nginx   ·   Dockerfile
```
