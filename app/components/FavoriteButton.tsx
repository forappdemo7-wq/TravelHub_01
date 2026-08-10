'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/app/hooks/useFavorites';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'tour' | 'cruise' | 'restaurant' | 'destination';
  itemName: string;
  itemImage: string;
  itemPrice: number;
  variant?: 'full' | 'compact';
  className?: string;
}

export default function FavoriteButton({
  itemId,
  itemType,
  itemName,
  itemImage,
  itemPrice,
  variant = 'full',
  className = '',
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isFavorite, toggleFavorite, loading } = useFavorites();

  const isFav = isFavorite(itemId, itemType);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!session) {
      const callbackUrl = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      router.push(`/auth/signin?callbackUrl=${callbackUrl}`);
      return;
    }

    await toggleFavorite({ itemId, itemType, itemName, itemImage, itemPrice });
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`p-2 rounded-full transition-colors duration-200 ${
          isFav
            ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/30'
            : 'bg-black/50 backdrop-blur-sm text-white hover:bg-rose-500 hover:text-white'
        } ${className}`}
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl transition-all ${
        isFav
          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
          : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
      } ${className}`}
    >
      <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
      {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
    </button>
  );
}