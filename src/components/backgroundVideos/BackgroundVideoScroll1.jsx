import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function BackgroundScrollVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const src = video?.currentSrc || video?.src;

    const loadScrollTrigger = async () => {
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      video.style.opacity = "0";

      // 🖼️ Show/hide video based on scroll position
      ScrollTrigger.create({
        trigger: "#scroll-container-1",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onEnter: () => (video.style.opacity = "1"),
        onLeave: () => (video.style.opacity = "0"),
        onEnterBack: () => (video.style.opacity = "1"),
        onLeaveBack: () => (video.style.opacity = "0"),
      });

      requestAnimationFrame(() => {
        const bounds = video.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) {
          video.style.opacity = "1";
        }
      });

      // 🎞️ Sync video time with scroll
      video.addEventListener("loadedmetadata", () => {
        const duration = video.duration || 1;

        gsap.timeline({
          scrollTrigger: {
            trigger: "#scroll-container-1",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }).fromTo(video, { currentTime: 0 }, { currentTime: duration, ease: "none" });
      });

      // 🎬 PTR Cuadrado cards fade in + out
      gsap.timeline({
        scrollTrigger: {
          trigger: "#cuadrado-intro",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      })
        .fromTo(
          "#cuadrado-cards",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
        )
        .to(
          "#cuadrado-cards",
          { opacity: 0, scale: 0.8, duration: 1, ease: "power2.inOut" },
          "+=0.5"
        );
    };

    loadScrollTrigger();
  }, []);

  return (
    <>
      <section
        id="cuadrado-intro"
        className="relative z-10 h-[250vh] flex flex-col items-center justify-center"
      >
        <h1 className="text-white text-4xl font-bold mb-12">
          Desliza para ver el PTR Cuadrado.
        </h1>

        <div
          id="cuadrado-cards"
          className="opacity-0 scale-95 transition duration-500 flex flex-col md:flex-row gap-6"
        >
          <div className="bg-white/90 rounded-xl p-6 text-black w-72 shadow-md">
            <h2 className="font-semibold text-lg mb-2">Peso por metro</h2>
            <p>Desde 2.75 kg/m hasta 12.3 kg/m</p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 text-black w-72 shadow-md">
            <h2 className="font-semibold text-lg mb-2">Medidas</h2>
            <p>20x20 mm hasta 100x100 mm</p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 text-black w-72 shadow-md">
            <h2 className="font-semibold text-lg mb-2">Usos comunes</h2>
            <p>Estructuras, herrería, muebles, marcos</p>
          </div>
        </div>
      </section>

      <video
        ref={videoRef}
        muted
        preload="auto"
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-[-20] pointer-events-none"
        src="/renders/video-opt.mp4"
      />
    </>
  );
}
