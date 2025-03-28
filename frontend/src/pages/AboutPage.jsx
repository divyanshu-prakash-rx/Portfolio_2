import React from "react";
import {
  Code,
  Server,
  Cpu,
  Globe,
  Award,
  Zap,
  Target,
  Layers
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const skills = [
    {
      category: "Engineering",
      icon: <Cpu className="w-8 h-8 text-emerald-500" />,
      items: ["Robotics", "Automation", "Mechatronics", "System Design"],
    },
    {
      category: "Computer Science",
      icon: <Code className="w-8 h-8 text-indigo-500" />,
      items: [
        "Algorithms",
        "Machine Learning",
        "OS & Networks",
        "Software Architecture",
      ],
    },
    {
      category: "Web Development",
      icon: <Globe className="w-8 h-8 text-blue-500" />,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          className="space-y-16"
          initial="hidden"
          animate="show"
          variants={containerAnimation}
        >
          {/* Intro Section */}
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text "
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Hey there, I'm Divyanshu
            </motion.h1>
            <motion.p
              className="text-2xl md:text-3xl font-semibold mb-8 text-gray-700"
              variants={itemAnimation}
            >
              Mechatronics Engineer & Computer Science Specialist
            </motion.p>
            <motion.p
              className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
              variants={itemAnimation}
            >
              Bridging the gap between mechanical engineering and computational intelligence at IIT Bhilai. I combine deep technical expertise in robotics, automation, and advanced computer science to create innovative, interdisciplinary solutions that push the boundaries of technology.
            </motion.p>
          </div>

          {/* Education Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl p-10"
            variants={itemAnimation}
          >
            <div className="flex items-center mb-8">
              <Award className="w-10 h-10 mr-4 text-orange-600" />
              <h2 className="text-4xl font-bold text-gray-800">Education</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="border-l-4 border-orange-500 pl-6"
                variants={itemAnimation}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  B.Tech in Mechatronics Engineering
                </h3>
                <p className="text-xl text-orange-600 font-semibold mb-2">
                  IIT Bhilai
                </p>
                <p className="text-gray-600 font-medium">
                  2022 - Present
                </p>
              </motion.div>

              <motion.div 
                className="border-l-4 border-indigo-500 pl-6"
                variants={itemAnimation}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Honours in Computer Science
                </h3>
                <p className="text-xl text-indigo-600 font-semibold mb-2">
                  IIT Bhilai
                </p>
                <p className="text-gray-600 font-medium">
                  2024 - Present
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <div>
            <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">
              My Technical Skills
            </h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerAnimation}
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  variants={itemAnimation}
                >
                  <div className="flex items-center mb-6">
                    {skill.icon}
                    <h3 className="text-2xl font-bold ml-4 text-gray-800">
                      {skill.category}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {skill.items.map((item, i) => (
                      <li 
                        key={i} 
                        className="flex items-center text-gray-700 text-lg"
                      >
                        <Zap className="w-5 h-5 mr-3 text-orange-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Key Strengths */}
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Key Strengths
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Target className="w-16 h-16 mx-auto mb-6 text-emerald-500" />
                <h4 className="text-2xl font-semibold mb-4 text-gray-800">
                  Precision
                </h4>
                <p className="text-gray-600">
                  Meticulous approach to problem-solving with attention to detail
                </p>
              </div>
              <div className="text-center">
                <Layers className="w-16 h-16 mx-auto mb-6 text-indigo-500" />
                <h4 className="text-2xl font-semibold mb-4 text-gray-800">
                  Versatility
                </h4>
                <p className="text-gray-600">
                  Ability to work across multiple domains and technologies
                </p>
              </div>
              <div className="text-center">
                <Zap className="w-16 h-16 mx-auto mb-6 text-orange-500" />
                <h4 className="text-2xl font-semibold mb-4 text-gray-800">
                  Innovation
                </h4>
                <p className="text-gray-600">
                  Creative problem-solving with cutting-edge technological solutions
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}