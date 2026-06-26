import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sara Mengistu",
    role: "Bank Analyst → Finance Consultant",
    avatar: "SM",
    color: "from-indigo-600 to-blue-600",
    stars: 5,
    quote: "I had no idea where to start with my own business. Work2Business matched me with financial consulting and built a plan so detailed it looked like something a $5,000 consultant would charge for.",
    result: "Replaced 70% of salary in 3 months"
  },
  {
    name: "Yonas Tadesse",
    role: "Software Engineer → Tech Studio Founder",
    avatar: "YT",
    color: "from-purple-600 to-violet-600",
    stars: 5,
    quote: "The AI plan was specific to my exact skills and capital. It didn't just say 'start a software company' — it gave me a 90-day roadmap with weekly milestones. I followed it and landed my first client in week 4.",
    result: "First client in 28 days"
  },
  {
    name: "Liya Bekele",
    role: "HR Manager → HR Consultancy Founder",
    avatar: "LB",
    color: "from-pink-600 to-rose-600",
    stars: 5,
    quote: "What convinced me was the skill gap analysis. I could see exactly what I already knew versus what I needed to learn for each business. That transparency made the decision so much easier.",
    result: "4 corporate clients in 2 months"
  },
  {
    name: "Daniel Haile",
    role: "Accountant → Online Training Center",
    avatar: "DH",
    color: "from-emerald-600 to-teal-600",
    stars: 5,
    quote: "I used the business comparison feature to decide between two ideas I was torn on. Seeing everything side by side — profit potential, required capital, risk — made it obvious which one fit me better.",
    result: "200 students enrolled in first course"
  },
  {
    name: "Marta Solomon",
    role: "Marketing Manager → Digital Agency",
    avatar: "MS",
    color: "from-amber-600 to-orange-600",
    stars: 5,
    quote: "The milestone tracker kept me accountable. I had tried starting a business twice before and gave up. This time, I had clear weekly goals and checked each one off. That made all the difference.",
    result: "Agency profitable in month 5"
  },
  {
    name: "Abel Tesfaye",
    role: "IT Support → Managed Services Business",
    avatar: "AT",
    color: "from-cyan-600 to-blue-600",
    stars: 5,
    quote: "I generated the AI business name ideas and one of them — TechBridge Solutions — was perfect. I'm now registered under that name. It's a small thing but it made the business feel real from day one.",
    result: "6 business clients signed in month 2"
  }
];

function TestimonialCard({ t }) {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full min-h-[320px] hover:border-slate-700/80 transition-all duration-300">
      <Quote className="w-6 h-6 text-indigo-500/40 mb-4 shrink-0" />
      <div className="flex gap-1 mb-4">
        {Array.from({ length: t.stars }).map((_, j) => (
          <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">"{t.quote}"</p>
      <div className="mb-4 px-3 py-1.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
        <p className="text-xs text-emerald-400 font-semibold">✓ {t.result}</p>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-800 mt-auto">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
          {t.avatar}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{t.name}</p>
          <p className="text-slate-500 text-[11px]">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateControls = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);

    const cards = el.querySelectorAll("[data-slide]");
    if (!cards.length) return;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateControls();
    el.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      el.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [updateControls]);

  const scrollToIndex = (index) => {
    const el = trackRef.current;
    const card = el?.querySelectorAll("[data-slide]")[index];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  };

  const scrollBy = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-slide]");
    const gap = 20;
    const step = (card?.offsetWidth || 360) + gap;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-label mb-3">Real Stories</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            People who made the leap
          </h2>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            From employees to entrepreneurs — powered by Work2Business.
          </p>
        </motion.div>

        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#080d1a] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#080d1a] to-transparent z-10" />

          {/* Slider track */}
          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                data-slide
                className="snap-start shrink-0 w-[85vw] sm:w-[380px] lg:w-[calc(33.333%-14px)]"
              >
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Previous testimonial"
              className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === i ? "w-6 bg-indigo-500" : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Next testimonial"
              className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
