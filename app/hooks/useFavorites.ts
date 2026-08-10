// app/hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Favorite {
  id: string;
  itemId: string;
  itemType: 'tour' | 'cruise' | 'restaurant' | 'destination';
  itemName: string;
  itemImage: string;
  itemPrice: number;
}

export function useFavorites() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch favorites ──────────────────────────────────────────────
  useEffect(() => {
    if (status === 'loading' || !session?.user?.email) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const abortController = new AbortController();

    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites', { signal: abortController.signal });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (isMounted) {
          setFavorites(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Error fetching favorites:', error);
        if (isMounted) setFavorites([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFavorites();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [session, status]);

  // ─── Check if item is favorited ──────────────────────────────────
  const isFavorite = useCallback(
    (itemId: string, itemType: string) =>
      favorites.some(f => f.itemId === itemId && f.itemType === itemType),
    [favorites]
  );

  // ─── Toggle favorite ──────────────────────────────────────────────
  const toggleFavorite = useCallback(
    async (item: {
      itemId: string;
      itemType: 'tour' | 'cruise' | 'restaurant' | 'destination';
      itemName: string;
      itemImage: string;
      itemPrice: number;
    }) => {
      if (!session) {
        // Redirect to sign‑in (handled by component)
        return false;
      }

      const already = isFavorite(item.itemId, item.itemType);
      try {
        if (already) {
          const fav = favorites.find(
            f => f.itemId === item.itemId && f.itemType === item.itemType
          );
          if (fav) {
            const res = await fetch(`/api/favorites?id=${fav.id}`, { method: 'DELETE' });
            if (res.ok) {
              setFavorites(prev => prev.filter(f => f.id !== fav.id));
              return true;
            }
          }
        } else {
          const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
          if (res.ok) {
            const newFav = await res.json();
            setFavorites(prev => [...prev, newFav]);
            return true;
          }
        }
      } catch (error) {
        console.error('Toggle favorite error:', error);
      }
      return false;
    },
    [session, favorites, isFavorite]
  );

  return { favorites, loading, isFavorite, toggleFavorite };
}