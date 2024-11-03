import React, { useState } from "react";
import outpass from "../images/outpass.jpg";
import Header from "../components/Header";
import { toast } from "react-toastify";
import axios from "axios";

export default function Outpass() {
  const [formData, setFormData] = useState({
    yearOfStudy: "",
    reason: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [letterId, setLettedId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      if (
        formData.yearOfStudy !== "1" &&
        formData.yearOfStudy !== "2" &&
        formData.yearOfStudy !== "3" &&
        formData.yearOfStudy !== "4"
      ) {
        toast.error("Invalid Year");
        return;
      }
      if (!formData.reason) {
        toast.error("Enter A Reason");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/letter/save/outpass",
        formData,
        { withCredentials: true }
      );
      console.log(response);

      if (response.statusText === "OK") {
        setIsSaved(true);
        setLettedId(response.data.data._id);
        setDownloadLink(response.data.data.letterLinkEmpty);
        toast.success("The letter Is saved");
      } else {
        toast.error("Failed to save the form data");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "Login failed";
        toast.error(errorMessage);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  const handleDownload = () => {
    // Implement download functionality here
    window.open(downloadLink);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSend = async () => {
    // const emailPattern = /^[a-zA-Z0-9._%+-]+@vnrvjiet\.in$/;
    // if (emailPattern.test(email)) {
    //   setEmailError("");
    // } else {
    //   setEmailError("Please enter a valid example@vnrvjiet.in email.");
    // }
    if (!isSaved) {
      toast.error("First Save the letter");
      return;
    }
    if (!letterId) {
      toast.error("Some Error Occured");
      return;
    }
    if (!email) {
      toast.error("Enter a email address");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/letter/sendMail",
        {
          facultyMail: email,
          letter: {
            _id: letterId,
          },
        },
        { withCredentials: true }
      );
      toast.success("Mail Sent Successful");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "Error Occurred";
        toast.error(errorMessage);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-around p-8 bg-gradient-to-b from-[#D9AFD9] to-[#97D9E1] min-h-screen">
        <div className="flex-1 flex justify-center items-start">
          <div className="max-w-[80%] m-2 border border-black bg-purple-600">
            <img
              src={outpass}
              alt="Letter example"
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="mt-6 p-4 bg-purple-500 text-white w-full max-w-lg">
            <h2 className="text-center text-2xl mb-4">OUTPASS FORM</h2>
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
              <div className="text-center">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-900 text-white"
                  disabled={isSaved}
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