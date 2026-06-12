// Supprimé l'import inutilisé de IContent
// import type { IContent } from '../types/content';

export const CONTENT = {
  header: {
    title: "SOLARIS HUMANITY",
    slogan: "UN SOLEIL POUR CHAQUE VIE",
    sloganEn: "A SUN FOR EVERY LIFE",
    foundation: "Association humanitaire Française fondée en 2025 par Mme Nelly NDOH NGUELET"
  },
  
  missions: [
    {
      id: "2.1",
      title: "Accès à l'eau",
      desc: "Construction de puits, forages et installation de pompes solaires en zones rurales.",
      details: ["Construction de puits et forages", "Installation de pompes solaires", "Sensibilisation à l'hygiène"]
    },
    {
      id: "2.2",
      title: "Soins Médicaux",
      icon: "HeartPulse",
      desc: "Soutien aux dispensaires locaux et dons de matériel médical.",
      details: ["Soutien aux dispensaires", "Campagnes de prévention", "Matériel médical"]
    },
    {
      id: "2.3",
      title: "Éducation",
      desc: "Dons de fournitures et création d'espaces d'apprentissage numérique.",
      details: ["Fournitures scolaires", "Soutien bibliothèques", "Formation numérique"]
    },
    {
      id: "2.4",
      title: "Solidarité",
      desc: "Soutien aux personnes vulnérables et dons de première nécessité.",
      details: ["Dons alimentaires", "Équipements maison", "Collecte de jouets"]
    }
  ],

  partners: {
    toungara: {
      name: "Fondation TOUNGARA",
      country: "Côte d'Ivoire",
      location: "Abidjan",
      description: "Partenaire stratégique pour le déploiement des solutions solaires et éducatives."
    },
    matondo: {
      name: "Fondation Rosalie MATONDO",
      country: "CONGO",
      location: "Brazzaville",
      description: "Active dans la réhabilitation de structures de santé.",
      date: "28 mai 2017",
      reg: "023/018/MID/DGAT:DLPC/SAP",
      address: "67 Rue Balloys, Ouenzé",
      achievements: ["Mbanza-Nganga", "Ntombo Manianga", "Kimpalala"]
    }
  },

  collecte: {
    mobile: ["Île-de-France", "Points relais partenaires", "Logistique sur RDV"],
    financiere: ["Hello Asso", "QR Code réseaux sociaux", "Cagnotte en ligne"],
    materielle: ["Matériel médical", "Mobilier", "Transport international"]
  }
};