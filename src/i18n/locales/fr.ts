import type { Dict } from './en';
import { BRAND } from '../../brand';

const fr: Dict = {
  dir: 'ltr' as 'ltr' | 'rtl',
  meta: {
    siteName: BRAND.name,
    landingTitle: `${BRAND.name} — Créez un CV 100% gratuit`,
    landingDescription: `${BRAND.name} est un créateur de CV en ligne gratuit. Renseignez vos informations, choisissez un modèle et téléchargez votre CV professionnel en PDF — sans inscription. Vos données ne quittent jamais votre navigateur.`,
    builderTitle: `Créer un CV — ${BRAND.name}`,
    builderDescription: `Créez votre CV avec le créateur gratuit de ${BRAND.name}. Plusieurs modèles, aperçu en direct, téléchargement PDF instantané. Sans compte, sans frais.`,
    aboutTitle: `À propos — ${BRAND.name}`,
    aboutDescription: `Ce qu'est ${BRAND.name} et pourquoi un CV propre et bien structuré vous apporte plus d'entretiens.`,
    privacyTitle: `Politique de confidentialité — ${BRAND.name}`,
    privacyDescription: `Politique de confidentialité de ${BRAND.name} : les données de votre CV restent dans votre navigateur. Rien n'est téléversé.`,
  },
  nav: {
    home: 'Accueil',
    builder: 'Créer un CV',
    about: 'À propos',
    theme: 'Thème',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    themeSystem: 'Système',
    language: 'Langue',
    createNow: 'Créer maintenant',
  },
  hero: {
    badge: '100% gratuit · Sans inscription · Privé par conception',
    titleA: 'Créez un',
    titleHighlight: 'CV 100% gratuit',
    titleB: 'en minutes',
    subtitle:
      'Créez un CV professionnel en quelques minutes. Renseignez vos informations, choisissez un modèle et téléchargez votre CV en PDF — entièrement gratuit, sans compte.',
    ctaPrimary: 'Créer maintenant — c’est gratuit',
    ctaSecondary: 'Comment ça marche',
  },
  steps: {
    title: 'Créez votre CV en 3 étapes simples',
    subtitle: 'Aucune compétence en design requise — suivez simplement le flux.',
    items: [
      {
        title: 'Cliquez sur Créer maintenant',
        text: 'Commencez un nouveau CV en un clic. Choisissez l’un de nos modèles propres et professionnels pour débuter.',
      },
      {
        title: 'Renseignez vos informations',
        text: 'Ajoutez vos coordonnées, votre expérience professionnelle, votre formation et vos compétences. Tout est enregistré automatiquement dans votre navigateur.',
      },
      {
        title: 'Téléchargez votre PDF',
        text: 'Prévisualisez votre CV en direct, ajustez-le et téléchargez un PDF prêt à imprimer — gratuit pour toujours.',
      },
    ],
  },
  why: {
    title: 'Pourquoi nous choisir',
    subtitle: 'Tout ce qu’il faut pour un CV qui décroche des entretiens.',
    items: [
      {
        icon: 'ph:gift',
        title: '100% gratuit',
        text: 'Toutes les fonctionnalités sont gratuites, pour toujours. Aucun forfait premium, aucun modèle verrouillé, aucun filigrane sur votre PDF.',
      },
      {
        icon: 'ph:cursor-click',
        title: 'Facile à utiliser',
        text: 'Un simple formulaire guidé fait le travail. Si vous savez taper, vous pouvez créer un excellent CV ici.',
      },
      {
        icon: 'ph:sliders-horizontal',
        title: 'Personnalisation simple',
        text: 'Changez de modèle, modifiez les couleurs d’accent et les polices, et activez ou désactivez des sections en un clic.',
      },
      {
        icon: 'ph:lightning',
        title: 'Rapide et fiable',
        text: 'Votre CV est enregistré automatiquement pendant que vous tapez. Fermez l’onglet et revenez — votre brouillon est toujours là.',
      },
      {
        icon: 'ph:download-simple',
        title: 'Téléchargement instantané',
        text: 'Exportez un PDF propre et prêt à imprimer dès que vous avez terminé. Sans attente, sans vérification d’e-mail.',
      },
      {
        icon: 'ph:lock-key',
        title: 'Sécurisé et privé',
        text: 'Vos données restent dans le stockage local de votre navigateur. Rien n’est téléversé, aucun compte n’est requis.',
      },
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    subtitle: 'Réponses rapides aux questions courantes.',
    items: [
      {
        q: 'Ai-je besoin de compétences en design pour utiliser le créateur de CV ?',
        a: 'Non. Le créateur utilise des modèles propres et de design professionnel, donc la mise en forme est faite pour vous. Renseignez simplement vos informations et le créateur s’occupe de la mise en page, de l’espacement et de la typographie.',
      },
      {
        q: 'Puis-je ajouter une photo de profil à mon CV ?',
        a: 'Oui. Vous pouvez téléverser une photo dans la section des informations personnelles et l’activer ou la désactiver pour n’importe quel modèle. La photo est facultative — de nombreux recruteurs préfèrent les CV sans photo.',
      },
      {
        q: 'Dois-je m’inscrire pour créer ou télécharger mon CV ?',
        a: 'Aucune inscription n’est requise. Vous pouvez créer votre CV et télécharger le PDF entièrement gratuitement, sans créer de compte ni partager votre e-mail.',
      },
      {
        q: 'Est-ce vraiment gratuit ?',
        a: 'Oui — toutes les fonctionnalités sont gratuites, y compris tous les modèles et les téléchargements PDF. Aucun forfait premium ni frais cachés.',
      },
      {
        q: 'Puis-je modifier mon CV après l’avoir téléchargé ?',
        a: 'Absolument. Votre brouillon est enregistré automatiquement dans votre navigateur, vous pouvez donc rouvrir le créateur à tout moment, apporter des modifications et télécharger un PDF mis à jour.',
      },
      {
        q: 'Puis-je ajouter mes propres sections personnalisées ?',
        a: 'Oui. Vous pouvez ajouter des sections personnalisées avec du texte simple ou des puces — utiles pour les certifications, les projets, le bénévolat ou tout ce que vous voulez que les recruteurs voient.',
      },
    ],
  },
  ctaBand: {
    title: 'Prêt à créer votre CV ?',
    text: 'Rejoignez des milliers de chercheurs d’emploi qui créent des CV professionnels en quelques minutes — gratuit, privé, sans inscription.',
    button: 'Créer mon CV',
  },
  footer: {
    tagline: `${BRAND.name} est un créateur de CV en ligne gratuit. Sans inscription — vos données restent dans votre navigateur.`,
    usefulTitle: 'Liens utiles',
    importantTitle: 'Important',
    followTitle: 'Suivez-nous',
    rights: 'Tous droits réservés.',
  },
  about: {
    title: `À propos de ${BRAND.name}`,
    p1: `${BRAND.name} est un créateur de CV en ligne gratuit conçu pour une seule mission : vous aider à créer un CV professionnel rapidement, sans compétences en design et sans payer.`,
    p2: 'Les recruteurs ne consacrent généralement que quelques secondes à parcourir un CV, la structure et la lisibilité comptent donc plus que la décoration. Chaque modèle est construit autour de cette idée — titres clairs, sections nettes et une mise en page qui fonctionne aussi bien pour les lecteurs humains que pour les systèmes de suivi des candidatures.',
    p3: 'Pas d’inscription et rien n’est téléversé. Les données de votre CV vivent dans votre propre navigateur, donc ce que vous écrivez reste à vous.',
  },
  privacy: {
    title: 'Politique de confidentialité',
    intro: 'Cette politique explique ce qu’il advient de vos données lorsque vous utilisez ce site. En bref : presque rien — tout reste sur votre appareil.',
    items: [
      {
        h: 'Les données de votre CV restent dans votre navigateur',
        p: 'Les informations que vous saisissez dans le créateur — votre nom, vos coordonnées, votre expérience et votre formation — sont stockées uniquement dans le stockage local de votre navigateur, sur votre propre appareil. Nous ne transmettons pas ces données à un serveur.',
      },
      {
        h: 'Rien n’est téléversé',
        p: 'Les fichiers que vous joignez, comme une photo de profil, sont traités localement dans votre navigateur et ne sont jamais téléversés. Il n’existe ni compte backend ni base de données conservant vos informations.',
      },
      {
        h: 'Pas de compte, pas de suivi',
        p: 'Vous n’avez pas besoin de compte pour utiliser le créateur, nous ne collectons donc ni noms, ni e-mails, ni mots de passe. Nous n’utilisons ni publicité ni outils d’analyse tiers qui vous profilent.',
      },
      {
        h: 'Contact',
        p: 'Si vous avez des questions sur cette politique ou sur vos données, vous pouvez nous joindre via les coordonnées sur la page À propos.',
      },
    ],
  },
  notFound: {
    title: 'Page introuvable',
    text: 'La page que vous cherchez n’existe pas ou a été déplacée.',
    button: 'Retour à l’accueil',
  },
  builder: {
    title: 'Créez votre CV',
    metaDesc: 'Créateur de CV gratuit avec aperçu en direct. Renseignez vos informations, choisissez un modèle, téléchargez le PDF — sans inscription.',
    templateTitle: 'Choisissez un modèle',
    templateSubtitle: 'Choisissez un design — vous pouvez le changer à tout moment.',
    templates: {
      minimal: { name: 'Minimal', desc: 'Épuré et simple, lisibilité maximale.' },
      professional: { name: 'Professionnel', desc: 'Mise en page classique pour les postes en entreprise.' },
      modern: { name: 'Moderne', desc: 'Design frais avec un en-tête audacieux.' },
      classic: { name: 'Classique', desc: 'Style serif intemporel pour les secteurs formels.' },
    },
    customizeTitle: 'Personnaliser',
    accentLabel: 'Couleur d’accent',
    fontLabel: 'Police',
    fontOptions: { poppins: 'Poppins', inter: 'Inter', serif: 'Serif' },
    showPhotoLabel: 'Afficher la photo',
    sections: {
      personal: 'Informations personnelles',
      summary: 'Résumé professionnel',
      experience: 'Expérience professionnelle',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues',
      custom: 'Sections personnalisées',
    },
    personal: {
      fullName: 'Nom complet',
      jobTitle: 'Poste',
      email: 'E-mail',
      phone: 'Téléphone',
      location: 'Localisation',
      photo: 'Photo',
      photoUpload: 'Téléverser une photo',
      photoChange: 'Changer de photo',
      photoRemove: 'Supprimer',
    },
    summary: {
      label: 'Résumé',
      placeholder: 'Un court paragraphe sur votre expérience, vos atouts et vos objectifs de carrière…',
    },
    experience: {
      add: 'Ajouter une expérience',
      jobTitle: 'Poste',
      company: 'Entreprise',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      present: 'Actuellement',
      description: 'Description',
      descriptionHint: 'Un accomplissement par ligne',
      remove: 'Supprimer',
      moveUp: 'Déplacer vers le haut',
      moveDown: 'Déplacer vers le bas',
    },
    education: {
      add: 'Ajouter une formation',
      degree: 'Diplôme / Qualification',
      school: 'École / Université',
      year: 'Année',
      remove: 'Supprimer',
      moveUp: 'Déplacer vers le haut',
      moveDown: 'Déplacer vers le bas',
    },
    skills: {
      label: 'Compétences',
      hint: 'Séparez les compétences par des virgules',
      placeholder: 'ex. : Communication, JavaScript, Gestion de projet',
    },
    languages: {
      label: 'Langues',
      hint: 'Séparez les langues par des virgules',
      placeholder: 'ex. : Anglais, Hindi, Espagnol',
    },
    custom: {
      addSection: 'Ajouter une section personnalisée',
      sectionTitle: 'Titre de la section',
      typeLabel: 'Type',
      typeText: 'Texte',
      typeBullets: 'Puces',
      contentLabel: 'Contenu',
      remove: 'Supprimer la section',
    },
    actions: {
      downloadPdf: 'Télécharger le PDF',
      fillSample: 'Remplir avec des données d’exemple',
      clear: 'Tout effacer',
      saved: 'Enregistré',
      confirmClear: 'Voulez-vous vraiment effacer toutes les données ?',
    },
    tabs: {
      edit: 'Modifier',
      preview: 'Aperçu',
    },
    previewTitle: 'Aperçu en direct',
  },
};

export default fr;
