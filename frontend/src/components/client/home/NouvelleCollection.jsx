import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collectionService } from '../../../services/collectionService';
import { getCollectionImageUrl } from '../../../utils/imageUtils';

const NouvelleCollection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCollections();
  }, []);

  const fetchFeaturedCollections = async () => {
    try {
      setLoading(true);
      const response = await collectionService.getFeatured(6);
      console.log('Featured collections response:', response.data);
      setCollections(response.data.data || []);
    } catch (error) {
      console.error('Error fetching featured collections:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#fdf9ee]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-[#e8ddca] text-[#5d1115] px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Nos Collections</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-[#111f35]">Découvrez Nos Collections</h2>
          <p className="text-[#111f35]/70 max-w-2xl mx-auto">
            Des collections soigneusement sélectionnées pour sublimer votre style
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
              <motion.div
                key={collection._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  {collection.image ? (
                    <img
                      src={getCollectionImageUrl(collection)}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x500?text=Collection';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-amber-600" />
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                  {collection.description && (
                    <p className="text-white/90 mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <Link
                    to={`/collections/${collection.slug}`}
                    className="inline-flex items-center gap-2 text-white hover:text-[#e8ddca] transition-colors font-medium"
                  >
                    Découvrir
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-[#5d1115] text-white px-8 py-3 rounded-full hover:bg-[#111f35] transition-colors font-medium"
          >
            Voir Toutes Les Collections
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NouvelleCollection;
