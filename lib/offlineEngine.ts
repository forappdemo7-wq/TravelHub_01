// lib/offlineEngine.ts
import { restaurants } from './restaurant-data';

export interface OfflineResponse {
  text: string;
  richCard?: {
    type: 'restaurant' | 'tour' | 'cruise' | 'destination' | 'booking' | 'cancellation-option';
    title: string;
    subtitle: string;
    price?: string;
    meta?: string;
    url?: string;
    linkView?: string;
    cards?: any[];
  };
}

export function generateOfflineResponse(message: string, user?: any): OfflineResponse {
  const lower = message.trim().toLowerCase();

  // --- 1. Greeting ---
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'namaste', 'yo', 'hola'];
  if (greetings.some(g => lower === g || lower.startsWith(g + ' ') || lower.endsWith(' ' + g) || lower.includes(' ' + g + ' ') || (lower.length <= 5 && lower.includes(g)))) {
    return {
      text: "Hello! 👋 I'm your TravelHub concierge. How can I help you today? Feel free to ask about restaurants, tours, cruises, or destinations."
    };
  }

  // --- 2. About the bot ---
  if (/who are you|what are you|tell me about yourself|your name/i.test(lower)) {
    return {
      text: `I'm your TravelHub AI assistant – a friendly concierge designed to help you discover the best travel experiences. I know about our curated restaurants, tours, cruises, and destinations. What would you like to explore?`
    };
  }

  // --- 3. Thank you / farewell ---
  if (/thank|thanks|appreciate|goodbye|bye|see you/i.test(lower)) {
    return {
      text: "You're very welcome! 😊 If you need anything else, just ask. Safe travels!"
    };
  }

  // --- 4. Restaurant name match ---
  const matchedRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(lower) ||
    lower.includes(r.name.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(lower) ||
    r.location.toLowerCase().includes(lower)
  );
  if (matchedRestaurants.length === 1) {
    const r = matchedRestaurants[0];
    return {
      text: `I found **${r.name}**! ${r.description}`,
      richCard: {
        type: 'restaurant',
        title: r.name,
        subtitle: `${r.cuisine} • ${r.location}`,
        price: `$${r.price}`,
        meta: `★ ${r.rating} (${r.reviewsCount} reviews)`,
        url: `/restaurants/${r.id}`,
        linkView: 'restaurants'
      }
    };
  } else if (matchedRestaurants.length > 1) {
    return {
      text: `I found several restaurants that match your query. Here are the top picks:`,
      richCard: {
        type: 'restaurant',
        title: 'Dining Options',
        subtitle: 'Select a restaurant to learn more',
        cards: matchedRestaurants.slice(0, 3).map(r => ({
          type: 'restaurant',
          title: r.name,
          subtitle: `${r.cuisine} • ${r.location}`,
          price: `$${r.price}`,
          meta: `★ ${r.rating}`,
          url: `/restaurants/${r.id}`,
          linkView: 'restaurants'
        }))
      }
    };
  }

  // --- 5. Recommendations ---
  if (/recommend|suggest|best|good|nice|top|favorite|what.*(restaurant|eat|dine|food)/i.test(lower)) {
    const cuisines = ['alpine', 'swiss', 'french', 'seafood', 'sushi', 'japanese', 'indian', 'indonesian', 'italian', 'american', 'mediterranean'];
    const diets = ['vegan', 'vegetarian', 'gluten', 'halal', 'kosher'];
    let matchedCuisine = '', matchedDietary = '';
    for (const c of cuisines) if (lower.includes(c)) { matchedCuisine = c; break; }
    for (const d of diets) if (lower.includes(d)) { matchedDietary = d; break; }

    let candidates = restaurants;
    if (matchedCuisine) candidates = candidates.filter(r => r.cuisine.toLowerCase().includes(matchedCuisine));
    if (matchedDietary) candidates = candidates.filter(r => r.dietaryOptions?.some(opt => opt.toLowerCase().includes(matchedDietary)));
    if (candidates.length === 0) candidates = restaurants.slice(0, 3);

    const top = candidates.slice(0, 3);
    return {
      text: `Based on your preferences, here are my top recommendations:`,
      richCard: {
        type: 'restaurant',
        title: 'Recommended Dining',
        subtitle: `We found ${top.length} great options`,
        cards: top.map(r => ({
          type: 'restaurant',
          title: r.name,
          subtitle: `${r.cuisine} • ${r.location}`,
          price: `$${r.price}`,
          meta: `★ ${r.rating}`,
          url: `/restaurants/${r.id}`,
          linkView: 'restaurants'
        }))
      }
    };
  }

  // --- 6. Hours ---
  if (/hours|open|opening|closing|when.*open/i.test(lower)) {
    const allHours = restaurants.map(r => `- ${r.name}: ${r.hours}`).join('\n');
    return {
      text: `Here are the opening hours for our featured restaurants:\n${allHours}`
    };
  }

  // ================================================================
  // 7. CANCELLATION POLICY (MUST COME BEFORE RESERVATIONS)
  // ================================================================
  const isCancellationQuery = /cancel|cancellation|refund|policy|change|modify|reschedule|no-show/i.test(lower);
  if (isCancellationQuery) {
    const mentionsTour = /tour|tours|package|destination/i.test(lower);
    const mentionsCruise = /cruise|cruises/i.test(lower);
    const mentionsRestaurant = /restaurant|restaurants|table|reservation/i.test(lower);
    const mentionsDestination = /destination|destinations|trip|travel/i.test(lower);

    const typeCount = [mentionsTour, mentionsCruise, mentionsRestaurant, mentionsDestination].filter(Boolean).length;

    if (typeCount === 1) {
      if (mentionsTour || mentionsDestination) {
        return {
          text: `**Tour & Destination Package Cancellation Policy**\n\n- Free cancellation up to **48 hours** before the scheduled departure.\n- Cancellations within 48 hours incur a **50% fee**.\n- No-shows are **non-refundable**.\n\n**How to cancel**: Visit your **My Bookings** page and click "Cancel Booking".`,
          richCard: {
            type: 'booking',
            title: 'Tour & Package Cancellation',
            subtitle: 'Flexible 48-hour window',
            price: 'Free within 48h',
            meta: '50% fee after 48h',
            url: '/my-bookings',
            linkView: 'dashboard'
          }
        };
      } else if (mentionsCruise) {
        return {
          text: `**Cruise Cancellation Policy**\n\n- Free cancellation up to **7 days** before embarkation.\n- Cancellations within 7 days are **non-refundable** (100% fee).\n\n**How to cancel**: Visit your **My Bookings** page and click "Cancel Booking".`,
          richCard: {
            type: 'booking',
            title: 'Cruise Cancellation',
            subtitle: 'Free up to 7 days before',
            price: '100% fee after 7 days',
            meta: 'Non-refundable within 7d',
            url: '/my-bookings',
            linkView: 'dashboard'
          }
        };
      } else if (mentionsRestaurant) {
        return {
          text: `**Restaurant Reservation Cancellation Policy**\n\n- Free cancellation up to **24 hours** before the reservation time.\n- Cancellations within 24 hours may incur a **$25 per person** fee (or the restaurant's own charge).\n\n**How to cancel**: Visit your **My Bookings** page and click "Cancel Booking".`,
          richCard: {
            type: 'booking',
            title: 'Restaurant Cancellation',
            subtitle: 'Free up to 24 hours before',
            price: '$25 fee within 24h',
            meta: 'Varies by venue',
            url: '/my-bookings',
            linkView: 'dashboard'
          }
        };
      }
    }

    // If no type or multiple types mentioned, show clickable options
    return {
      text: `Which type of booking would you like to know the cancellation policy for?`,
      richCard: {
        type: 'cancellation-option',
        title: 'Select Booking Type',
        subtitle: 'Click on one of the options below:',
        cards: [
          {
            type: 'cancellation-option',
            title: 'Tours & Packages',
            subtitle: 'Free up to 48h before',
            meta: '50% fee after 48h',
            action: 'tours'
          },
          {
            type: 'cancellation-option',
            title: 'Cruises',
            subtitle: 'Free up to 7 days',
            meta: 'Non-refundable within 7 days',
            action: 'cruises'
          },
          {
            type: 'cancellation-option',
            title: 'Restaurant Reservations',
            subtitle: 'Free up to 24h before',
            meta: '$25 fee within 24h',
            action: 'restaurants'
          }
        ]
      }
    };
  }

  // --- 8. "What about X?" follow-up for cancellation policy ---
  if (/what about|how about|and what about/i.test(lower)) {
    const mentionsTour = /tour|tours|package|destination/i.test(lower);
    const mentionsCruise = /cruise|cruises/i.test(lower);
    const mentionsRestaurant = /restaurant|restaurants|table|reservation/i.test(lower);
    const mentionsDestination = /destination|destinations|trip|travel/i.test(lower);

    if (mentionsTour || mentionsDestination) {
      return {
        text: `**Tour & Destination Package Cancellation Policy**\n\n- Free cancellation up to **48 hours** before the scheduled departure.\n- Cancellations within 48 hours incur a **50% fee**.\n- No-shows are **non-refundable**.\n\n**How to cancel**: Visit your **My Bookings** page and click "Cancel Booking".`,
        richCard: {
          type: 'booking',
          title: 'Tour & Package Cancellation',
          subtitle: 'Flexible 48-hour window',
          price: 'Free within 48h',
          meta: '50% fee after 48h',
          url: '/my-bookings',
          linkView: 'dashboard'
        }
      };
    } else if (mentionsCruise) {
      return {
        text: `**Cruise Cancellation Policy**\n\n- Free cancellation up to **7 days** before embarkation.\n- Cancellations within 7 days are **non-refundable** (100% fee).\n\n**How to cancel**: Visit your **My Bookings** page and click "Cancel Booking".`,
        richCard: {
          type: 'booking',
          title: 'Cruise Cancellation',
          subtitle: 'Free up to 7 days before',
          price: '100% fee after 7 days',
          meta: 'Non-refundable within 7d',
          url: '/my-bookings',
          linkView: 'dashboard'
        }
      };
    } else if (mentionsRestaurant) {
      return {
        text: `**Restaurant Reservation Cancellation Policy**\n\n- Free cancellation up to **24 hours** before the reservation time.\n- Cancellations within 24 hours may incur a **$25 per person** fee (or the restaurant's own charge).\n\n**How to cancel**: Visit your **My Bookings** page and click "Cancel Booking".`,
        richCard: {
          type: 'booking',
          title: 'Restaurant Cancellation',
          subtitle: 'Free up to 24 hours before',
          price: '$25 fee within 24h',
          meta: 'Varies by venue',
          url: '/my-bookings',
          linkView: 'dashboard'
        }
      };
    }
  }

  // --- 9. Reservations (only after cancellation checks) ---
  if (/reservation|book.*table|table.*book|reserve/i.test(lower)) {
    return {
      text: `Reservations can be made directly through our website or by calling the restaurant. For Michelin-starred venues, we recommend booking at least 48 hours in advance.`,
      richCard: {
        type: 'booking',
        title: 'Make a Reservation',
        subtitle: 'Check availability and book your table',
        price: 'Free',
        meta: 'Online booking available',
        url: '/booking',
        linkView: 'booking'
      }
    };
  }

  // --- 10. Menu / dishes ---
  if (/menu|dish|plate|course|serve|special/i.test(lower)) {
    const menuRestaurants = restaurants.filter(r =>
      r.menuHighlights?.some(item => lower.includes(item.toLowerCase()))
    );
    if (menuRestaurants.length > 0) {
      const r = menuRestaurants[0];
      return {
        text: `**${r.name}** highlights: ${r.menuHighlights.join(', ')}. Would you like to see the full menu?`,
        richCard: {
          type: 'restaurant',
          title: r.name,
          subtitle: r.cuisine,
          price: `$${r.price}`,
          meta: `★ ${r.rating}`,
          url: `/restaurants/${r.id}`,
          linkView: 'restaurants'
        }
      };
    } else {
      return {
        text: `We have a variety of delicious dishes across our partner restaurants. Try asking about a specific restaurant or cuisine, or ask for a recommendation.`
      };
    }
  }

  // --- 11. Fallback ---
  return {
    text: `I'm your TravelHub assistant. I can help you with restaurant recommendations, tour information, cruise details, and destination planning. Try asking something like:\n\n- "Tell me about Locavore in Bali"\n- "Recommend a vegan restaurant"\n- "What are the opening hours?"\n- "How do I book a table?"\n- "What is the cancellation policy for tours?"\n\nWhat would you like to know?`
  };
}