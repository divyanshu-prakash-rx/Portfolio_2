import React, { useState } from "react";
import { ExternalLink, Github, Code, Server, Globe } from "lucide-react";

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
      icon: <Code className="w-10 h-10 text-green-500" />
    },
    
    {
      title: "Sci-Tech Website IIT Bhilai",
      description:
        "Comprehensive website for clubs at IIT Bhilai, enabling seamless club activities and real-time updates with intuitive user interface and robust backend infrastructure.",
      technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
      githubLink: "https://github.com/openlake-iitbh/sci-tech-website",
      liveLink: "https://sci-tech-website.vercel.app/",
      category:"Web Development",
      icon: <Server className="w-10 h-10 text-blue-500" />
    },
    {
      title: "Flamingo News",
      description:
        "Real-time news web application providing personalized and fast news content with intuitive user experience and responsive design.",
      technologies: ["React", "Node.js", "API", "Tailwind"],
      githubLink: "https://github.com/divyanshu-prakash-rx/FlamingoNews",
      liveLink: "https://flamingonews.onrender.com/",
      category: 'Web Development',
      icon: <Globe className="w-10 h-10 text-purple-500" />
    },
    {
      title: "TextCase Master",
      description:
        "Versatile web tool offering comprehensive text manipulation utilities and an online calculator with adaptive light/dark mode for enhanced user productivity.",
      technologies: ["React", "Node.js", "Express", "Tailwind"],
      githubLink: "https://github.com/divyanshu-prakash-rx/TextCase-Master",
      liveLink: "https://textcase-master.onrender.com/",
      category: "Web Development",
      icon: <Code className="w-10 h-10 text-indigo-500" />
    },
    {
      title: "Health Centre Website IIT Bhilai",
      description:
        "Innovative web portal for the health center with an intuitive Reimbursement Panel, streamlining online forms and enhancing operational efficiency.",
      technologies: ["React", "Bootstrap"],
      githubLink: "https://github.com/divyanshu-prakash-rx/IITBH_Health_centre_Reimbursement_website",
      liveLink: "https://iitbh-health-centre-reimbursement-website.onrender.com/",
      category: "Web Development",
      icon: <Server className="w-10 h-10 text-red-500" />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 mt-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">
            My Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A collection of innovative projects showcasing my skills in web development, machine learning, and creative problem-solving.
          </p>
        </div>

        <div className="flex justify-center mb-12 space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {project.icon}
                  <h3 className="text-xl font-bold ml-4 text-gray-800">{project.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 min-h-[100px]">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t pt-4 mt-4">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-700 hover:text-black transition-colors"
                  >
                    <Github className="mr-2" /> GitHub
                  </a>
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
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