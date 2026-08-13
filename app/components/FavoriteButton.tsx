'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/app/hooks/useFavorites';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'tour' | 'cruise' | 'restaurant' | 'destination';
  itemName: string;
  itemImage: string;
  itemPrice: number;
  variant?: 'compact' | 'full';
}

export default function FavoriteButton({
  itemId,
  itemType,
  itemName,
  itemImage,
  itemPrice,
  variant = 'compact',
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const isFav = isFavorite(itemId, itemType);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert('Please sign in to add favorites.');
      return;
    }

    setIsLoading(true);
    try {
      await toggleFavorite({
        itemId,
        itemType,
        itemName,
        itemImage,
        itemPrice,
      });
    } catch (error) {
      console.error('Toggle favorite error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="group flex items-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500'}`} />
        )}
        {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    );
  }

  // ─── Compact version (used in cards) ─────────────────────────────
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm disabled:opacity-70 flex items-center justify-center"
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart
          className={`w-5 h-5 transition-all ${
            isFav ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
          }`}
        />
      )}
    </button>
  );
}