import Hero from '@/app/components/home/Hero';
import FeaturedTours from '@/app/components/home/FeaturedTours';
import FeaturedCruises from '@/app/components/home/FeaturedCruises';
import DestinationsMap from '@/app/components/home/DestinationsMap';
import Testimonials from '@/app/components/home/Testimonials';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedTours />
      <FeaturedCruises />
      <DestinationsMap />
      <Testimonials />
    </main>
  );
}