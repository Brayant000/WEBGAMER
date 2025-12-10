import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export const ItemCard = ({ item, variant = 'gaming' }) => {
  const isGaming = variant === 'gaming';

  return (
    <motion.div
      data-testid={`item-card-${item.id}`}
      whileHover={{ y: -5 }}
      className={
        isGaming
          ? 'bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 transition-colors rounded-xl overflow-hidden'
          : 'bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-lg overflow-hidden'
      }
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3
          className={
            isGaming
              ? 'text-xl font-bold font-syne tracking-tight text-cyan-400 mb-2'
              : 'text-xl font-bold font-syne tracking-tight text-hero-primary mb-2'
          }
        >
          {item.title}
        </h3>
        <p
          className={
            isGaming
              ? 'text-gaming-textSecondary text-sm mb-4 line-clamp-2'
              : 'text-hero-textSecondary text-sm mb-4 line-clamp-2'
          }
        >
          {item.description}
        </p>
        <a
          href={item.official_link}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`item-link-${item.id}`}
          className={
            isGaming
              ? 'inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,243,255,0.5)]'
              : 'inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all'
          }
        >
          Ver Oficial
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};