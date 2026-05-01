import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Adaeze Okonkwo',
    role: 'Purchased a duplex in Lekki Phase 1',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&q=80&fit=crop&crop=face',
    rating: 5,
    quote:
      'Laurelle Realty found us the perfect family home in exactly the neighbourhood we wanted. The AI recommendations were uncannily accurate — it surfaced properties we had not even considered, and our consultant made the whole process feel effortless.',
  },
  {
    id: 2,
    name: 'Emeka Nwachukwu',
    role: 'Rented a penthouse in Victoria Island',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&q=80&fit=crop&crop=face',
    rating: 5,
    quote:
      'As an expatriate navigating Lagos for the first time, I was worried about finding quality housing. The Laurelle Realty team guided me step by step and delivered a stunning VI penthouse within two weeks. Genuinely exceptional service.',
  },
  {
    id: 3,
    name: 'Funmilayo Adeyemi',
    role: 'Invested in Ikoyi property',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&q=80&fit=crop&crop=face',
    rating: 5,
    quote:
      'The market intelligence reports from Laurelle Realty gave me the confidence to make a sound investment decision. My Ikoyi apartment has already appreciated 18% in one year. Their data-driven approach is a game changer.',
  },
]

function StarRating({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} size={14} className="text-accent fill-accent" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block">
            Client Stories
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted">
            Hear from the families and investors who found their perfect property
            through Laurelle Realty.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-cream rounded-2xl p-7 relative flex flex-col"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote size={48} className="text-primary" />
              </div>

              <StarRating count={t.rating} />

              <blockquote className="text-dark/80 text-sm leading-relaxed mt-5 mb-7 flex-1 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-dark text-sm">{t.name}</p>
                  <p className="text-muted text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-14 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '1,200+', label: 'Successful Transactions' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-heading font-bold text-2xl text-primary">{value}</span>
              <span className="text-muted text-sm mt-1">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
