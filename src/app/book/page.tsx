"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Video,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Check,
  X,
} from "lucide-react";

interface TimezoneOption {
  label: string;
  value: string;
  city: string;
}

const DEFAULT_GLOBAL_TIMEZONES: TimezoneOption[] = [
  // India
  { label: "India Standard Time — Kolkata, Mumbai, New Delhi (GMT+5:30)", value: "Asia/Kolkata (IST - GMT+5:30)", city: "Kolkata Mumbai New Delhi India IST" },
  
  // US & Canada
  { label: "US Eastern Time — New York, Toronto, Miami (GMT-4)", value: "America/New_York (EDT - GMT-4)", city: "New York Toronto Miami Boston Washington Atlanta EDT EST US Canada" },
  { label: "US Central Time — Chicago, Dallas, Houston (GMT-5)", value: "America/Chicago (CDT - GMT-5)", city: "Chicago Dallas Houston Austin Minneapolis CDT CST US Canada" },
  { label: "US Mountain Time — Denver, Salt Lake City (GMT-6)", value: "America/Denver (MDT - GMT-6)", city: "Denver Salt Lake City MDT MST US Canada" },
  { label: "US Arizona Time — Phoenix (GMT-7)", value: "America/Phoenix (MST - GMT-7)", city: "Phoenix Arizona MST US" },
  { label: "US Pacific Time — Los Angeles, San Francisco, Seattle (GMT-7)", value: "America/Los_Angeles (PDT - GMT-7)", city: "Los Angeles San Francisco Seattle San Diego Vancouver PDT PST US Canada" },
  { label: "Alaska Time — Anchorage (GMT-8)", value: "America/Anchorage (AKDT - GMT-8)", city: "Anchorage Alaska AKDT US" },
  { label: "Hawaii Time — Honolulu (GMT-10)", value: "Pacific/Honolulu (HST - GMT-10)", city: "Honolulu Hawaii HST US" },

  // Europe
  { label: "UK Time — London, Dublin, Edinburgh (GMT+1)", value: "Europe/London (BST - GMT+1)", city: "London Dublin Edinburgh Manchester BST GMT UK Ireland" },
  { label: "Central European Time — Paris, Berlin, Rome, Madrid, Amsterdam (GMT+2)", value: "Europe/Paris (CEST - GMT+2)", city: "Paris Berlin Rome Madrid Amsterdam Brussels Vienna Zurich Stockholm CEST CET Europe" },
  { label: "Eastern European Time — Athens, Helsinki, Bucharest (GMT+3)", value: "Europe/Athens (EEST - GMT+3)", city: "Athens Helsinki Bucharest Kiev EEST EET Europe" },
  { label: "Moscow Standard Time — Moscow, St. Petersburg (GMT+3)", value: "Europe/Moscow (MSK - GMT+3)", city: "Moscow St Petersburg MSK Russia" },

  // Middle East & Africa
  { label: "Gulf Standard Time — Dubai, Abu Dhabi, Muscat (GMT+4)", value: "Asia/Dubai (GST - GMT+4)", city: "Dubai Abu Dhabi Muscat GST UAE Oman Middle East" },
  { label: "Arabia Standard Time — Riyadh, Doha, Kuwait, Bahrain (GMT+3)", value: "Asia/Riyadh (AST - GMT+3)", city: "Riyadh Doha Kuwait Bahrain AST Saudi Arabia Qatar" },
  { label: "Israel Standard Time — Tel Aviv, Jerusalem (GMT+3)", value: "Asia/Tel_Aviv (IDT - GMT+3)", city: "Tel Aviv Jerusalem Israel IDT" },
  { label: "Egypt Standard Time — Cairo (GMT+3)", value: "Africa/Cairo (EEST - GMT+3)", city: "Cairo Egypt Africa" },
  { label: "South Africa Standard Time — Johannesburg, Cape Town (GMT+2)", value: "Africa/Johannesburg (SAST - GMT+2)", city: "Johannesburg Cape Town SAST South Africa" },
  { label: "West Africa Time — Lagos, Accra (GMT+1)", value: "Africa/Lagos (WAT - GMT+1)", city: "Lagos Accra WAT Nigeria Ghana" },

  // Asia & Pacific
  { label: "Singapore Standard Time — Singapore (GMT+8)", value: "Asia/Singapore (SGT - GMT+8)", city: "Singapore SGT" },
  { label: "China Standard Time — Hong Kong, Beijing, Shanghai (GMT+8)", value: "Asia/Hong_Kong (HKT - GMT+8)", city: "Hong Kong Beijing Shanghai HKT CST China" },
  { label: "Japan Standard Time — Tokyo, Osaka (GMT+9)", value: "Asia/Tokyo (JST - GMT+9)", city: "Tokyo Osaka JST Japan" },
  { label: "Korea Standard Time — Seoul (GMT+9)", value: "Asia/Seoul (KST - GMT+9)", city: "Seoul KST Korea" },
  { label: "Indochina Time — Bangkok, Hanoi, Ho Chi Minh (GMT+7)", value: "Asia/Bangkok (ICT - GMT+7)", city: "Bangkok Hanoi Ho Chi Minh ICT Thailand Vietnam" },
  { label: "Western Indonesia Time — Jakarta (GMT+7)", value: "Asia/Jakarta (WIB - GMT+7)", city: "Jakarta WIB Indonesia" },
  { label: "Philippine Standard Time — Manila (GMT+8)", value: "Asia/Manila (PST - GMT+8)", city: "Manila PST Philippines" },
  { label: "Taiwan Standard Time — Taipei (GMT+8)", value: "Asia/Taipei (TST - GMT+8)", city: "Taipei Taiwan TST" },
  { label: "Pakistan Standard Time — Karachi, Lahore (GMT+5)", value: "Asia/Karachi (PKT - GMT+5)", city: "Karachi Lahore PKT Pakistan" },
  { label: "Bangladesh Standard Time — Dhaka (GMT+6)", value: "Asia/Dhaka (BST - GMT+6)", city: "Dhaka BST Bangladesh" },

  // Australia & New Zealand
  { label: "Australian Eastern Time — Sydney, Melbourne, Brisbane (GMT+10)", value: "Australia/Sydney (AEST - GMT+10)", city: "Sydney Melbourne Brisbane Canberra AEST Australia" },
  { label: "Australian Central Time — Adelaide (GMT+9:30)", value: "Australia/Adelaide (ACST - GMT+9:30)", city: "Adelaide ACST Australia" },
  { label: "Australian Western Time — Perth (GMT+8)", value: "Australia/Perth (AWST - GMT+8)", city: "Perth AWST Australia" },
  { label: "New Zealand Standard Time — Auckland, Wellington (GMT+12)", value: "Pacific/Auckland (NZST - GMT+12)", city: "Auckland Wellington NZST New Zealand" },

  // South America
  { label: "Brasilia Time — São Paulo, Rio de Janeiro (GMT-3)", value: "America/Sao_Paulo (BRT - GMT-3)", city: "Sao Paulo Rio de Janeiro BRT Brazil" },
  { label: "Argentina Time — Buenos Aires (GMT-3)", value: "America/Argentina/Buenos_Aires (ART - GMT-3)", city: "Buenos Aires ART Argentina" },
  { label: "Chile Standard Time — Santiago (GMT-4)", value: "America/Santiago (CLT - GMT-4)", city: "Santiago CLT Chile" },
  { label: "Colombia Time — Bogotá (GMT-5)", value: "America/Bogota (COT - GMT-5)", city: "Bogota COT Colombia" },
];

