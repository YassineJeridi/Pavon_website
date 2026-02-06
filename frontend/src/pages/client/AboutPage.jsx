// frontend/src/pages/client/AboutPage.jsx
import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Award,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Globe
} from 'lucide-react';

const AboutPage = () => {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  useEffect(() => {
    document.title = 'À Propos - Élégance';
    window.scrollTo(0, 0);
  }, []);

  // Values data
  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Notre amour pour la mode nous inspire à créer des pièces exceptionnelles.',
      color: 'from-[#5d1115] to-[#5d1115]',
    },
    {
      icon: Award,
      title: 'Qualité',
      description: 'Des matériaux premium et un savoir-faire artisanal dans chaque création.',
      color: 'from-[#e8ddca] to-[#e8ddca]',
    },
    {
      icon: Shield,
      title: 'Authenticité',
      description: 'Des designs originaux qui célèbrent votre individualité et votre style.',
      color: 'from-[#111f35] to-[#111f35]',
    },
    {
      icon: Globe,
      title: 'Durabilité',
      description: 'Un engagement pour une mode responsable et respectueuse de l\'environnement.',
      color: 'from-[#5d1115] to-[#111f35]',
    },
  ];

  // Stats data
  const stats = [
    { number: '15+', label: 'Années d\'Excellence', icon: TrendingUp },
    { number: '50K+', label: 'Clients Satisfaits', icon: Users },
    { number: '200+', label: 'Collections Créées', icon: Sparkles },
    { number: '98%', label: 'Taux de Satisfaction', icon: Heart },
  ];

  // Timeline data
  const timeline = [
    { year: '2010', title: 'La Naissance', description: 'Fondation de notre maison de couture à Paris' },
    { year: '2015', title: 'Expansion', description: 'Ouverture de boutiques dans toute l\'Europe' },
    { year: '2020', title: 'Innovation', description: 'Lancement de notre plateforme e-commerce' },
    { year: '2026', title: 'Vision Globale', description: 'Présence internationale et engagement durable' },
  ];

  return (
    <div className="min-h-screen bg-[#fdf9ee] overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf9ee] via-[#e8ddca]/20 to-[#fdf9ee]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-10 w-96 h-96 bg-[#5d1115]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-[#e8ddca]/30 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white border border-[#e8ddca] px-6 py-3 rounded-full mb-8"
            >
              <Sparkles className="w-5 h-5 text-[#5d1115]" />
              <span className="text-[#111f35] font-semibold uppercase text-sm tracking-wider">
                Notre Histoire
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-7xl font-bold mb-8"
            >
              <span className="text-[#111f35]">
                L'Art de l'Élégance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              Depuis 2010, nous créons des pièces exceptionnelles qui célèbrent la beauté,
              l'authenticité et l'individualité. Chaque création raconte une histoire unique.
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-20 text-white"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,64 C240,90 480,110 720,100 C960,90 1200,70 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  style={{ scale }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
                    alt="Notre Atelier"
                    className="w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5d1115]/50 to-transparent" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -bottom-8 -right-8 bg-gradient-to-br from-[#5d1115] to-[#111f35] p-8 rounded-3xl shadow-2xl"
                >
                  <Award className="w-16 h-16 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#5d1115] to-[#111f35] bg-clip-text text-transparent">
                Une Passion Devenue Réalité
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Tout a commencé dans un petit atelier parisien, où notre fondatrice Maria
                Dubois a transformé sa passion pour la couture en une marque qui redéfinit
                l'élégance moderne.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Aujourd'hui, Élégance est reconnue internationalement pour ses créations
                intemporelles qui allient savoir-faire traditionnel et innovation contemporaine.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Chaque pièce est conçue avec amour, attention aux détails et un engagement
                indéfectible envers la qualité et l'authenticité.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#5d1115] via-[#111f35] to-[#5d1115] overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#5d1115] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-[#111f35] rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                  >
                    <Icon className="w-12 h-12 text-white mx-auto mb-4" />
                  </motion.div>
                  <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80 text-lg">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#5d1115] to-[#111f35] bg-clip-text text-transparent">
              Nos Valeurs
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              Les piliers qui guident chacune de nos créations et décisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateY: -30 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -15, scale: 1.03 }}
                  className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                    className={`inline-flex p-4 bg-gradient-to-br ${value.color} rounded-2xl mb-6 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#5d1115] to-[#111f35] bg-clip-text text-transparent">
              Notre Parcours
            </h2>
            <p className="text-gray-600 text-xl">Une histoire d'innovation et de passion</p>
          </motion.div>

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
              >
                <div className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
                  >
                    <div className="text-5xl font-bold bg-gradient-to-r from-[#5d1115] to-[#111f35] bg-clip-text text-transparent mb-4">
                      {item.year}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-lg">{item.description}</p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5d1115] to-[#111f35] flex items-center justify-center shadow-2xl"
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#5d1115] via-[#111f35] to-[#5d1115] overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#5d1115] rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Zap className="w-16 h-16 text-[#e8ddca] mx-auto mb-6" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Rejoignez Notre Communauté
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 mb-10"
          >
            Découvrez nos collections exclusives et profitez d'offres spéciales
          </motion.p>

          <motion.a
            href="/produits"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-[#5d1115] px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all"
          >
            Découvrir la Collection
          </motion.a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
