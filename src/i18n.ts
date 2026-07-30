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
            contact: "NOUS CONTACTER",
            donate: "FAIRE UN DON",
            back: "Retour au site"
          },
          hero: {
            title_part1: "UN SOLEIL POUR CHAQUE VIE",
            title_part2: "Transformer la solidarité en opportunités durables.",
            sloganEn: "A SUN FOR EVERY LIFE",
            subtitle: " Solaris Humanity est une association humanitaire française qui transforme la solidarité en actions concrètes. Nous agissons pour améliorer durablement l'accès à l'éducation, à la santé, à l'eau potable, à l'énergie propre et à l'inclusion numérique des communautés les plus vulnérables en Afrique.", 
            cta_projects: "SOUTENIR NOS PROJETS",
            cta_missions: "DECOUVRIR NOTRE MISSION",
            cta_main: "S'ENGAGER",
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
            title: "ACTUALITES ET HISTOIRES",
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
            title: "LA PREUVE DE VOTRE IMPACT",
            description: "Nos équipes sont présentes sur le terrain à chaque étape de nos projets. Chaque don est collecté, acheminé, distribué et documenté afin de garantir une transparence totale à nos donateurs.",
            loading: "Chargement de la médiathèque...",
            all: "TOUS",
            photo_title: "Nombre de photos dynamiques",
            section_title: "Nos actions sur le terrain",
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
              tier1: "Un premier geste",
              tier2: "Éducation ",
              tier3: "Santé ",
              tier4: "Eau & Développement Communautaire ",
            }
          },
          about: {
            badge: "NOTRE HISTOIRE",
            badge_adn: "NOTRE ADN",
            title: "Apporter de l'espoir, créer des opportunités durables.",
            section_title: "Ensemble, faisons la différence.",
            description: "Fondée en 2025, Solaris Humanity est une association humanitaire qui agit directement sur le terrain au Cameroun. Nous transformons chaque don en actions concrètes dans les domaines de l'éducation, de la santé, de l'accès à l'eau et du développement des communautés, avec une transparence totale. ",
            stats: {
              foundation: "Depuis 2025 ",
              impact: "Vies impactées",
              countries: "Pays d'intervention (Cameroun)",
              transparency: "Transparence"
            },
            tabs: {
              vision: "VISION",
              mission: "MISSION",
              histoire: "HISTOIRE"
            },
            vision_title: "Transformer chaque don en action concrète. ",
            vision_text: "Notre vision est d'améliorer durablement la vie des communautés les plus vulnérables grâce à des actions concrètes dans les domaines de l'éducation, de la santé, de l'accès à l'eau potable et du développement local. ",
            quote: "Chaque don doit devenir une action concrète, visible et durable pour les communautés que nous accompagnons. ",
            founder_label: "Fondatrice",
            cta_contact: "NOUS CONTACTER"
          },
          missions: {
            badge: "NOS PROGRAMMES D'ACTION",
            title: "NOS PROGRAMMES D'ACTION",  
            description: "Des solutions durables pour un impact concret.",
            btn_support: "Soutenir cette mission",
            btn_all: "DÉCOUVRIR TOUTES NOS MISSIONS",
            solutions_label: "Nos actions",
            p1: { title: "Accès à l'eau", desc: "articipe au financement de projets d'accès à l'eau potable et au développement durable des communautés. " },
            p2: { title: "Soins Médicaux", desc: "Contribue à l'achat de matériel médical essentiel et au soutien des centres de santé " },
            p3: { title: "Éducation", desc: "Finance des fournitures scolaires, du matériel éducatif et des ressources numériques pour les enfants." },
            p4: { title: "Solidarité", desc: "Chaque contribution compte et permet de soutenir nos actions sur le terrain. " }
          },
          collection: {
            badge: "AGIR MAINTENANT",
            title: "COMMENT SOUTENIR SOLARIS HUMANITY?",
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
            express_title: "Soutenez nos actions dès aujourd'hui",
            btn_donate: "FAIRE UN DON DE {{amount}}€",
            tax_info: "66% de réduction d'impôt (France) • DON 100% SÉCURISÉ",
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
          stats: {
            since: "Depuis 2025",
            impact: "30 vies",
            country: "1 pays",
            transparency: "100% transparence"
          },
          footer: {
            international_label: "ONG INTERNATIONALE",
            ong_label: "ONG FRANÇAISE",
            law_label: "LOI 1901",
            quote: "« Solaris Humanity agit directement sur le terrain afin de transformer chaque don en une action concrète, durable et transparente.  »",
            contact_title: "NOUS CONTACTER",
            contact_locations: "France (Île-de-France) • Cameroun ",
            contact_response: "Réponse sous 48h ouvrées",
            newsletter_title: "NEWSLETTER",
            newsletter_desc: "Recevez nos actualités, nos projets et les résultats de nos actions directement par e-mail. ",
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
            contact: "CONTACT US",
            donate: "DONATE NOW",
            back: "Back to site"
          },
          hero: {
            title_part1: "A SUN FOR EVERY LIFE",
            title_part2: "Turning generosity into sustainable opportunities.",
            sloganEn: "A SUN FOR EVERY LIFE",
            subtitle: "Solaris Humanity is a French non-profit organization transforming generosity into meaningful action. We improve access to education, healthcare, clean water, renewable energy and digital inclusion to empower vulnerable communities across Africa.",
            cta_projects: "SUPPORT OUR PROJECTS",
            cta_missions: "DISCOVER OUR MISSION",
            cta_main: "Get Involved",
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
            title: "NEWS AND STORIES",
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
            title: "THE PROOF OF YOUR IMPACT",
            description: "Our teams are present in the field at every stage of our projects. Every donation is collected, transported, delivered and documented to ensure complete transparency for our donors. ",
            loading: "Loading media library...",
            all: "ALL",
            photo_title: "Dynamic photo counter",
            section_title: "Our Actions in the Field",
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
              tier1: "A First Step ",
              tier2: "Education ",
              tier3: "Healthcare",
              tier4: "Water & Community Development ",
            }
          },
          about: {
            badge: "OUR STORY",
            badge_adn: "OUR IDENTITY",
            title: "Bringing Hope, Creating Sustainable Opportunities. ",
            section_title: "Together, Let's Make a Difference.",
            description: "Founded in 2025, Solaris Humanity is a humanitarian organization working directly in the field in Cameroon. We turn every donation into concrete action through projects focused on education, healthcare, clean water and community development, while ensuring complete transparency. ",
            stats: {
              foundation: "Since 2025",
              impact: "Lives impacted",
              countries: "Country of operation (Cameroon)",
              transparency: "Transparency"
            },
            tabs: {
              vision: "VISION",
              mission: "MISSION",
              histoire: "HISTORY"
            },
            vision_title: "Turning Every Donation into Concrete Action.",
            vision_text: "Our vision is to sustainably improve the lives of vulnerable communities through concrete actions in education, healthcare, clean water and local development. ",
            quote: "Every donation should become a concrete, visible and lasting action for the communities we support.",
            founder_label: "Founder",
            cta_contact: "CONTACT US"
          },
          missions: {
            badge: "OUR PROGRAMMES",
            title: "OUR PROGRAMMES",
            description: "sustainable solutions. Lasting impact. ",
            btn_support: "Support this programme",
            btn_all: "DISCOVER ALL OUR MISSIONS",
            solutions_label: "Our actions",
            p1: { title: "Water Access", desc: "Supports clean water projects and sustainable community development. " },
            p2: { title: "Medical Care", desc: "Helps provide essential medical equipment and support to partner healthcare centre." },
            p3: { title: "Education", desc: "Provides school supplies, educational materials and digital learning resources for children. " },
            p4: { title: "Solidarity", desc: "very contribution helps support our field projects. " }
          },
          collection: {
            badge: "Take Action Today",
            title: "HOW CAN YOU SUPPORT SOLARIS HUMANITY?",
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
            express_title: "Support Our Mission Today ",
            btn_donate: "DONATE {{amount}}€",
            tax_info: "66% Tax deduction (France) • 100% Secure Donation",
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
          stats: {
            since: "Since 2025",
            impact: "30 lives",
            country: "1 country",
            transparency: "100% transparency" 
          },
          footer: {
            international_label: "INTERNATIONAL NGO",
            ong_label: "FRENCH NGO",
            law_label: "1901 LAW",
            quote: "«Solaris Humanity works directly in the field, turning every donation into concrete, sustainable and transparent action.»",
            contact_title: "CONTACT US",
            contact_locations: "France (Paris Region) • Cameroon ",
            contact_response: "Response within 48 business hours",
            newsletter_title: "NEWSLETTER",
            newsletter_desc: "Receive our latest news, projects and field results directly in your inbox.",
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