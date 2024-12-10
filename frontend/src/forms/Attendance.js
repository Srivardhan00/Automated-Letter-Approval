import React, { useState } from "react";
import Header from "../components/Header";

export default function Attendance() {
  const [formData, setFormData] = useState({
    yearOfStudy: "",
    subject: "",
    reason: "",
    additionalinfo: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Implement save functionality here
    setIsSaved(true);
  };

  const handleDownload = () => {
    // Implement download functionality here
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSend = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@vnrvjiet\.in$/;
    if (emailPattern.test(email)) {
      // Implement email sending functionality here
      setEmailError("");
    } else {
      setEmailError("Please enter a valid example@vnrvjiet.in email.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-around p-8 bg-gradient-to-b from-[#D9AFD9] to-[#97D9E1] min-h-screen">
        <div className="flex-1 flex justify-center items-start">
          <div className="max-w-[80%] m-2 border border-black bg-purple-600">
            <img
              src="/images/attendance.jpg"
              alt="Letter example image"
              className="object-contain w-full h-auto"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="mt-6 p-4 bg-purple-500 text-white w-full max-w-lg">
            <h2 className="text-center text-2xl mb-4">ATTENDANCE FORM</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Year of Study</label>
                <input
                  type="text"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="w-full p-2 bg-transparent border border-white text-white placeholder-white focus:outline-none focus:border-white"
                  placeholder="Year of Study"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-2 bg-transparent border border-white text-white placeholder-white focus:outline-none focus:border-white"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full p-2 bg-transparent border border-white text-white placeholder-white focus:outline-none focus:border-white"
                  placeholder="Reason"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Additional Info</label>
                <input
                  type="text"
                  name="additionalinfo"
                  value={formData.additionalinfo}
                  onChange={handleChange}
                  className="w-full p-2 bg-transparent border border-white text-white placeholder-white focus:outline-none focus:border-white"
                  placeholder="Add any extra info if needed"
                />
              </div>
              <div className="text-center">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-900 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full max-w-lg mt-4">
            <button
              onClick={handleDownload}
              className={`px-4 py-2 ${
                isSaved
                  ? "bg-purple-600 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white`}
              disabled={!isSaved}
            >
              Download
            </button>
          </div>

          <div className="flex items-center w-full max-w-lg mt-4">
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              className="flex-grow p-2 bg-transparent border border-black text-black placeholder-black focus:outline-none focus:border-black"
              placeholder="Enter a mail"
            />
            <button
              onClick={handleSend}
              className="ml-2 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-900 text-white"
            >
              Send
            </button>
          </div>

          {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
        </div>
      </div>
    </>
  );
}
