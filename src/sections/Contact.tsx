import React, { useState, useEffect, useMemo, type ChangeEvent, type FormEvent } from 'react';
import {
  Mail, MapPin, Send, Globe, Phone, CheckCircle2, Sparkles,
  Clock, ArrowLeft, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

  // Détection mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState<IContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfos = useMemo(() => [
    {
      icon: <Mail size={24} />,
      title: t('contact.email_label'),
      content: "Direction@solarishumanity.org",
      link: "mailto:Direction@solarishumanity.org",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Phone size={24} />,
      title: t('footer.contact_title'),
      content: "+33 6 95 13 75 11",
      link: "tel:+33695137511",
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
      content: "www.solarishumanity.org",
      link: "https://www.solarishumanity.org",
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
        'template_jkbuqsh',
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
    <section id="contact" className="relative py-10 xs:py-12 sm:py-16 bg-white overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-14 lg:gap-16">

          {/* GAUCHE : INFOS - Responsive */}
          <div className="space-y-6 xs:space-y-8 sm:space-y-10 animate-fadeInLeft">
            <div>
              <Badge variant="blue" className="mb-3 xs:mb-4 inline-flex gap-1.5 xs:gap-2 text-[8px] xs:text-[10px] sm:text-xs">
                <Sparkles size={isMobile ? 10 : 12} />
                {i18n.language === 'fr' ? 'RESTONS CONNECTÉS' : 'STAY CONNECTED'}
              </Badge>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 mb-4 xs:mb-5 sm:mb-6 leading-tight uppercase tracking-tighter">
                {i18n.language === 'fr' ? 'Rejoignez l\'aventure ' : 'Join the human '}
                <span className="text-blue-500">{i18n.language === 'fr' ? 'humaine' : 'adventure'}</span>
              </h2>
              <p className="text-gray-500 text-sm xs:text-base sm:text-lg leading-relaxed italic">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="grid gap-4 xs:gap-5 sm:gap-6">
              {contactInfos.map((info, index) => (
                <div key={index} className="flex items-start gap-3 xs:gap-4 sm:gap-5 p-4 xs:p-5 bg-gray-50 rounded-xl xs:rounded-2xl border border-gray-100 hover:border-blue-500 transition-all duration-300">
                  <div className={`p-2.5 xs:p-3 bg-gradient-to-br ${info.gradient} rounded-lg xs:rounded-xl text-white shadow-sm flex-shrink-0`}>
                    {info.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-gray-900 uppercase text-[8px] xs:text-[9px] sm:text-[10px] tracking-widest mb-0.5 xs:mb-1">
                      {info.title}
                    </h4>
                    <p className="text-gray-600 text-xs xs:text-sm font-bold truncate">
                      {info.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Réseaux Sociaux - Responsive */}
            <div className="flex gap-3 xs:gap-4 pt-2 xs:pt-4">
              <a
                href="https://www.instagram.com/solarishumanity?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 xs:p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-yellow-500 hover:text-white cursor-pointer transition-all"
              >
                <FaInstagram size={isMobile ? 16 : 20} />
              </a>
            </div>
          </div>

          {/* DROITE : FORMULAIRE - Responsive */}
          <div className="animate-fadeInRight">
            <div className="bg-white p-5 xs:p-6 sm:p-8 lg:p-10 rounded-2xl xs:rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
              <h3 className="text-xl xs:text-2xl font-black text-gray-800 text-center mb-6 xs:mb-8 uppercase tracking-tighter">
                {t('contact.title')}
              </h3>

              {status === 'success' && (
                <div className="mb-4 xs:mb-5 sm:mb-6 p-3 xs:p-4 bg-green-100 text-green-700 rounded-xl xs:rounded-2xl flex items-center gap-2 xs:gap-3 animate-slideDown">
                  <CheckCircle2 size={isMobile ? 16 : 20} />
                  <p className="text-xs xs:text-sm font-bold">{t('contact.success')}</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-4 xs:mb-5 sm:mb-6 p-3 xs:p-4 bg-red-100 text-red-700 rounded-xl xs:rounded-2xl flex items-center gap-2 xs:gap-3 animate-slideDown">
                  <AlertCircle size={isMobile ? 16 : 20} />
                  <p className="text-xs xs:text-sm font-bold">{t('contact.error')}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5">
                <div className="space-y-1">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-0.5 xs:ml-1">
                    {t('contact.name_label')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 xs:px-5 py-3 xs:py-4 rounded-xl xs:rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 text-sm xs:text-base"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-0.5 xs:ml-1">
                    {t('contact.email_label')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 xs:px-5 py-3 xs:py-4 rounded-xl xs:rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 text-sm xs:text-base"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-0.5 xs:ml-1">
                    {t('contact.subject_label')}
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 xs:px-5 py-3 xs:py-4 rounded-xl xs:rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 appearance-none text-sm xs:text-base"
                  >
                    <option value="">{i18n.language === 'fr' ? 'Choisir...' : 'Choose...'}</option>
                    <option value="Don">{t('nav.donate')}</option>
                    <option value="Partenariat">{i18n.language === 'fr' ? 'Partenariat' : 'Partnership'}</option>
                    <option value="Bénévolat">{i18n.language === 'fr' ? 'Bénévolat' : 'Volunteering'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-0.5 xs:ml-1">
                    {t('contact.message_label')}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={isMobile ? 3 : 4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 xs:px-5 py-3 xs:py-4 rounded-xl xs:rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-gray-50 resize-none text-sm xs:text-base"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full py-3 xs:py-4 sm:py-5 text-xs xs:text-sm shadow-blue-200 flex items-center justify-center gap-2 xs:gap-3"
                  icon={isSubmitting ? <Clock className="animate-spin" size={isMobile ? 16 : 18} /> : <Send size={isMobile ? 16 : 18} />}
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