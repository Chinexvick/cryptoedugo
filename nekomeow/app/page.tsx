"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  Copy,
  ExternalLink,
  Globe,
  Lock,
  Menu,
  Rocket,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  CheckCircle2,
  FileCheck,
  MessageCircleMore,
  Wallet,
  BarChart3,
} from "lucide-react"
import { useMemo, useState } from "react"

const LOGO_SRC = "/images/nekomeow-logo.jpeg"

const project = {
  name: "NekoMeow",
  symbol: "NEKO",
  network: "BNB Chain",
  tagline: "The Next Wave of Utility in Crypto",
  description:
    "A community-driven crypto awareness project focused on education, adoption, ecosystem growth, and long-term utility.",
  contract: "0x2f9b40EE96F765E9F2962dB73e9F677f8e2DB00c",
  buyLink:
    "https://pancakeswap.finance/swap?outputCurrency=0x2f9b40EE96F765E9F2962dB73e9F677f8e2DB00c",
  chartLink:
    "https://dexscreener.com/bsc/0x2f9b40EE96F765E9F2962dB73e9F677f8e2DB00c",
  telegram: "https://t.me/NekoMeow_Group",
  twitter: "https://x.com/NekoMeowBNB",
  bscTx:
    "https://bscscan.com/token/0x2f9b40EE96F765E9F2962dB73e9F677f8e2DB00c",
  pinkLock: "https://www.pinksale.finance/pinklock/bsc/record/1490438",
}

const identifiedLinks = [
  {
    label: "Pastor Moses Agbor Mention 1",
    href: "https://x.com/i/status/2033499576611569951",
  },
  {
    label: "Pastor Moses Agbor Mention 2",
    href: "https://x.com/i/status/2031447699162018208",
  },
]

const stats = [
  { label: "Holders", value: "400+" },
  { label: "Market Cap Peak", value: "$27K" },
  { label: "Community Reach", value: "500+" },
  { label: "Network", value: "BNB Chain" },
]

const achievements = [
  {
    icon: TrendingUp,
    title: "$27K Market Cap",
    text: "Momentum has already started. This is not just an idea — there is visible traction.",
  },
  {
    icon: Users,
    title: "400+ Holders",
    text: "A growing base of holders already believe in the project and its direction.",
  },
  {
    icon: Lock,
    title: "1 Year Liquidity Lock",
    text: "Structured to build stronger confidence and make trust easier for new buyers.",
  },
  {
    icon: BadgeCheck,
    title: "Dexscreener Listed",
    text: "You can track the pair publicly and follow the market activity in real time.",
  },
]

const valueCards = [
  {
    icon: Globe,
    title: "Why This Matters",
    text: "You are not just buying a token. You are getting in early on a growing crypto movement with bigger ecosystem plans.",
  },
  {
    icon: Rocket,
    title: "Why People Join Early",
    text: "Early positioning matters in crypto. The earlier you see conviction, traction, and visibility, the stronger your advantage can be.",
  },
  {
    icon: Shield,
    title: "Why It Feels Stronger",
    text: "Public chart access, lock visibility, and on-chain records give you more confidence as you study the project.",
  },
]

const quickLinks = [
  { label: "Buy on PancakeSwap", href: project.buyLink },
  { label: "View Dexscreener Chart", href: project.chartLink },
  { label: "Join Telegram Community", href: project.telegram },
  { label: "Follow on X", href: project.twitter },
  { label: "View PinkLock Record", href: project.pinkLock },
  { label: "View on BscScan", href: project.bscTx },
]

const verificationCards = [
  {
    icon: FileCheck,
    title: "Ownership Renounced",
    text: "View the token contract on BscScan.",
    href: project.bscTx,
    button: "Open BscScan",
  },
  {
    icon: Lock,
    title: "PinkLock Record",
    text: "View the liquidity lock record shared for the project.",
    href: project.pinkLock,
    button: "Open PinkLock",
  },
  {
    icon: TrendingUp,
    title: "Live Market Chart",
    text: "Follow the pair, chart, liquidity, and token activity on Dexscreener.",
    href: project.chartLink,
    button: "Open Dexscreener",
  },
]

