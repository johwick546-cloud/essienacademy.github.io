document.addEventListener('DOMContentLoaded', () => {
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        particles: {
            color: { value: ["#ffffff", "#ffa500"] }, // white + orange
            links: {
                enable: true,
                color: "#ffa500",
                opacity: 0.4,
                distance: 150
            },
            move: {
                enable: true,
                speed: 1.5,
                outModes: "bounce"
            },
            number: {
                density: { enable: true, area: 800 },
                value: 80
            },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 5 } }
        },
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
                onClick: { enable: true, mode: "push" }
            }
        }
    });
});
