const heroPainting = new URL("../assets/hero-painting.jpg", import.meta.url).href;

type ProjectItem = {
  title: string;
  description: string;
};

const projectItems: ProjectItem[] = [
  {
    title: "Test Project 1",
    description:
      "AI-assisted product visuals, layout storytelling, and interaction concepts crafted for modern digital campaigns.",
  },
  {
    title: "Test Project 2",
    description:
      "A visual language system balancing sharp typography, practical UI blocks, and playful editorial image composition.",
  },
  {
    title: "Test Project 3",
    description:
      "Brand-forward portfolio concept with conversion-ready cards, compact summaries, and mobile-first readability.",
  },
  {
    title: "Test Project 4",
    description:
      "Experimental design direction mixing crafted gradients, studio-inspired contrast, and polished micro interactions.",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative px-4 pb-16 pt-5 sm:px-6 md:px-8 lg:pb-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <h2 className="text-center text-[2.05rem] font-black tracking-tight text-white sm:text-[2.5rem]">Projects</h2>

        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:mt-8">
          {projectItems.map((project) => (
            <article
              key={project.title}
              className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(66,66,66,0.82),rgba(36,36,36,0.9))] p-3 text-white shadow-[0_24px_40px_rgba(0,0,0,0.36)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="h-[138px] overflow-hidden rounded-[17px] border border-white/10 sm:h-[166px]">
                <img
                  src={heroPainting}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-[1.9rem] font-black tracking-tight sm:text-[2.05rem]">{project.title}</h3>
              <p className="mt-2 max-w-[96%] text-sm leading-relaxed text-white/72 sm:text-[0.95rem]">{project.description}</p>
            </article>
          ))}
        </div>

        <a
          href="#"
          className="mx-auto mt-10 block w-fit text-lg font-bold text-white/90 transition-colors duration-300 hover:text-white"
        >
          View More
        </a>
      </div>
    </section>
  );
};

export default ProjectsSection;
