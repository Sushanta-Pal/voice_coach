import React from "react";

const TestimonialSection = () => {
  // Data for the testimonial cards
  const cardsData = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@neilstellar",
      date: "April 20, 2025",
      feedback:
        "VoiceCoach was a game-changer for my final rounds. The AI feedback on my speech clarity was incredibly detailed and helped me land the offer.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averywrites",
      date: "May 10, 2025",
      feedback:
        "The technical mock interviews were tougher than the real thing! I felt so much more prepared and confident going into my on-site interviews.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordantalks",
      date: "June 5, 2025",
      feedback:
        "I used to be so nervous about presenting my portfolio. Practicing with VoiceCoach helped me calm my nerves and communicate my design decisions effectively.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Casey Garcia",
      handle: "@casey_codes",
      date: "July 1, 2025",
      feedback:
        "The progress dashboard is fantastic. Seeing my average score improve over time was a huge motivator.",
    },
  ];

  // Sub-component to create a single testimonial card
  const CreateCard = ({ card }) => (
    <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 border bg-white dark:bg-slate-900">
      <div className="flex gap-2">
        <img
          className="size-11 rounded-full object-cover"
          src={card.image}
          alt={`${card.name}'s profile picture`}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {card.name}
            </p>
            <svg
              className="mt-0.5"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
                fill="#2196F3"
              />
            </svg>
          </div>
          <span className="text-xs text-slate-500">{card.handle}</span>
        </div>
      </div>
      <p className="text-sm py-4 text-gray-700 dark:text-gray-300">
        "{card.feedback}"
      </p>
      <div className="flex items-center justify-between text-slate-500 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <span>Posted on</span>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500"
          >
            <svg
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <p>{card.date}</p>
      </div>
    </div>
  );

  return (
    <section
      id="testimonials"
      className="w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-950/50"
    >
      {/* CSS for the marquee animation */}
      <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-inner {
                    animation: marqueeScroll 30s linear infinite;
                }
                .marquee-reverse .marquee-inner {
                    animation-direction: reverse;
                }
                .marquee-row:hover .marquee-inner {
                    animation-play-state: paused;
                }
            `}</style>

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Loved by Professionals
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Hear what our users have to say about their success.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative flex flex-col gap-y-4 overflow-hidden">
        {/* Fading overlays for the edges */}
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950/50"></div>
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950/50"></div>

        {/* First Row */}
        <div className="marquee-row w-full">
          <div className="marquee-inner flex transform-gpu min-w-max">
            {[...cardsData, ...cardsData].map((card, index) => (
              <CreateCard key={`row1-${index}`} card={card} />
            ))}
          </div>
        </div>

        {/* Second Row (Reversed) */}
        <div className="marquee-row marquee-reverse w-full">
          <div className="marquee-inner flex transform-gpu min-w-max">
            {[
              ...cardsData.slice().reverse(),
              ...cardsData.slice().reverse(),
            ].map((card, index) => (
              <CreateCard key={`row2-${index}`} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
