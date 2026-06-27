import { BookOpen, Egg, Syringe, Home, Utensils, HeartPulse, Sprout, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const guides = [
  {
    icon: Egg,
    title: 'Getting Started with Layer Farming',
    category: 'Beginner',
    content: `Starting a layer farm requires careful planning. Begin with proper housing — ensure your chicken house is well-ventilated, secure from predators, and provides at least 2 square feet per bird. Choose the right breed: we recommend hybrid layers for high egg production. Start with point-of-lay hens or day-old chicks depending on your experience level. Feed is critical — use quality layer mash with 16-18% protein. Fresh water must always be available. Vaccinate against Newcastle disease, Gumboro, and Infectious Bronchitis. Collect eggs twice daily and store them pointed-end down in a cool, dry place.`,
  },
  {
    icon: Syringe,
    title: 'Vaccination Schedule for Chickens',
    category: 'Health',
    content: `A proper vaccination schedule is essential for healthy flocks. Day 1: Marek's disease (at hatchery). Day 7-10: Newcastle disease (NDV) first dose. Day 14-16: Gumboro (IBD) first dose. Day 21: Newcastle disease booster. Day 28: Gumboro booster. Week 6-8: Fowl Pox vaccine. Week 10-12: Newcastle disease booster. Week 16-18: Infectious Bronchitis. Always administer vaccines in cool conditions, preferably early morning. Keep vaccines refrigerated until use. Consult a veterinary officer for a customized schedule based on disease prevalence in your area.`,
  },
  {
    icon: Home,
    title: 'Building a Low-Cost Chicken House',
    category: 'Infrastructure',
    content: `A good chicken house doesn't have to be expensive. Use locally available materials — timber frame with iron sheet roofing works well. Ensure the house is oriented east-west to minimize direct sunlight. Raise the floor 1-2 feet off the ground to prevent flooding and rodent entry. Use wire mesh on windows for ventilation while keeping predators out. Provide 1 nest box per 4-5 layers, placed in darker areas of the house. Install perches 2 feet off the ground for layers to roost. Use deep litter system with wood shavings or dry grass — turn the litter weekly and replace monthly.`,
  },
  {
    icon: Utensils,
    title: 'Feeding Guide for Optimal Growth',
    category: 'Nutrition',
    content: `Proper nutrition is the foundation of poultry success. Day-old to 8 weeks: Use chick starter mash with 20-22% protein. Feed ad libitum (always available). 8-18 weeks: Grower mash with 16-18% protein. Limit feed to prevent obesity. 18+ weeks: Layer mash with 16-18% protein plus calcium supplements (oyster shells or limestone). Provide grit to aid digestion. Fresh, clean water is essential — birds drink twice as much as they eat. In hot weather, add electrolytes to water. Never feed moldy or contaminated feed. Store feed in a cool, dry place in sealed containers.`,
  },
  {
    icon: HeartPulse,
    title: 'Common Chicken Diseases & Prevention',
    category: 'Health',
    content: `Newcastle Disease: Vaccinate regularly. Symptoms include breathing difficulty and green diarrhea. Isolate sick birds immediately. Gumboro (IBD): Affects young chicks. Vaccinate at 14 days. Symptoms include wet droppings and lethargy. Coccidiosis: Common in young birds. Prevent with clean, dry litter. Treat with anticoccidial drugs. Fowl Pox: Spread by mosquitoes. Vaccinate and control mosquitoes. External Parasites (mites, lice): Dust birds with appropriate powder and maintain clean housing. Internal Worms: Deworm every 3 months. Use clean water and prevent contact with wild birds.`,
  },
  {
    icon: Sprout,
    title: 'Brooding Day-Old Chicks Successfully',
    category: 'Beginner',
    content: `The first 4 weeks determine chick survival. Temperature: Start at 35°C for week 1, reduce by 3°C each week until 21°C. Use infrared lamps or charcoal stoves for heating. Place waterers and feeders throughout the brooder. Dip each chick's beak in water on arrival. Use chick paper for the first 3 days. Provide 24-hour lighting for the first week, then reduce gradually. Vaccinate against Newcastle and Gumboro on schedule. Watch for signs of cold (huddling) or heat (panting). Clean and disinfect the brooder between batches. Mortality should be under 5% — investigate immediately if higher.`,
  },
]

const categoryColors: Record<string, string> = {
  Beginner: '#606C38',
  Health: '#BC6C25',
  Infrastructure: '#D4A373',
  Nutrition: '#8B7E66',
}

export default function Guides() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  return (
    <div className="pt-24 lg:pt-28">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-[1200px] mx-auto">
          <span className="eyebrow mb-3 block">Knowledge Hub</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Farming Guides
          </h1>
          <p className="font-serif text-base lg:text-lg max-w-[600px]" style={{ color: 'var(--text-muted)' }}>
            Practical poultry farming advice from our years of experience. Learn the fundamentals and advanced techniques for a successful farm.
          </p>
        </div>
      </section>

      {/* Guides List */}
      <section className="section-pad px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
        <div className="max-w-[800px] mx-auto space-y-4">
          {guides.map((guide, i) => (
            <div
              key={guide.title}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{ background: 'var(--surface)', boxShadow: '0 2px 12px rgba(40,54,24,0.04)' }}
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full flex items-center gap-4 p-5 lg:p-6 text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--bg-alt)' }}
                >
                  <guide.icon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="font-sora text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${categoryColors[guide.category]}15`,
                        color: categoryColors[guide.category],
                      }}
                    >
                      {guide.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-base lg:text-lg" style={{ color: 'var(--text-main)' }}>
                    {guide.title}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${expandedIndex === i ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-muted)' }}
                />
              </button>
              {expandedIndex === i && (
                <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-0">
                  <div className="pl-14">
                    <p className="font-serif text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {guide.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="max-w-[800px] mx-auto mt-10 p-6 rounded-2xl" style={{ background: 'var(--bg-alt)' }}>
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
            <div>
              <h4 className="font-serif text-base mb-1" style={{ color: 'var(--text-main)' }}>Want to Learn More?</h4>
              <p className="font-serif text-sm" style={{ color: 'var(--text-muted)' }}>
                Visit our <a href="https://unifiedfarmblm.blogspot.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--accent)' }}>Farm Blog</a> for detailed articles, or <a href="/contact" className="underline" style={{ color: 'var(--accent)' }}>book a consultation</a> for personalized guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
