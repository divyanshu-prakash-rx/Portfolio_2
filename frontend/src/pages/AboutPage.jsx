import React from "react";
import {
  Code,
  Server,
  Database,
  ChevronDown,
  Book,
  Cpu,
  Globe,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const skills = [
    {
      category: "Engineering",
      icon: <Cpu className="w-6 h-6" />,
      items: ["Robotics", "Automation", "Mechatronics", "System Design"],
    },
    {
      category: "Computer Science",
      icon: <Code className="w-6 h-6" />,
      items: [
        "Algorithms",
        "Machine Learning",
        "OS & Networks",
        "Software Architecture",
      ],
    },
    {
      category: "Web Development",
      icon: <Globe className="w-6 h-6" />,
      items: ["React", "HTML/CSS", "Node.js", "MongoDB"],
    },
  ];

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="space-y-12">
          {/* Intro Section */}
          <motion.div
            className="text-center"
            initial="hidden"
            animate="show"
            variants={containerAnimation}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 "
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Hello, I'm Divyanshu Prakash
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl font-semibold mb-8 text-gray-800"
              variants={itemAnimation}
            >
              Mechatronics Engineer & Computer Science Specialist
            </motion.p>
            <motion.p
              className="text-base text-gray-700 mb-8 max-w-2xl mx-auto"
              variants={itemAnimation}
            >
              I'm pursuing a unique dual qualification at IIT Bhilai: a B.Tech
              in Mechatronics, Robotics and Automation Engineering along with
              Honours in Computer Science and Engineering. This
              interdisciplinary combination allows me to bridge the gap between
              physical systems and computational intelligence. I leverage my
              understanding of mechanical systems, electronics, and advanced
              computer science concepts to develop innovative solutions that
              integrate hardware with sophisticated software systems.
            </motion.p>
            <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-black" />
          </motion.div>

          {/* Education Section */}
          <motion.div
            className="rounded-lg shadow-lg p-8 gradient-bg-light"
            variants={itemAnimation}
          >
            <div className="flex items-center mb-6">
              <Book className=" w-6 h-6 mr-2" />
              <h2 className="text-3xl font-bold text-black">Education</h2>
            </div>
            <div className="border-l-2 border-orange-600 pl-4 space-y-8">
              <motion.div variants={itemAnimation}>
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-black">
                    B.Tech in Mechatronics Engineering
                  </h3>
                  <Award className="w-5 h-5 ml-2 text-orange-600" />
                </div>
                <p className="text-orange-600 font-semibold text-lg">
                  IIT Bhilai
                </p>
                <p className="font-semibold text-base text-gray-600">
                  2022 - Present
                </p>
              </motion.div>

              <motion.div variants={itemAnimation}>
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-black">
                    Honours in Computer Science and Engineering
                  </h3>
                  <Award className="w-5 h-5 ml-2 text-orange-600" />
                </div>
                <p className="text-orange-600 font-semibold text-lg">
                  IIT Bhilai
                </p>
                <p className="font-semibold text-base text-gray-600">
                  2024 - Present
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-8">My Skills</h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 font-semibold text-lg mb-9"
              variants={containerAnimation}
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 gradient-bg-light text-gray-800 "
                  variants={itemAnimation}
                  whileHover={{ scale: 1.0005, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center mb-4">
                    <div>{skill.icon}</div>
                    <h3 className="text-xl font-bold ml-2">{skill.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {skill.items.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-2 bg-orange-600" />
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