const roadmap = [
  {
    phase: "Phase 1 — Launch & Foundation",
    status: "Completed",
    items: [
      "Successful fair launch of NekoMeowBNB",
      "Built a growing community across WhatsApp ,X and Telegram",
      "Achieved listing on Dexscreener",
      "Reached a market cap of $27K",
      "Established a stable floor above $15K M.C",
      "Expanded to 400+ holders",
      "Locked liquidity for 1 year",
    ],
  },
  {
    phase: "Phase 2 — Growth & Expansion",
    status: "Ongoing",
    items: [
      "Establish liquidity pair pool with 50 Strategic Partner tokens",
      "Target $50K–$100K market cap growth",
      "Establish a stronger floor between $100k-$500k market cap",
      "Grow the community globally",
      "Strengthen brand presence across more social platforms",
      "Launch the official NekoMeow utility website",
    ],
  },
  {
    phase: "Phase 3 — Utility & Ecosystem Development",
    status: "Upcoming",
    items: [
      "Register with the cooperate affair commission of a number of nations",
      "Build partnerships across regions","Establish offices within those nations" ,
      "Expand ecosystem use cases and token relevance",
    ],
  },
  {
    phase: "Phase 4 — Product & Platform Launch",
    status: "Future",
    items: [
      "Launch a NekoMeow web/mobile application",
      "Sales of products and services inside the ecosystem",
      "Move from awareness into a utility-driven platform",
      "Position NekoMeow as a stronger community-powered crypto ecosystem",
    ],
  },
]

const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-1.5 text-sm text-yellow-200">
        <Sparkles className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{text}</p>
    </div>
  )
}

function GlowOrb({ className }: { className?: string }) {
  return <div className={cx("absolute rounded-full blur-3xl", className)} />
}

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-slate-300 transition hover:text-white"
    >
      {label}
    </a>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
      <div className="break-words text-xl font-black text-white sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 break-words text-[10px] uppercase tracking-[0.15em] text-slate-400 sm:text-xs">
        {label}
      </div>
    </div>
  )
}

function PrimaryButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 font-bold text-slate-950 shadow-[0_0_40px_rgba(250,204,21,0.25)] transition hover:-translate-y-0.5"
    >
      {children}
    </Link>
  )
}

function SecondaryButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
    >
      {children}
    </Link>
  )
}

function BlueButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-4 font-semibold text-blue-100 transition hover:bg-blue-500/20"
    >
      {children}
    </Link>
  )
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const year = useMemo(() => new Date().getFullYear(), [])

  const copyContract = async () => {
    try {
      await navigator.clipboard.writeText(project.contract)
      window.alert("Contract address copied")
    } catch (error) {
      console.error("Failed to copy contract:", error)
      window.alert("Unable to copy contract address")
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] text-white">
      <div className="relative isolate">
        <GlowOrb className="left-[-120px] top-[-80px] h-72 w-72 bg-yellow-400/20" />
        <GlowOrb className="right-[-100px] top-20 h-80 w-80 bg-blue-500/20" />
        <GlowOrb className="left-1/2 top-[420px] h-80 w-80 -translate-x-1/2 bg-cyan-400/10" />

        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className={cx(container, "flex items-center justify-between py-4")}>
            <Link href="#top" className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-yellow-400/30">
                <Image
                  src={LOGO_SRC}
                  alt="NekoMeow logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <div className="text-sm font-bold tracking-[0.25em] text-yellow-300">
                  NEKOMEOW
                </div>
                <div className="text-xs text-slate-400">
                  Utility-focused crypto awareness project
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <NavLink href="#about" label="About" />
              <NavLink href="#token-info" label="Token Info" />
              <NavLink href="#verification" label="Verification" />
              <NavLink href="#roadmap" label="Roadmap" />
              <NavLink href="#community" label="Community" />
              <BlueButton href={project.telegram}>Join Telegram</BlueButton>
            </nav>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-white/10 md:hidden">
              <div className={cx(container, "flex flex-col gap-4 py-4")}>
                <NavLink href="#about" label="About" onClick={() => setMobileMenuOpen(false)} />
                <NavLink
                  href="#token-info"
                  label="Token Info"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavLink
                  href="#verification"
                  label="Verification"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavLink
                  href="#roadmap"
                  label="Roadmap"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavLink
                  href="#community"
                  label="Community"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <BlueButton href={project.telegram}>Join Telegram</BlueButton>
              </div>
            </div>
          )}
        </header>

        <section
          id="top"
          className={cx(
            container,
            "grid gap-10 pb-20 pt-14 md:grid-cols-2 md:pb-28 md:pt-24"
          )}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex flex-col justify-center"
          >
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
              <Star className="h-4 w-4" />
              Built on {project.network}
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              You’re early to something{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                powerful
              </span>{" "}
              in crypto.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              NekoMeow is not just another token. It is a growing movement built
              around community, visibility, and real utility.
              <br />
              <br />
              Right now, you are seeing it early — before the next phase of growth.
              <br />
              <br />
              <span className="font-semibold text-yellow-300">
                The real question is simple: will you just watch, or will you position early?
              </span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PrimaryButton href={project.buyLink}>
                Buy NEKOMEOW Now <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton href={project.chartLink}>
                View Live Chart <ExternalLink className="h-4 w-4" />
              </SecondaryButton>
              <BlueButton href={project.telegram}>Join Telegram</BlueButton>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold text-yellow-300">
              You are still early. Position yourself before the next growth phase.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute h-[420px] w-[420px] rounded-full bg-gradient-to-r from-yellow-400/20 via-orange-400/10 to-blue-500/20 blur-3xl" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-500/10" />
              <div className="relative z-10 w-full max-w-md">
                <Image
                  src={LOGO_SRC}
                  alt="NekoMeow token logo"
                  width={700}
                  height={700}
                  className="h-auto w-full drop-shadow-[0_0_45px_rgba(59,130,246,0.35)]"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>

      <section id="about" className={cx(container, "py-20")}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            eyebrow="About NekoMeow"
            title="Why people are paying attention"
            text="NekoMeow is built for people who want more than hype. It is a community-driven crypto project focused on awareness, adoption, utility, and long-term ecosystem growth on BNB Chain."
          />
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {valueCards.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/8 to-white/5 p-6 shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 text-slate-950">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section id="token-info" className={cx(container, "py-8")}>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-orange-400/5 p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-200">
              <Rocket className="h-4 w-4" />
              Token Info
            </div>
            <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">
              Everything you need to act fast
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              If you want to study the project, buy the token, verify the contract,
              or watch the chart live, everything is here in one place.
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Contract Address
              </div>
              <div className="mt-3 break-all text-sm text-white sm:text-base">
                {project.contract}
              </div>
              <button
                type="button"
                onClick={copyContract}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
                Copy Contract
              </button>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
              <div className="mb-3 text-xs uppercase tracking-[0.25em] text-slate-400">
                Live Chart Access
              </div>
              <p className="text-sm leading-7 text-slate-300">
                Open the live Dexscreener page directly for the full real-time chart,
                price action, liquidity, and pair activity.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Link
                  href={project.chartLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div className="text-lg font-bold text-white">Open Live Chart</div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    View the pair directly on Dexscreener.
                  </p>
                </Link>

                <Link
                  href={project.buyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 text-slate-950">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div className="text-lg font-bold text-white">Buy NEKOMEOW Now</div>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Go straight to PancakeSwap and position early.
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-cyan-400/5 p-6 shadow-xl"
          >
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
              Quick Links
            </div>
            <div className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-100 transition hover:translate-x-1 hover:bg-white/10"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className={cx(container, "py-20")}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            eyebrow="Early Growth"
            title="Why buyers are taking this seriously"
            text="This is the kind of traction people look for when they are deciding whether to ignore a project or take a closer look."
          />
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {achievements.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-yellow-400/30 hover:bg-white/10"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 text-slate-950 shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section id="verification" className={cx(container, "py-20")}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            eyebrow="Verification"
            title="Public proof you can check yourself"
            text="Do not buy blind. Review the public records, chart visibility, and lock-related links yourself before you move."
          />
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {verificationCards.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {item.button} <ExternalLink className="h-4 w-4" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className={cx(container, "py-20")}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            eyebrow="Identified With"
            title="Mentions connected to Pastor Moses Agbor"
            text="These references were provided to show public identification connected to the project."
          />
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {identifiedLinks.map((item, index) => (
            <motion.div
              key={item.href}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-yellow-400/10 to-blue-500/10 p-6 shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 text-slate-950">
                <MessageCircleMore className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                IDENTIFIED WITH BY PASTOR MOSES AGBOR
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Open the reference post directly on X and review it yourself.
              </p>
              <Link
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {item.label} <ExternalLink className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="roadmap" className={cx(container, "relative py-20")}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            eyebrow="Roadmap"
            title="What comes next from here"
            text="This is where early attention can become bigger ecosystem growth. This roadmap shows where the project is heading and why early positioning can matter."
          />
        </motion.div>

        <div className="relative mt-14 space-y-6">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-yellow-400/50 via-blue-400/40 to-transparent md:block" />
          {roadmap.map((step, index) => (
            <motion.div
              key={step.phase}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 md:ml-10"
            >
              <div className="absolute -left-[3.15rem] top-8 hidden h-5 w-5 rounded-full border-4 border-slate-950 bg-gradient-to-br from-yellow-300 to-blue-500 md:block" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-black text-white">{step.phase}</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-slate-300">
                  {step.status}
                </span>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {step.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm leading-7 text-slate-200"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-yellow-300" />
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="community" className={cx(container, "py-20")}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-500/10 via-slate-900 to-yellow-400/10 p-8 md:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                  <Rocket className="h-4 w-4" />
                  Join the Movement
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Don’t just follow the conversation. Enter it early.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                  Join the community, watch the chart, verify the records, and make
                  your move while the project is still in an early growth phase.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={project.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:-translate-y-0.5"
                  >
                    Telegram Community <ExternalLink className="h-4 w-4" />
                  </Link>
                  <SecondaryButton href={project.twitter}>
                    Follow on X <ExternalLink className="h-4 w-4" />
                  </SecondaryButton>
                  <PrimaryButton href={project.buyLink}>
                    Buy NEKOMEOW <ArrowRight className="h-4 w-4" />
                  </PrimaryButton>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-xl">
                <div className="text-sm uppercase tracking-[0.25em] text-slate-400">
                  Official Access
                </div>
                <div className="mt-5 space-y-4">
                  {quickLinks.slice(0, 4).map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                    >
                      <span>{item.label}</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/70">
        <div
          className={cx(
            container,
            "flex flex-col gap-5 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between"
          )}
        >
          <div>
            <div className="font-semibold text-white">{project.name}</div>
            <div className="mt-1">Contract: {project.contract}</div>
            <div className="mt-1">
              © {year} {project.name}. All rights reserved.
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Built by{" "}
              <a
                href="https://www.kdevglobal.com/"
                target="_blank"
                rel="noreferrer"
                className="text-yellow-300 hover:underline"
              >
                KD Global
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={project.chartLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Chart
            </Link>
            <Link
              href={project.buyLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Buy
            </Link>
            <Link
              href={project.telegram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Telegram
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}