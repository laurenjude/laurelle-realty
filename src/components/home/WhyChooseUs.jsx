import { Brain, ShieldCheck, MapPin, TrendingUp, Clock, Headphones } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Search',
    description:
      'Our intelligent platform analyses your preferences to surface the most relevant properties, saving you hours of manual browsing.',
    highlight: true,
  },
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    description:
      'Every property on Laurelle Realty is physically inspected and legally verified before listing, so you can browse with confidence.',
    highlight: false,
  },
  {
    icon: MapPin,
    title: 'Local Expertise',
    description:
      'Deep knowledge of Lagos neighbourhoods — from Lekki to Ikoyi to Magodo — means you get insights no algorithm can replace.',
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description:
      'Access real-time price trends and neighbourhood analytics to make data-driven decisions, whether buying or renting.',
    highlight: false,
  },
  {
    icon: Clock,
    title: 'Fast Transactions',
    description:
      'Our streamlined process from viewing to signing is designed to close deals quickly without compromising on due diligence.',
    highlight: false,
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description:
      'A dedicated property consultant guides you from first enquiry to final handover — no chatbots, real human expertise.',
    highlight: false,
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block">
            Our Difference
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-4">
            Why Choose Laurelle Realty?
          </h2>
          <p className="text-muted text-base leading-relaxed">
            We combine cutting-edge AI technology with unmatched local knowledge to
            deliver a property experience unlike anything else in Lagos.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description, highlight }) => (
            <div
              key={title}
              className={[
                'rounded-2xl p-7 transition-all duration-300 group',
                highlight
                  ? 'bg-primary text-white shadow-xl shadow-primary/20'
                  : 'bg-white hover:shadow-lg hover:-translate-y-1',
              ].join(' ')}
            >
              <div
                className={[
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors',
                  highlight ? 'bg-white/15' : 'bg-primary/8 group-hover:bg-primary/12',
                ].join(' ')}
              >
                <Icon size={22} className={highlight ? 'text-accent' : 'text-primary'} />
              </div>
              <h3
                className={[
                  'font-heading font-semibold text-lg mb-2.5',
                  highlight ? 'text-white' : 'text-dark',
                ].join(' ')}
              >
                {title}
              </h3>
              <p
                className={[
                  'text-sm leading-relaxed',
                  highlight ? 'text-white/75' : 'text-muted',
                ].join(' ')}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
