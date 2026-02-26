// frontend/src/components/client/layout/Footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Send,
  Heart,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.83 1.55V6.79a4.85 4.85 0 0 1-1.06-.1z"/>
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Add newsletter subscription logic here
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    boutique: [
      { name: 'Nouvelle Collection', path: '/collections' },
      { name: 'Meilleures Ventes', path: '/produits?sort=bestseller' },
      { name: 'Promotions', path: '/produits?promo=true' },
      { name: 'Toutes les Catégories', path: '/produits' },
    ],
    aide: [
      { name: 'Contact', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Livraison', path: '/livraison' },
      { name: 'Retours', path: '/retours' },
    ],
    entreprise: [
      { name: 'À Propos', path: '/AboutPage' },
      { name: 'Notre Histoire', path: '/about#story' },
      { name: 'Carrières', path: '/careers' },
      { name: 'Presse', path: '/press' },
    ],
    legal: [
      { name: 'CGV', path: '/cgv' },
      { name: 'Mentions Légales', path: '/mentions' },
      { name: 'Confidentialité', path: '/privacy' },
      { name: 'Cookies', path: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, url: 'https://www.instagram.com/pavone.collection/', color: 'hover:text-pink-600' },
    { icon: Facebook, url: 'https://www.facebook.com/profile.php?id=61587174009708', color: 'hover:text-blue-600' },
    { icon: TikTokIcon, url: 'https://www.tiktok.com/@pavone.collection', color: 'hover:text-white' },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#111f35] via-[#5d1115] to-[#111f35] text-white relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-[#5d1115] rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#e8ddca]/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold uppercase text-sm tracking-wider">
                Newsletter
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Restez Informé de Nos Nouveautés
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-lg mb-8"
            >
              Recevez en avant-première nos offres exclusives et nos dernières collections
            </motion.p>

            <motion.form
              onSubmit={handleSubscribe}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="max-w-md mx-auto"
            >
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#fdf9ee] text-[#5d1115] rounded-full font-bold flex items-center space-x-2 hover:bg-[#e8ddca] transition-colors"
                >
                  {subscribed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.form>

            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 mt-4 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Merci de votre inscription !</span>
              </motion.p>
            )}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3 mb-6"
                >
                  <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-white">
                    <img
                      src="/src/assets/Pavon_logo.png"
                      alt="Pavone Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-2xl font-bold">Pavone</span>
                </motion.div>
              </Link>
              <p className="text-white/70 mb-6 leading-relaxed">
                La mode qui vous inspire. Des créations uniques pour révéler votre style.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 bg-white/10 backdrop-blur-md rounded-full text-white ${social.color} transition-colors`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-bold text-lg mb-4 capitalize">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path}>
                        <motion.span
                          whileHover={{ x: 5 }}
                          className="text-white/70 hover:text-white transition-colors inline-block"
                        >
                          {link.name}
                        </motion.span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="py-8 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/50">Adresse</p>
                <p className="font-medium">bni khiar Nabeul</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/50">Téléphone</p>
                <p className="font-medium">26182833</p>
              </div>
            </motion.div>


          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm flex items-center space-x-2">
              <span>All rights reserved</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Developed by</span>
                <a 
                  href="https://redixdigitalsolutions.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-400 transition-colors font-medium"
                >
                  Redix Digital Solution
                </a>
              </span>
            </p>

            <div className="flex items-center space-x-6 text-sm text-white/70">
              <Link to="/cgv" className="hover:text-white transition-colors">
                CGV
              </Link>
              <Link to="/privacy" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
