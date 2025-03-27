import React from 'react';
import { Download, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Divyanshu Prakash
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-600 mb-6">
          Developer | AI | ML | Web | Robotics
          </h2>
        </div>

        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
        I am a developer who loves to code and build new things. I am a passionate learner and always ready to learn new technologies.
        </p>

        <div className="flex justify-center space-x-4">
          <a 
            href="/projects" 
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Projects <ArrowRight className="ml-2" />
          </a>
          <a 
            href="/resume.pdf" 
            download 
            className="flex items-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Download className="mr-2" /> Download CV
          </a>
        </div>
      </div>
    </div>
  );
}