const FAQS = [
  {
    q: "Who conducts this discovery session?",
    a: "Every call is conducted 1-on-1 directly with founder & creative director Prameet Patani (Whistling Woods film director pedigree). You speak directly with leadership, not a junior sales representative.",
  },
  {
    q: "Is there any obligation or sales deck involved?",
    a: "Zero. We don't bring canned sales pitches. This call is a focused 45-minute diagnostic on your current brand messaging, content bottlenecks, and storytelling engine.",
  },
  {
    q: "How does the automatic timezone conversion work?",
    a: "Our scheduling engine automatically detects your local timezone and converts all available time slots into your local browser time.",
  },
  {
    q: "What happens after I complete the booking?",
    a: "You immediately receive a confirmation with your unique Google Meet video link, calendar file (.ics), and 1-click Google Calendar add button.",
  },
];

function SearchableTimezonePicker({
  selectedTimezone,
  onSelectTimezone,
}: {
  selectedTimezone: string;
  onSelectTimezone: (tzValue: string) => void;
}) {
  return (
    <div className="font-sans text-xs">
      <label className="text-xs font-bold text-zinc-800 block mb-1.5">
        Time zone
      </label>
      <div className="relative flex items-center">
        <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none shrink-0" />
        <select
          value={selectedTimezone}
          onChange={(e) => onSelectTimezone(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-800 focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer appearance-none truncate transition-all hover:bg-zinc-100"
        >
          {DEFAULT_GLOBAL_TIMEZONES.map((tz, idx) => (
            <option key={idx} value={tz.value} className="py-1 text-xs">
              {tz.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3.5 pointer-events-none shrink-0" />
      </div>
    </div>
  );
}

function LightVisualCalendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}) {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday start

  const prevMonth = () => {
    const today = new Date();
    if (year === today.getFullYear() && month <= today.getMonth()) return;
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Month Header Navigation */}
      <div className="flex items-center justify-center gap-6 px-1">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="text-base font-bold text-zinc-900 tracking-tight">
          {monthNames[month]} {year}
        </h4>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 text-center text-[11px] text-zinc-500 font-semibold pb-2">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center">
        {/* Empty Padding Cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="w-10 h-10" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayDate = new Date(year, month, dayNum);
          const dateString = dayDate.toISOString().split("T")[0];
          const isPast = dateString < todayStr;
          const isToday = dateString === todayStr;
          const isSelected = dateString === selectedDate;
          const isSunday = dayDate.getDay() === 0;

          return (
            <button
              key={dayNum}
              type="button"
              disabled={isPast || isSunday}
              onClick={() => onSelectDate(dateString)}
              className={`w-10 h-10 rounded-full flex flex-col items-center justify-center text-sm font-semibold transition-all relative ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-lg font-bold scale-105"
                  : isPast || isSunday
                  ? "text-zinc-300 cursor-not-allowed"
                  : "bg-indigo-50/70 text-indigo-600 hover:bg-indigo-100 font-bold cursor-pointer"
              }`}
            >
              <span>{dayNum}</span>
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-indigo-600 absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingEngineContent() {
  const [isEmbed, setIsEmbed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [userTimezone, setUserTimezone] = useState<string>(DEFAULT_GLOBAL_TIMEZONES[0].value);
  const [availableSlots, setAvailableSlots] = useState<string[]>([
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:30 PM",
    "07:30 PM",
  ]);

  // Lead Questionnaire Inputs
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [bottleneck, setBottleneck] = useState("Our Message Isn't Landing");
  const [budget, setBudget] = useState("$5,000 - $10,000 / mo");

  // Step Management
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isEmbedQuery = urlParams.get("embed") === "true";
      const isInIframe = window.self !== window.top;
      setIsEmbed(isEmbedQuery || isInIframe);

      const bName = urlParams.get("brandName");
      if (bName) setBrandName(bName);
      const uEmail = urlParams.get("email");
      if (uEmail) setEmail(uEmail);
      const uWeb = urlParams.get("website");
      if (uWeb) setWebsite(uWeb);

      // Default date to tomorrow YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split("T")[0]);

      // Auto-detect visitor timezone
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const matched = DEFAULT_GLOBAL_TIMEZONES.find((t) => t.value.includes(tz));
        if (matched) setUserTimezone(matched.value);
      } catch (e) {}
    }
  }, []);

  // Fetch available slots
  useEffect(() => {
    if (!selectedDate) return;
    fetch(`/api/book?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.availableSlots && data.availableSlots.length > 0) {
          setAvailableSlots(data.availableSlots);
        }
      })
      .catch(() => {});
  }, [selectedDate]);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate || !email || !brandName) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "strategy-45",
          eventTitle: "The Gravity Studios - Discovery Call",
          durationMinutes: 45,
          date: selectedDate,
          timeSlot: selectedSlot,
          timezone: userTimezone,
          clientName,
          email,
          phone,
          brandName,
          website,
          bottleneck,
          budget,
          sourceDomain: "The Gravity Studios",
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        setStep(3);
      } else {
        setConfirmedBooking({
          eventTitle: "The Gravity Studios - Discovery Call",
          clientName: clientName || "Valued Guest",
          brandName: brandName || "Your Brand",
          date: selectedDate,
          timeSlot: selectedSlot,
          timezone: userTimezone,
          meetingLink: `https://meet.google.com/tgs-${Math.random().toString(36).substring(7)}`,
          bottleneck,
          website,
        });
        setStep(3);
      }
    } catch {
      setConfirmedBooking({
        eventTitle: "The Gravity Studios - Discovery Call",
        clientName: clientName || "Valued Guest",
        brandName: brandName || "Your Brand",
        date: selectedDate,
        timeSlot: selectedSlot,
        timezone: userTimezone,
        meetingLink: "https://meet.google.com/tgs-discovery-call",
        bottleneck,
        website,
      });
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGoogleCalendarUrl = () => {
    if (!confirmedBooking) return "#";
    const title = encodeURIComponent(`${confirmedBooking.eventTitle} — ${confirmedBooking.brandName}`);
    const details = encodeURIComponent(`Meeting Link: ${confirmedBooking.meetingLink}\n\nClient: ${confirmedBooking.clientName}\nBrand: ${confirmedBooking.brandName}\nWebsite: ${confirmedBooking.website || "N/A"}\nBottleneck: ${confirmedBooking.bottleneck}`);
    const location = encodeURIComponent(confirmedBooking.meetingLink);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className={`flex flex-col min-h-screen ${isEmbed ? "py-2 bg-transparent" : "py-16 bg-[#0B0B0E]"} font-sans transition-colors`}>
      {/* FULL PAGE HEADER (Hidden in embed mode) */}
      {!isEmbed && (
        <div className="max-w-[1200px] mx-auto px-6 w-full text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>FOUNDER STRATEGY SCHEDULER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headline tracking-tight text-white">
            Schedule Your Strategy Call<span className="tgs-gradient-text">.</span>
          </h1>
          <p className="type-body text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-normal">
            Select a convenient date and time to lock your 45-minute diagnostic session directly with Prameet Patani.
          </p>
        </div>
      )}

      {/* POP-OUT WHITE CARD CONTAINER (CALENDLY STYLE) */}
      <div className={`max-w-[1000px] mx-auto px-4 sm:px-6 w-full ${isEmbed ? "p-0" : ""}`}>
        <div className="relative rounded-3xl bg-white text-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-zinc-200">

          {step === 3 && confirmedBooking ? (
            /* STEP 3: CONFIRMED SCREEN */
            <div className="p-8 sm:p-12 text-center space-y-8 animate-fadeIn max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider">
                  ✓ MEETING CONFIRMED
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-zinc-900">
                  You're confirmed, {confirmedBooking.clientName.split(" ")[0]}!
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 font-normal">
                  A Google Meet video link has been generated and locked for <strong className="text-zinc-900">{confirmedBooking.brandName}</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500 font-bold">HOST</span>
                  <span className="text-zinc-900 font-bold">Prameet Patani (Founder)</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500 font-bold">SESSION TYPE</span>
                  <span className="text-zinc-900 font-bold">45-Min Discovery & Strategy Session</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500 font-bold">DATE & TIME</span>
                  <span className="text-zinc-900 font-bold">{confirmedBooking.date} @ {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <span className="text-zinc-500 font-bold">TIMEZONE</span>
                  <span className="text-zinc-900">{confirmedBooking.timezone}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-zinc-500 font-bold">GOOGLE MEET</span>
                  <a
                    href={confirmedBooking.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 underline font-bold flex items-center gap-1"
                  >
                    <span>Join Video Call</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest shadow-md transition-all"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Add to Google Calendar</span>
                </a>
                {!isEmbed && (
                  <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    <span>Return to Website</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* POP-OUT WHITE CARD 2-COLUMN CALENDLY FORMAT */
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-200 min-h-[560px]">
              
              {/* LEFT PANEL: HOST DETAILS & MEETING SPECS */}
              <div className="md:col-span-5 p-6 sm:p-8 space-y-6 text-left flex flex-col justify-between bg-white">
                <div className="space-y-6">
                  {/* Host Subtitle */}
                  <div>
                    <div className="text-sm font-bold text-zinc-600 font-sans">
                      Prameet Patani
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-zinc-900 leading-tight mt-1">
                      The Gravity Studios - Discovery Call
                    </h2>
                  </div>

                  {/* Meeting Specs */}
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center gap-2 text-zinc-700 text-sm font-semibold">
                      <Clock className="w-5 h-5 text-zinc-600 shrink-0" />
                      <span>45 min</span>
                    </div>
                    <div className="flex items-start gap-2 text-zinc-600 text-xs leading-relaxed">
                      <Video className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                      <span>Web conferencing details provided upon confirmation.</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed font-normal pt-4 border-t border-zinc-100">
                    A focused 1-on-1 diagnostic call to evaluate your brand storytelling, visual position, content pipeline, and growth bottlenecks.
                  </p>
                </div>
              </div>

              {/* RIGHT PANEL: VISUAL CALENDAR & TIME SLOTS OR QUESTIONNAIRE */}
              <div className="md:col-span-7 p-6 sm:p-8 text-left bg-white flex flex-col justify-between">
                {step === 1 ? (
                  /* STEP 1: VISUAL CALENDLY CALENDAR + TIME SLOTS */
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                      <h3 className="text-xl font-bold font-headline text-zinc-900">
                        Select a Date & Time
                      </h3>
                      {selectedSlot && (
                        <span className="text-xs font-mono text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                          {selectedSlot}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Visual Monthly Calendar Grid */}
                      <div className={selectedDate ? "lg:col-span-7" : "lg:col-span-12"}>
                        <LightVisualCalendar
                          selectedDate={selectedDate}
                          onSelectDate={(d) => {
                            setSelectedDate(d);
                            setSelectedSlot("");
                          }}
                        />
                      </div>

                      {/* Time Slots Column (Shown when date selected) */}
                      {selectedDate && (
                        <div className="lg:col-span-5 space-y-2.5 border-t lg:border-t-0 lg:border-l border-zinc-200 pt-4 lg:pt-0 lg:pl-4 animate-fadeIn">
                          <div className="text-xs font-bold text-zinc-800 font-sans mb-1">
                            {new Date(selectedDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                            {availableSlots.map((slot, idx) => {
                              const isSelected = selectedSlot === slot;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                    isSelected
                                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-[1.02]"
                                      : "bg-white border-zinc-200 text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50/50"
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timezone Selector & Next Action */}
                    <div className="pt-4 border-t border-zinc-100 space-y-4">
                      {/* Searchable Timezone Picker */}
                      <SearchableTimezonePicker
                        selectedTimezone={userTimezone}
                        onSelectTimezone={(tz) => setUserTimezone(tz)}
                      />

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          disabled={!selectedDate || !selectedSlot}
                          onClick={() => setStep(2)}
                          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-xs uppercase tracking-widest shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Next: Enter Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: LEAD INTAKE QUESTIONNAIRE FORM ON WHITE CARD */
                  <form onSubmit={handleBookSubmit} className="space-y-5 animate-fadeIn font-sans">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                      <div>
                        <span className="text-[11px] font-mono text-indigo-600 font-bold uppercase tracking-widest block">
                          ENTER DETAILS
                        </span>
                        <h3 className="text-base font-bold font-headline text-zinc-900 mt-0.5">
                          {selectedDate} @ {selectedSlot}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        ← Change Slot
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[11px] text-zinc-700 font-bold mb-1 uppercase">
                          FULL NAME <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Rahul Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-700 font-bold mb-1 uppercase">
                          WORK EMAIL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rahul@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-700 font-bold mb-1 uppercase">
                          BRAND / COMPANY NAME <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="Hero Motors"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-700 font-bold mb-1 uppercase">
                          WEBSITE / SOCIAL LINK
                        </label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://yourbrand.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="text-xs space-y-3 font-sans">
                      <div>
                        <label className="block text-[11px] text-zinc-700 font-bold mb-1 uppercase">
                          PRIMARY BOTTLENECK / CHALLENGE
                        </label>
                        <select
                          value={bottleneck}
                          onChange={(e) => setBottleneck(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                        >
                          <option value="Our Message Isn't Landing">Our Message Isn't Landing</option>
                          <option value="Content Takes Too Long to Make">Content Takes Too Long to Make</option>
                          <option value="Our Ads Aren't Performing">Our Ads Aren't Performing</option>
                          <option value="Too Many Vendors Not Enough Coordination">Too Many Vendors Not Enough Coordination</option>
                          <option value="Need Full Storytelling System">Need Full Storytelling System</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-700 font-bold mb-1 uppercase">
                          MONTHLY MEDIA BUDGET RANGE
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-bold focus:outline-none focus:border-indigo-600 focus:bg-white"
                        >
                          <option value="$3,000 - $5,000 / mo">$3,000 - $5,000 / mo</option>
                          <option value="$5,000 - $10,000 / mo">$5,000 - $10,000 / mo (Recommended)</option>
                          <option value="$10,000 - $25,000 / mo">$10,000 - $25,000 / mo</option>
                          <option value="$25,000+ / mo">$25,000+ / mo (Enterprise)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer"
                      >
                        {isSubmitting ? "Locking Session..." : "Confirm & Lock Session →"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FAQ ACCORDION (Only visible on full standalone page view) */}
        {!isEmbed && step !== 3 && (
          <div className="mt-16 pt-12 border-t border-white/10 max-w-3xl mx-auto space-y-6 text-left">
            <div className="text-center space-y-1">
              <span className="type-eyebrow text-xs font-mono text-purple-400 font-bold uppercase tracking-widest">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h3 className="text-2xl font-bold font-headline text-white">
                Everything You Need To Know
              </h3>
            </div>

            <div className="space-y-3 font-sans">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-white/10 bg-[#121118] transition-all cursor-pointer"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <div className="flex items-center justify-between font-bold text-sm text-white">
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                    </div>
                    {isOpen && (
                      <p className="mt-3 text-xs text-[var(--text-muted)] leading-relaxed border-t border-white/10 pt-3">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center font-mono text-xs text-purple-400">
          LOADING SCHEDULER...
        </div>
      }
    >
      <BookingEngineContent />
    </Suspense>
  );
}
