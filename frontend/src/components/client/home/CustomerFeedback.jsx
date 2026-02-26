// frontend/src/components/client/home/CustomerFeedback.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Heart, Sparkles } from 'lucide-react';
import testimonialService from '../../../services/testimonialService';

const CustomerFeedback = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialService.getActiveTestimonials(20);
      const testimonialsData = response?.data || response || [];
      const validTestimonials = (Array.isArray(testimonialsData) ? testimonialsData : [])
        .filter(t => t && t._id && t.name && t.rating);

      // Triple for seamless infinite scroll
      const tripled = [...validTestimonials, ...validTestimonials, ...validTestimonials];
      setTestimonials(tripled);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#fdf9ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="min-w-[420px] h-72 bg-white/60 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-[#fdf9ee]">
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-24 h-24 bg-[#5d1115]/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-32 h-32 bg-[#e8ddca]/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/3 right-1/4 w-64 h-64 border-2 border-[#e8ddca]/30 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full mb-6 shadow-lg border border-[#e8ddca]"
          >
            <Heart className="w-5 h-5 text-[#5d1115]" fill="currentColor" />
            <span className="text-[#111f35] font-bold uppercase text-sm tracking-wider">
              Témoignages Clients
            </span>
            <Sparkles className="w-5 h-5 text-[#5d1115]" />
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-[#111f35]">
              Ils Nous Font
            </span>
            <br />
            <span className="text-[#5d1115]">
              Confiance
            </span>
          </h2>
          <p className="text-[#111f35]/80 text-xl max-w-3xl mx-auto font-medium">
            Découvrez les expériences authentiques de nos clients satisfaits
          </p>
        </motion.div>

        {/* Sliding Testimonials Container */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Infinite Scroll Animation */}
          <div className="overflow-hidden py-4">
            <motion.div
              className="flex gap-6"
              animate={{
                x: ['0%', '-33.333%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 45,
                  ease: 'linear',
                },
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial._id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="relative min-w-[420px] max-w-[420px] flex-shrink-0"
                >
                  {/* Card */}
                  <div className="relative h-full bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#e8ddca]/30 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fdf9ee] via-transparent to-[#e8ddca]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quote Icon */}
                    <div className="absolute -top-3 -right-3 bg-[#5d1115] p-5 rounded-full shadow-lg opacity-90">
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Star Rating */}
                      <div className="flex items-center gap-2 mb-6">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <Star
                                className={`w-5 h-5 ${i < testimonial.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-300 fill-gray-300'
                                  }`}
                              />
                            </motion.div>
                          ))}
                        </div>
                        <span className="text-gray-600 font-semibold text-sm ml-1">
                          {testimonial.rating}.0
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="mb-6">
                        <p className="text-gray-800 text-base leading-relaxed line-clamp-5 min-h-[120px]">
                          "{testimonial.comment || testimonial.message || ''}"
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

                      {/* Author Info */}
                      <div className="flex items-center gap-4">
                        {testimonial.avatar ? (
                          <img
                            src={`http://localhost:5000${testimonial.avatar}`}
                            alt={testimonial.name}
                            className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md ring-2 ring-purple-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=a855f7&color=fff&size=128&bold=true`;
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-[#5d1115] flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-[#e8ddca]">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-[#111f35] text-lg mb-1">
                            {testimonial.name}
                          </h4>
                          {testimonial.position ? (
                            <p className="text-[#5d1115] text-sm font-medium">
                              {testimonial.position}
                            </p>
                          ) : (
                            <p className="text-[#111f35]/60 text-sm">
                              Client Vérifié
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Gradient Fade Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-r from-[#fdf9ee] via-[#fdf9ee]/80 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-l from-[#fdf9ee] via-[#fdf9ee]/80 to-transparent pointer-events-none z-10" />
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-[#e8ddca]">
            <div className="text-4xl font-bold text-[#5d1115] mb-2">
              500+
            </div>
            <div className="text-[#111f35]/70 font-medium">Avis Clients</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-[#e8ddca]">
            <div className="text-4xl font-bold text-[#5d1115] mb-2">
              4.8/5
            </div>
            <div className="text-[#111f35]/70 font-medium">Note Moyenne</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-[#e8ddca]">
            <div className="text-4xl font-bold text-[#5d1115] mb-2">
              98%
            </div>
            <div className="text-[#111f35]/70 font-medium">Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerFeedback;
