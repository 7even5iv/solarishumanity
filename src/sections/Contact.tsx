import React, { useState, useMemo, type ChangeEvent, type FormEvent } from 'react';
import {
  Mail, MapPin, Send, Globe, Phone, CheckCircle2, Sparkles,
  Clock, ArrowLeft, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Ajouté
import { FaInstagram } from 'react-icons/fa';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import emailjs from '@emailjs/browser';

interface IContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<IContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 1. INFOS DE CONTACT TRADUITES (Via useMemo)
  const contactInfos = useMemo(() => [
    {
      icon: <Mail size={24} />,
      title: t('contact.email_label'),
      content: "contact@solarishumanity.fr",
      link: "mailto:contact@solarishumanity.fr",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Phone size={24} />,
      title: t('footer.contact_title'), // Réutilisation d'une clé existante
      content: "+33 6 12 34 56 78",
      link: "tel:+33612345678",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      icon: <MapPin size={24} />,
      title: "Zones",
      content: t('footer.contact_locations'),
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Globe size={24} />,
      title: "Web",
      content: "www.solarishumanity.fr",
      link: "https://www.solarishumanity.fr",
      gradient: "from-yellow-500 to-amber-600"
    }
  ], [t]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      name: formData.name
    };

    try {
      await emailjs.send(
        'service_ovf6rcc',
        'template_jkbuqsh',// Utilisation de ton ID de template mis à jour
        templateParams,
        'VE2_0tYpBEhijm8gY'
      );
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Erreur EmailJS:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative py-12 bg-white overflow-hidden min-h-screen">

      {/* BOUTON RETOUR BILINGUE */}
      <div className="max-w-7xl mx-auto px-4 mb-12 relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 text-[10px] font-black text-gray-500 hover:text-blue-500 transition-all uppercase tracking-[0.2em] group">
          <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors shadow-sm">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="mt-0.5">{t('nav.back')}</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* GAUCHE : INFOS */}
          <div className="space-y-10 animate-fadeInLeft">
            <div>
              <Badge variant="blue" className="mb-4 inline-flex gap-2">
                <Sparkles size={12} /> {i18n.language === 'fr' ? 'RESTONS CONNECTÉS' : 'STAY CONNECTED'}
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6 leading-tight uppercase tracking-tighter">
                {i18n.language === 'fr' ? 'Rejoignez l\'aventure ' : 'Join the human '}
                <span className="text-blue-500">{i18n.language === 'fr' ? 'humaine' : 'adventure'}</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed italic">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfos.map((info, index) => (
                <div key={index} className="flex items-start gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-500 transition-all duration-300">
                  <div className={`p-3 bg-gradient-to-br ${info.gradient} rounded-xl text-white shadow-sm`}>
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-1">{info.title}</h4>
                    <p className="text-gray-600 text-sm font-bold">{info.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Réseaux Sociaux */}
            <div className="flex gap-4 pt-4">
              <a href="https://www.instagram.com/solarishumanity?utm_source=qr">
              <div className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-yellow-500 hover:text-white cursor-pointer transition-all"><FaInstagram size={20} /></div>
              </a>
            </div>
          </div>

          {/* DROITE : FORMULAIRE */}
          <div className="animate-fadeInRight">
            <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
              <h3 className="text-2xl font-black text-gray-800 text-center mb-8 uppercase tracking-tighter">{t('contact.title')}</h3>

              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-2xl flex items-center gap-3 animate-slideDown">
                  <CheckCircle2 size={20} />
                  <p className="text-sm font-bold">{t('contact.success')}</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl flex items-center gap-3 animate-slideDown">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">{t('contact.error')}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('contact.name_label')}</label>
                  <input
                    type="text" name="name" required value={formData.name} onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('contact.email_label')}</label>
                  <input
                    type="email" name="email" required value={formData.email} onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('contact.subject_label')}</label>
                  <select
                    name="subject" required value={formData.subject} onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 appearance-none"
                  >
                    <option value="">{i18n.language === 'fr' ? 'Choisir...' : 'Choose...'}</option>
                    <option value="Don">{t('nav.donate')}</option>
                    <option value="Partenariat">{i18n.language === 'fr' ? 'Partenariat' : 'Partnership'}</option>
                    <option value="Bénévolat">{i18n.language === 'fr' ? 'Bénévolat' : 'Volunteering'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('contact.message_label')}</label>
                  <textarea
                    name="message" required rows={4} value={formData.message} onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full py-5 text-sm shadow-blue-200 flex items-center justify-center gap-3"
                  icon={isSubmitting ? <Clock className="animate-spin" size={18} /> : <Send size={18} />}
                >
                  {isSubmitting ? t('contact.sending') : t('contact.send_btn')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;