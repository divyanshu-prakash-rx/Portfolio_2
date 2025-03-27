import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [result, setResult] = useState("Send Message");
  const handleEmail = () => {
    window.location.href = "mailto:medivyanshu780@gmail.com";
  };
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
      setResult("Message Sent, Will get back to you soon!🤗");
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
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Contact Me</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                  type="submit"
                  className={`w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-lg transition-all duration-300 `}
                >
                  {result}
                </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Get in Touch</h3>
            <p className="text-gray-600 mb-6">
              I'm always open to discussing new projects, creative ideas, 
              or opportunities to be part of your vision.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="mr-4 text-blue-600" />
                <span className="text-gray-700">Chhatishgarh, India</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-4 text-blue-600" />
                <span className="text-gray-700">divyanshup@iitbhilai.ac.in</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Social Links</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.linkedin.com/in/divyanshu-prakash-rx/" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/divyanshu-prakash-rx" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  GitHub
                </a>
                <a 
                  href="https://x.com/DivyanshuPrak20" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}