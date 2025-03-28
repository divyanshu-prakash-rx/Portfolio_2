import React from "react";
import { Download, ArrowRight, Code, Brain, Globe, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text  mb-4">
            Divyanshu Prakash
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 mb-8">
            Developer | AI | ML | Web | Robotics
          </h2>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Bridging the worlds of mechatronics and computer science, I craft innovative solutions that blend cutting-edge technology with creative problem-solving.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6"
        >
          <a
            href="/projects"
            className="flex items-center justify-center bg-indigo-600 text-white px-8 py-4 rounded-full hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View Projects <ArrowRight className="ml-3" />
          </a>
          <a
            href="https://portfolio-backend-u1xt.onrender.com/static/resume.pdf"
            download
            className="flex items-center justify-center border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
          >
            <Download className="mr-3" /> Download CV
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105">
            <Code className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Web Development</h3>
            <p className="text-gray-600">
              Creating responsive and dynamic web applications using modern technologies
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105">
            <Brain className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Machine Learning</h3>
            <p className="text-gray-600">
              Developing intelligent systems and predictive models
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105">
            <Cpu className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Robotics</h3>
            <p className="text-gray-600">
              Designing innovative robotic solutions and automation systems
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}