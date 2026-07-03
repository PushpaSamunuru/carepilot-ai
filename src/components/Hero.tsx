import { motion } from "framer-motion";
import { ActivitySquare, ArrowRight, PlayCircle } from "lucide-react";

interface HeroProps {
  onLaunchDemo: () => void;
  onSeeHowItWorks: () => void;
}

const NAV_LINKS = ["Product", "Features", "Dashboard", "Contact"];

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4";

export default function Hero({ onLaunchDemo, onSeeHowItWorks }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-base">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#010101]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.12),transparent_60%)]" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <ActivitySquare className="h-6 w-6 text-cyan-glow" />
          <span className="text-lg font-semibold tracking-tight text-white">
            CarePilot <span className="text-cyan-glow">AI</span>
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {link}
            </a>
          ))}
        </div>
        <button
          onClick={onLaunchDemo}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10 md:hidden"
        >
          Demo
        </button>
      </nav>

      <div className="relative z-10 flex h-[calc(100%-88px)] flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-cyan-glow backdrop-blur-sm"
        >
          Demo MVP · Administrative use only
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          AUTOMATE HEALTHCARE
          <br />
          <span className="bg-gradient-to-r from-cyan-glow to-emerald-glow bg-clip-text text-transparent">
            INTAKE WITH AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg"
        >
          CarePilot AI helps small healthcare teams capture patient
          information, summarize cases, track follow-ups, and reduce
          administrative workload.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={onLaunchDemo}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-glow to-emerald-glow px-7 py-3.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110"
          >
            Launch Demo
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={onSeeHowItWorks}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            <PlayCircle className="h-4 w-4" />
            See how it works
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs text-white/40">
        Scroll to explore
      </div>
    </section>
  );
}
