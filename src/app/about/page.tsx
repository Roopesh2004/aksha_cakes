"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Heart, Award, ShieldCheck, Flame, Utensils } from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="pb-20 space-y-20 overflow-hidden">
      {/* Hero Banner Section */}
      <section className="relative bg-pastel-gradient dark:bg-card-dark/20 py-20 px-4 text-center border-b border-primary/5">
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-primary/10 blur-sm animate-float" />
        <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-primary-soft/20 blur-sm animate-float-delayed" />
        
        <div className="mx-auto max-w-3xl space-y-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>Baked With Love</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-extrabold text-primary-dark dark:text-primary-soft"
          >
            Our Story & Journey
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-primary-dark/80 dark:text-primary-light/80 text-base md:text-lg max-w-xl mx-auto"
          >
            Discover the passion, values, and meticulous processes that make Aksha Cakes a luxury home baking experience.
          </motion.p>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-4" />
        </div>
      </section>

      {/* 2-Column Story Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Image mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-primary/10 bg-primary/5"
          >
            <Image
              src="/hero-cake.png"
              alt="Aksha Cakes Home Kitchen Baking"
              fill
              className="object-contain p-6 scale-95 hover:scale-100 transition-transform duration-500"
            />
          </motion.div>

          {/* Right Column: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-dark dark:text-primary-soft">
              How Aksha Cakes Began
            </h2>
            <p className="text-sm md:text-base text-primary-dark/85 dark:text-primary-light/85 leading-relaxed">
              Aksha Cakes started in a simple home kitchen with a single purpose: to bake premium, custom eggless cakes that stand on par with the world's best pastry houses. We realized how difficult it was to find truly rich, moist, and custom-styled vegetarian cakes for special family celebrations.
            </p>
            <p className="text-sm md:text-base text-primary-dark/85 dark:text-primary-light/85 leading-relaxed">
              What started as baking for friends and family soon transformed into a highly-rated home baking venture. Today, we specialize in luxury cakes, theme cupcakes, and customized treats, bringing happiness to hundreds of anniversary and birthday parties.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 py-1 italic font-serif text-primary text-md font-medium">
              &ldquo;We don't just bake cakes; we craft sweet memories. Each recipe is balanced to guarantee premium texture and authentic flavor.&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white/30 dark:bg-card-dark/20 py-16 border-y border-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl font-bold text-primary-dark dark:text-primary-soft">
              Our Core Pillars
            </h2>
            <p className="text-sm text-primary-dark/75 dark:text-primary-light/75 max-w-md mx-auto">
              Our kitchen operates on strict standards of quality, flavor, and purity.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Heart, label: "100% Eggless", desc: "Our baking is completely vegetarian. Absolutely no compromise on softness and luxury flavor." },
              { icon: ShieldCheck, label: "Pure Ingredients", desc: "No artificial chemicals, preservatives, or pre-made mixes. Everything is baked from scratch." },
              { icon: Award, label: "Premium Designs", desc: "Hand-sculpted details, custom characters, and elegant flower piping matching your event theme." },
              { icon: Flame, label: "Fresh Baking", desc: "We only bake on-order. Your cake is guaranteed to be fresh, moist, and cooling when delivered." }
            ].map((pillar) => (
              <motion.div
                key={pillar.label}
                variants={itemVariants}
                className="bg-white dark:bg-card-dark border border-primary/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center space-y-3"
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <pillar.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-bold text-primary-dark dark:text-primary-light">
                  {pillar.label}
                </h3>
                <p className="text-xs md:text-sm text-primary-dark/70 dark:text-primary-light/70 leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Baking Process Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="font-serif text-3xl font-bold text-primary-dark dark:text-primary-soft">
            Our Baking Process
          </h2>
          <p className="text-sm text-primary-dark/75 dark:text-primary-light/75 max-w-md mx-auto">
            From your consultation to the first bite, here is how we bake perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            { step: "01", title: "Design Consultation", desc: "You share your reference photos, theme, flavor preferences, and guest count. We advise on styling, weights, and pricing." },
            { step: "02", title: "Baking & Assembly", desc: "We bake the sponge fresh, layer it with gourmet ganache or fresh fruits, and coat it in premium smooth frosting." },
            { step: "03", title: "Delicate Hand Decorating", desc: "Handcrafted detailing, fondant modeling, and piping are completed hours before pick-up or midnight dispatch." }
          ].map((proc, index) => (
            <motion.div
              key={proc.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white/40 dark:bg-card-dark/40 border border-primary/10 rounded-2xl p-8 pt-12 shadow-sm"
            >
              {/* Step counter bubble */}
              <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-serif text-xl font-extrabold shadow-md">
                {proc.step}
              </div>
              <h3 className="font-serif text-lg font-bold text-primary-dark dark:text-primary-light mb-2">
                {proc.title}
              </h3>
              <p className="text-xs md:text-sm text-primary-dark/70 dark:text-primary-light/70 leading-relaxed">
                {proc.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
