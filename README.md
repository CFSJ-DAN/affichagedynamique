# Digital Signage Player

Player d'affichage dynamique pour Windows avec gestion du contenu hors ligne.

## Installation

1. Téléchargez la dernière version du player depuis la [page des releases](https://github.com/CFSJ-DAN/affichagedynamique/releases)
2. Exécutez le fichier d'installation
3. Le player sera installé dans `C:\APPS\affichagedynamique`

## Configuration

1. Lancez le player
2. Entrez le code d'appairage fourni dans l'interface d'administration
3. Le player se synchronisera automatiquement avec le serveur

## Fonctionnalités

- Lecture hors ligne du contenu
- Synchronisation automatique des médias
- Gestion locale des planifications
- Support des transitions entre médias
- Mode plein écran automatique
- Redémarrage automatique en cas d'erreur

## Structure des dossiers

<<<<<<< HEAD
```
C:\APPS\affichagedynamique\
├── content\     # Médias (images, vidéos)
└── db\         # Base de données locale
```

## Développement

```bash
=======
\`\`\`
C:\APPS\affichagedynamique\
├── content\     # Médias (images, vidéos)
└── db\         # Base de données locale
\`\`\`

## Développement

\`\`\`bash
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Compilation
npm run build

# Création du package d'installation
npm run build:electron
<<<<<<< HEAD
```
=======
\`\`\`
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
