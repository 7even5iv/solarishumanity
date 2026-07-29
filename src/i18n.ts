import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      fr: {
        translation: {
          nav: {
            home: "ACCUEIL",
            about: "À PROPOS",
            missions: "MISSIONS",
            gallery: "GALERIE",
            blog: "BLOG",
            collection: "COLLECTE",
            contact: "CONTACT",
            donate: "FAIRE UN DON",
            back: "Retour au site"
          },
          hero: {
            title_part1: "« UN SOLEIL",
            title_part2: "POUR CHAQUE VIE",
            title_part3: "Transformer la solidarité en opportunités durables.",
            sloganEn: "A SUN FOR EVERY LIFE",
            subtitle: " Solaris Humanity est une association humanitaire française qui transforme la solidarité en actions concrètes. Nous agissons pour améliorer durablement l'accès à l'éducation, à la santé, à l'eau potable, à l'énergie propre et à l'inclusion numérique des communautés les plus vulnérables en Afrique.", 
            cta_projects: "SOUTENIR NOS PROJETS",
            cta_missions: "DECOUVRIR NOTRE MISSION",
            foundation_date: "ASSOCIATION HUMANITAIRE INTERNATIONALE • DEPUIS 2025",
            last_action: "DERNIÈRE ACTION",
            location_cameroon: "Cameroun : Village Nkolafamba",
            testimonial_1_text: "Solaris Humanity a transformé notre village. Aujourd'hui, nos enfants peuvent étudier le soir grâce à l'électricité solaire.",
            testimonial_1_author: "Marie, Cameroun",
            testimonial_2_text: "Grâce à leur aide, notre centre de santé peut enfin conserver les vaccins. Une véritable bouée de sauvetage.",
            testimonial_2_author: "Dr. Kone, Congo",
            testimonial_3_text: "Les formations en couture m'ont permis de devenir autonome. Je peux maintenant faire vivre ma famille.",
            testimonial_3_author: "Fatima, Bénin",
          },
          blog: {
            title: "Actualités et histoires",
            description: "Suivez nos avancées et les témoignages de ceux que nous accompagnons.",
            search_placeholder: "Rechercher un article...",
            no_results: "Aucun article trouvé pour cette recherche",
            back_to_blog: "Retour au blog",
            author_label: "Auteur",
            read_time: "{{count}} min de lecture",
            support_title: "Soutenez notre action",
            share: "Partager",
            default_category: "Actualité",
          },
          legal: {
            update_label: "Mise à jour :",
            article_label: "Article",
            hq: "Siège : France (IDF)",
            hosting_text: "Ce site est hébergé par Vercel Inc., situé au 340 S Lemon Ave #4133 Walnut, CA 91789, USA.",
            ip_text: "Tous les éléments du site (textes, photos, logos) sont la propriété exclusive de Solaris Humanity. Toute reproduction sans accord préalable est strictement interdite.",
            data_text: "Conformément au RGPD, vous disposez d'un droit d'accès et de suppression de vos données.",
            view_privacy: "VOIR LA POLITIQUE DE CONFIDENTIALITÉ",
            cta_title: "Une question ?",
            cta_desc: "Notre équipe juridique est disponible pour répondre à vos interrogations.",
            cta_write: "NOUS ÉCRIRE",
            cta_contact: "CONTACTER L'ONG"
          },
            gallery: {
            title: "L'impact de vos dons en images",
            description: "Chaque moment documenté est une preuve de la transformation sur le terrain.",
            loading: "Chargement de la médiathèque...",
            all: "TOUS",
            photo_title: "Galerie Photos",
            video_title: "Rapports Vidéos",
            video_label: "VIDÉO",
            categories: {
                cameroun: "CAMEROUN",
                congo: "CONGO",
                eau: "EAU",
                education: "ÉDUCATION"
            }
            },

             home_gallery: {
            card1: { title: "Distribution Noël", loc: "Nkolafamba" },
            card2: { title: "Accès à l'eau", loc: "Mbankomo" },
            card3: { title: "Éducation", loc: "Ngousso" },
            card4: { title: "Soins médicaux", loc: "Brazzaville" }
            },
          donate: {
            title: "Votre don fait briller la",
            title_accent: "Lumière",
            subtitle: "Chaque don, quel que soit son montant, contribue à transformer des vies.",
            frequency_once: "UNE FOIS",
            frequency_monthly: "CHAQUE MOIS",
            custom_label: "Ou montant libre",
            custom_placeholder: "Saisir un montant",
            impact_label: "Impact estimé",
            impact_custom: "Votre don de {{amount}}€ sera alloué aux besoins prioritaires sur le terrain.",
            tax_real_cost: "Coût réel après impôts",
            tax_saving: "Économie",
            tax_disclaimer: "RECONNU D'INTÉRÊT GÉNÉRAL : Réduction d'impôt de 66% pour les résidents français.",
            btn_validate: "VALIDER MON DON SUR HELLOASSO",
            trust_title: "Engagement Solaris",
            help_title: "Une question ?",
            help_text: "Notre équipe répond à vos questions sur les dons matériels ou financiers.",
            tiers: {
              tier1: "Petit Geste",
              tier2: "Solidarité",
              tier3: "Impact",
              tier4: "Lumière"
            }
          },
          about: {
            badge: "NOTRE HISTOIRE",
            badge_adn: "NOTRE ADN",
            title: "Apporter la Lumière là où règne l'obscurité.",
            description: "Fondée en 2025 par Mme Nelly NDOH NGUELET, Solaris Humanity est née d'une conviction simple : chaque vie mérite de l'espoir et de l'autonomie.",
            stats: {
              foundation: "Fondation",
              impact: "Vies impactées",
              countries: "Pays d'action",
              transparency: "Transparence"
            },
            tabs: {
              vision: "VISION",
              mission: "MISSION",
              histoire: "HISTOIRE"
            },
            vision_title: "Plus qu'une aide, un vecteur d'autonomie",
            vision_text: "Notre vision est de créer un monde où chaque communauté isolée a accès à l'énergie, l'eau et l'éducation.",
            quote: "Que la lumière brille dans le noir, à travers le sourire d'un enfant ou une naissance sécurisée.",
            founder_label: "Notre Fondatrice",
            cta_contact: "NOUS CONTACTER"
          },
          missions: {
            badge: "NOS DOMAINES D'ACTION",
            title: "Apporter des solutions concrètes",
            description: "Découvrez nos 4 missions principales pour l'autonomie des populations.",
            btn_support: "Soutenir cette mission",
            btn_all: "DÉCOUVRIR TOUTES NOS MISSIONS",
            solutions_label: "Nos Solutions",
            p1: { title: "Accès à l'eau", desc: "Construction de puits et forages avec pompes solaires." },
            p2: { title: "Soins Médicaux", desc: "Matériel médical et soutien aux dispensaires locaux." },
            p3: { title: "Éducation", desc: "Fournitures scolaires, bibliothèques et formations numériques." },
            p4: { title: "Solidarité", desc: "Dons alimentaires, vestimentaires et aide aux seniors." }
          },
          collection: {
            badge: "AGIR MAINTENANT",
            title: "Comment nous soutenir ?",
            method_mobile: "Collecte Mobile",
            method_financial: "Collecte Financière",
            method_material: "Collecte Matérielle",
            mobile_desc: "Nous récupérons vos dons matériels directement en IDF.",
            mobile_items: ["Tournées Île-de-France", "Points relais partenaires", "Logistique sur RDV"],
            financial_desc: "Soutenez nos missions par un don sécurisé et défiscalisé.",
            financial_items: ["Paiement sécurisé 3DS", "Reçu fiscal immédiat", "Dons récurrents"],
            material_desc: "Nous acheminons votre matériel vers nos centres de santé.",
            material_items: ["Matériel médical", "Mobilier & Équipement", "État neuf / Bon état"],
            btn_participate: "JE PARTICIPE",
            express_title: "Faites un don en 1 minute",
            btn_donate: "DONNER {{amount}}€ MAINTENANT",
            tax_info: "66% de réduction d'impôt • PAIEMENT 100% SÉCURISÉ",
            iban_label: "IBAN DE L'ASSOCIATION",
            transparency_title: "Transparence Totale",
            transparency_text: "« Vous donnez, nous vous montrons où brille votre lumière »"
          },
          contact: {
            title: "Envoyez-nous un message",
            subtitle: "Nous vous répondrons dans les plus brefs délais",
            name_label: "Nom complet",
            email_label: "Email",
            subject_label: "Sujet",
            message_label: "Message",
            send_btn: "ENVOYER LE MESSAGE",
            sending: "ENVOI EN COURS...",
            success: "Merci ! Message transmis avec succès.",
            error: "Erreur lors de l'envoi. Veuillez réessayer."
          },
          footer: {
            international_label: "ONG INTERNATIONALE",
            ong_label: "ONG FRANÇAISE",
            law_label: "LOI 1901",
            quote: "« Le sourire d'un enfant, la lumière d'un village, la main tendue à une personne, ça n'a pas de prix. »",
            contact_title: "NOUS CONTACTER",
            contact_locations: "France (IDF), Cameroun",
            contact_response: "Réponse sous 48h ouvrées",
            newsletter_title: "NEWSLETTER",
            newsletter_desc: "Suivez nos avancées directement par email.",
            newsletter_placeholder: "votre@email.com",
            action_title: "S'ENGAGER",
            rights: "TOUS DROITS RÉSERVÉS",
            legal: "MENTIONS LÉGALES",
            privacy: "CONFIDENTIALITÉ"
          }
        }
      },
      en: {
        translation: {
          nav: {
            home: "HOME",
            about: "ABOUT",
            missions: "MISSIONS",
            gallery: "GALLERY",
            blog: "BLOG",
            collection: "COLLECTION",
            contact: "CONTACT",
            donate: "DONATE",
            back: "Back to site"
          },
          hero: {
            title_part1: "« A SUN",
            title_part2: "FOR EVERY LIFE",
            title_part3: "Turning generosity into sustainable opportunities.",
            sloganEn: "A SUN FOR EVERY LIFE",
            subtitle: "Solaris Humanity is a French non-profit organization transforming generosity into meaningful action. We improve access to education, healthcare, clean water, renewable energy and digital inclusion to empower vulnerable communities across Africa.",
            cta_projects: "SUPPORT OUR PROJECTS",
            cta_missions: "DISCOVER OUR MISSION",
            foundation_date: "INTERNATIONAL HUMANITARIAN ORGANIZATION • SINCE 2025",
            last_action: "LATEST ACTION",
            location_cameroon: "Cameroon: Nkolafamba Village",
            testimonial_1_text: "Solaris Humanity transformed our village. Today, our children can study at night thanks to solar power.",
            testimonial_1_author: "Marie, Cameroon",
            testimonial_2_text: "Thanks to their help, our health center can finally store vaccines. A true lifesaver.",
            testimonial_2_author: "Dr. Kone, Congo",
            testimonial_3_text: "The sewing training allowed me to become independent. I can now support my family.",
            testimonial_3_author: "Fatima, Benin"
          },
          blog: {
            title: "News and Stories",
            description: "Follow our progress and stories from the field.",
            search_placeholder: "Search articles...",
            no_results: "No articles found for this search",
            back_to_blog: "Back to blog",
            author_label: "Author",
            read_time: "{{count}} min read",
            support_title: "Support our cause",
            share: "Share",
            default_category: "News"
          },
          legal: {
            update_label: "Updated:",
            article_label: "Article",
            hq: "HQ: France (Paris region)",
            hosting_text: "This website is hosted by Vercel Inc., located at 340 S Lemon Ave #4133 Walnut, CA 91789, USA.",
            ip_text: "All elements of the site (texts, photos, logos) are the exclusive property of Solaris Humanity. Any reproduction without prior agreement is strictly prohibited.",
            data_text: "In accordance with GDPR, you have the right to access and delete your data.",
            view_privacy: "VIEW PRIVACY POLICY",
            cta_title: "Any questions?",
            cta_desc: "Our legal team is available to answer your inquiries.",
            cta_write: "WRITE TO US",
            cta_contact: "CONTACT THE NGO"
          },
            gallery: {
            title: "Our Impact in Pictures",
            description: "Every documented moment is proof of the transformation on the ground.",
            loading: "Loading media library...",
            all: "ALL",
            photo_title: "Photo Gallery",
            video_title: "Video Reports",
            video_label: "VIDEO",
            categories: {
                cameroun: "CAMEROON",
                congo: "CONGO",
                eau: "WATER",
                education: "EDUCATION"
            }
            },
             home_gallery: {
            card1: { title: "Christmas Gift", loc: "Nkolafamba" },
            card2: { title: "Water Access", loc: "Mbankomo" },
            card3: { title: "Education", loc: "Ngousso" },
            card4: { title: "Medical Care", loc: "Brazzaville" }
            },
          donate: {
            title: "Your donation makes the",
            title_accent: "Light",
            subtitle: "Every donation, regardless of the amount, helps transform lives.",
            frequency_once: "ONE-TIME",
            frequency_monthly: "MONTHLY",
            custom_label: "Or custom amount",
            custom_placeholder: "Enter an amount",
            impact_label: "Estimated impact",
            impact_custom: "Your donation of {{amount}}€ will be allocated to priority needs in the field.",
            tax_real_cost: "Real cost after tax",
            tax_saving: "Tax saving",
            tax_disclaimer: "GENERAL INTEREST RECOGNIZED: 66% tax reduction for French residents.",
            btn_validate: "VALIDATE MY DONATION ON HELLOASSO",
            trust_title: "Solaris Commitment",
            help_title: "Any questions?",
            help_text: "Our team answers your questions about material or financial donations.",
            tiers: {
              tier1: "Small Gesture",
              tier2: "Solidarity",
              tier3: "Impact",
              tier4: "Light"
            }
          },
          about: {
            badge: "OUR STORY",
            badge_adn: "OUR DNA",
            title: "Bringing Light where darkness reigns.",
            description: "Founded in 2025 by Mrs. Nelly NDOH NGUELET, Solaris Humanity was born from a simple conviction: every life deserves hope and autonomy.",
            stats: {
              foundation: "Founded",
              impact: "Lives impacted",
              countries: "Active countries",
              transparency: "Transparency"
            },
            tabs: {
              vision: "VISION",
              mission: "MISSION",
              histoire: "HISTORY"
            },
            vision_title: "More than aid, a driver for autonomy",
            vision_text: "Our vision is to create a world where every isolated community has access to energy, water, and education.",
            quote: "Let light shine in the dark, through a child's smile or a safe birth.",
            founder_label: "Our Founder",
            cta_contact: "CONTACT US"
          },
          missions: {
            badge: "OUR FIELDS OF ACTION",
            title: "Providing concrete solutions",
            description: "Discover our 4 main missions for population autonomy.",
            btn_support: "Support this mission",
            btn_all: "DISCOVER ALL OUR MISSIONS",
            solutions_label: "Our Solutions",
            p1: { title: "Water Access", desc: "Construction of wells and boreholes with solar pumps." },
            p2: { title: "Medical Care", desc: "Medical equipment and support for local clinics." },
            p3: { title: "Education", desc: "School supplies, libraries, and digital training." },
            p4: { title: "Solidarity", desc: "Food and clothing donations, and support for seniors." }
          },
          collection: {
            badge: "ACT NOW",
            title: "How to support us?",
            method_mobile: "Mobile Collection (France)",
            method_financial: "Financial Donation",
            method_material: "Material Donation",
            mobile_desc: "We collect your physical donations directly in the Paris region (IDF).",
            mobile_items: ["Greater Paris Tours", "Partner relay points", "Logistics on appointment"],
            financial_desc: "Support our missions through a secure and tax-deductible donation.",
            financial_items: ["3DS Secure payment", "Instant tax receipt", "Recurring donations"],
            material_desc: "We transport your equipment to our health centers.",
            material_items: ["Medical equipment", "Furniture & Equipment", "New or good condition"],
            btn_participate: "I PARTICIPATE",
            express_title: "Donate in just a few clicks",
            btn_donate: "DONATE {{amount}}€ NOW",
            tax_info: "66% Tax deduction (France) • 100% Secure Payment",
            iban_label: "ASSOCIATION IBAN",
            transparency_title: "Total Transparency",
            transparency_text: "“You give, we show you where your light shines”",
            btn_reports: "VIEW OUR REPORTS"
          },
          contact: {
            title: "Send us a message",
            subtitle: "We will get back to you as soon as possible",
            name_label: "Full Name",
            email_label: "Email",
            subject_label: "Subject",
            message_label: "Message",
            send_btn: "SEND MESSAGE",
            sending: "SENDING...",
            success: "Thank you! Message successfully transmitted.",
            error: "Error while sending. Please try again."
          },
          footer: {
            international_label: "INTERNATIONAL NGO",
            ong_label: "FRENCH NGO",
            law_label: "1901 LAW",
            quote: "“A child's smile, a village's light, a hand reached out to someone, is priceless.”",
            contact_title: "CONTACT US",
            contact_locations: "France (Paris), Cameroon",
            contact_response: "Response within 48 business hours",
            newsletter_title: "NEWSLETTER",
            newsletter_desc: "Follow our progress directly via email.",
            newsletter_placeholder: "your@email.com",
            action_title: "GET INVOLVED",
            rights: "ALL RIGHTS RESERVED",
            legal: "LEGAL NOTICE",
            privacy: "PRIVACY POLICY"
          }
        }
      }
    }
  });

export default i18n;