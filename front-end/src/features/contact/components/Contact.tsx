import React, { useState } from "react";
import type { FormEvent } from "react";
import api, { baseURL } from "../../../lib/api"; 
import toast from "react-hot-toast";

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!name.trim()) {
    toast.error("Name is required");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Enter a valid email address");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    toast.error("Phone number must be exactly 10 digits");
    return;
  }

  if (!message.trim()) {
    toast.error("Message is required");
    return;
  }

  setLoading(true);

  const data = { name, email, phone, message };

  try {
    const res = await api.post(`${baseURL}/contact/`, data);
    toast.success(res.data.message);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  } catch (err: any) {
    console.error("Axios error:", err.response || err);
    toast.error(err.response?.data?.message || "Error sending message.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
    className="
    relative min-h-screen flex items-center justify-center
    py-12 px-4 sm:px-6 lg:px-8 bg-white
    bg-[url('assets/background.jpg'),url('assets/background.jpg')]
    bg-no-repeat
    [background-position:top_left,bottom_right]
    [background-size:400px_350px,400px_350px]
  "
>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gray-50 w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-lg shadow-black/20"
      >
        <div className="md:w-1/2 p-10 border-r border-gray-300">
          <h2 className="text-2xl font-bold text-[#91278F] mb-10">Contact Us</h2>

          <div className="mb-6">
            <label htmlFor="name" className="block text-sm text-gray-500 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border-b border-gray-400 py-2 text-gray-800 focus:border-[#91278F] focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm text-gray-500 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b border-gray-400 py-2 text-gray-800 focus:border-[#91278F] focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm text-gray-500 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-b border-gray-400 py-2 text-gray-800 focus:border-[#91278F] focus:outline-none"
            />
          </div>
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-between">
          <div>
            <label htmlFor="message" className="block text-sm text-gray-500 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder="Write your message here......."
              className="w-full border-b border-gray-400 py-2 text-gray-800 placeholder-gray-400 focus:border-[#91278F] focus:outline-none"
            ></textarea>
          </div>
          <div className="mt-6 text-right">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#91278F] text-white px-6 py-2 rounded hover:bg-[#7b1e77] transition"
            >
              {loading ? "Sending..." : "SUBMIT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
