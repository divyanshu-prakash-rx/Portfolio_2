import React, { useState } from "react";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const projects = [
    {
      title: "Krishi AI: Precision Agriculture for Plant Health",
      description:
        "Built a plant disease detection system using YOLOv11 fine-tuned on a custom dataset, leveraging DFN (Deep Fusion Network) for enhanced feature extraction. Processed 26GB of plant data to ensure robust performance in diverse conditions, achieving 99.14% accuracy, closely matching state-of-the-art research (99.6%).",
      technologies: ["Python", "PyTorch", "YOLOv11"],
      githubLink: "https://github.com/Ayush-mishra-0-0/cs550",
      liveLink: "https://krishi-ai.onrender.com/model",
      category: "Machine Learning",
    },
    
    {
      title: "Sci-Tech Website IIT Bhilai",
      description:
        "Website for the clubs at IIT Bhilai, enabling seamless club activities and real-time updates",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      githubLink: "https://github.com/openlake-iitbh/sci-tech-website",
      liveLink: "https://sci-tech-website.vercel.app/",
      category:"Web Development",
    },
    {
      title: "Flamingo News",
      description:
        "Created a real-time news web app using React.js and NewsAPI, offering fast and personalized news content.",
      technologies: ["React", "Node.js", "Api", "Tailwind"],
      githubLink: "https://github.com/divyanshu-prakash-rx/FlamingoNews",
      liveLink: "https://flamingonews.onrender.com/",
        category: 'Web Development'
    },

    {
      title: "TextCase Master",
      description:
        "A versatile ReactJS website, TextCase Master, offering word manipulation tools and an online calculator with light/dark mode for daily tasks.",
      technologies: ["React", "Node.js", "Express", "Tailwind"],
      githubLink: "https://github.com/divyanshu-prakash-rx/TextCase-Master",
      liveLink: "https://textcase-master.onrender.com/",
      category: "Web Development",
    },
    {
      title: "Health Centre Website IIT Bhilai",
      description:
        "Web portal for the health center, featuring an intuitive Reimbursement Panel and streamlined online forms for enhanced user experience and operational efficiency.",
      technologies: ["React", "Bootstrap"],
      githubLink:
        "hhttps://github.com/divyanshu-prakash-rx/IITBH_Health_centre_Reimbursement_website",
      liveLink:
        "https://iitbh-health-centre-reimbursement-website.onrender.com/",
      category: "Web Development",
    },
  ];

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          My Projects
        </h2>

        <div className="flex justify-center mb-8 space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between mt-4">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-black"
                  >
                    <Github className="mr-2" /> GitHub
                  </a>
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Live Site <ExternalLink className="ml-2" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
