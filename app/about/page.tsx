import { Users, Globe, Award, Heart, Sparkles, Shield, Map } from 'lucide-react';
import Card from '@/app/components/ui/Card';

export default function AboutPage() {
  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '10,000+' },
    { icon: Map, label: 'Destinations', value: '50+' },
    { icon: Award, label: 'Awards Won', value: '15' },
    { icon: Heart, label: 'Satisfaction Rate', value: '98%' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Expertly Curated',
      desc: 'Every expedition is designed by travel artisans who know the destinations intimately.'
    },
    {
      icon: Globe,
      title: 'Authentic Experiences',
      desc: 'Connect deeply with local cultures and create meaningful, lasting memories.'
    },
    {
      icon: Shield,
      title: '24/7 Premium Support',
      desc: 'Our dedicated concierge team is always by your side, anywhere in the world.'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-950 selection:bg-blue-500/30">
      
      {/* Hero Header - Deep Blue Theme */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
            alt="Skyline Perspective" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="container relative mx-auto px-4 text-center z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-lg border border-white/10">
            <Globe className="w-8 h-8 text-blue-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            We're passionate about curating unforgettable travel experiences that transform the way you see the world.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 md:order-1">
            <span className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3 inline-block">The Genesis</span>
            <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Redefining Exploration</h3>
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
              <p>
                Founded in 2020, TravelHub started with a simple yet ambitious mission: to make premium travel 
                accessible, authentic, and unforgettable. What began as an intimate collective of 
                travel enthusiasts has blossomed into a global community of modern explorers.
              </p>
              <p>
                We believe that travel has the power to transform lives. That's why we 
                carefully curate every single itinerary, partnering exclusively with local artisans and 
                communities to ensure an authentic and sustainable footprint.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 scale-105 opacity-10 dark:opacity-20 transition-transform duration-500 hover:rotate-6"></div>
            <img 
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2000&auto=format&fit=crop"
              alt="Our Team"
              className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full z-10"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <Card key={index} className="relative group p-8 text-center bg-white dark:bg-slate-900 border-0 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                </div>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400 uppercase">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="text-center max-w-5xl mx-auto">
          <span className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3 inline-block">The Advantage</span>
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-16">Why Travel With Us?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="bg-white dark:bg-slate-900 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:-translate-y-2 transition-transform duration-300">
                  <feature.icon className="w-10 h-10 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}