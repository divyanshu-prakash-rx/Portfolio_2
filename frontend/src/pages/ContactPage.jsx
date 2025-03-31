import React, { useState } from 'react';
import { Send, MapPin, Mail, Linkedin, Github, Twitter } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [result, setResult] = useState("Send Message");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "a13b954a-a702-47e1-8598-a7e1118f97e5");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Message Sent Successfully! 🚀");
      event.target.reset();
      setTimeout(() => {
        setResult("Send Another Message");
      }, 2500);
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-4 flex items-center justify-center mt-10">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Contact Form */}
          <div className=" p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
              Let's Connect
            </h2>
            <p className="text-gray-600 mb-8">
              Have Something to talk in mind? Drop me a message and I'll get back to you.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{result}</span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-indigo-600 text-white p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-6">Contact Information</h3>
            <p className="mb-8 text-indigo-100">
              Feel free to reach out through these channels. I'm always eager to explore new opportunities and collaborations.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <MapPin className="mr-4 w-6 h-6" />
                <span>Chhatishgarh, India</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-4 w-6 h-6" />
                <span>divyanshup@iitbhilai.ac.in</span>
              </div>
            </div>

            <div className="flex space-x-6">
              <a 
                href="https://www.linkedin.com/in/divyanshu-prakash-rx/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-indigo-200 transition duration-300 transform hover:scale-110"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="https://github.com/divyanshu-prakash-rx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-indigo-200 transition duration-300 transform hover:scale-110"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="https://x.com/DivyanshuPrak20" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-indigo-200 transition duration-300 transform hover:scale-110"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}