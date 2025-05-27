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
        trigger: "#scroll-container-3",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onEnter: () => (video.style.opacity = "1"),
        onLeave: () => (video.style.opacity = "0"),
        onEnterBack: () => (video.style.opacity = "1"),
        onLeaveBack: () => (video.style.opacity = "0"),
      });

      // 🎞️ Sync video time with scroll
      video.addEventListener("loadedmetadata", () => {
        const duration = video.duration || 1;

        gsap.timeline({
          scrollTrigger: {
            trigger: "#scroll-container-3",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }).fromTo(
          video,
          { currentTime: 0 },
          { currentTime: duration, ease: "none" }
        );
      });

      // 🎬 Placa info cards fade in + out
      gsap.timeline({
        scrollTrigger: {
          trigger: "#placa-intro",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      })
        .fromTo(
          "#placa-cards",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
        )
        .to(
          "#placa-cards",
          { opacity: 0, scale: 0.8, duration: 1, ease: "power2.inOut" },
          "+=0.5"
        );
    };

    loadScrollTrigger();
  }, []);

  return (
    <>
      <section
        id="placa-intro"
        className="relative z-10 h-[300vh] flex flex-col items-center justify-center"
      >
        <h1 className="text-white text-4xl font-bold mb-12">
          Desliza para ver la Placa o Lámina.
        </h1>

        <div
          id="placa-cards"
          className="opacity-0 scale-95 transition duration-500 flex flex-col md:flex-row gap-6"
        >
          <div className="bg-white/90 rounded-xl p-6 text-black w-72 shadow-md">
            <h2 className="font-semibold text-lg mb-2">Espesores</h2>
            <p>Desde 1/32” hasta 3/16”</p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 text-black w-72 shadow-md">
            <h2 className="font-semibold text-lg mb-2">Formatos</h2>
            <p>4’x8’, 4’x10’, y especiales</p>
          </div>
          <div className="bg-white/90 rounded-xl p-6 text-black w-72 shadow-md">
            <h2 className="font-semibold text-lg mb-2">Aplicaciones</h2>
            <p>Cortes CNC, estructuras, recubrimientos</p>
          </div>
        </div>
      </section>

      <video
        ref={videoRef}
        muted
        preload="auto"
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-[-20] pointer-events-none"
        src="/renders/placa_lamina-opt.mp4"
      />
    </>
  );
}
