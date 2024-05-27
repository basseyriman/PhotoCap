"use client";

// Section for Imports
import OpenAI from "openai";
import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Sidebar, Sparkles } from "lucide-react";

// Section for Configuration
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Section for State and Form Handling
export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are a master caption generator for users who want to generate captions for their images.",
    },
  ]);
  const [caption, setCaption] = useState(
    "Generated caption would show up here..."
  );
  const [isCopied, setIsCopied] = useState(false); //New State for Copy Status

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setMessages((state) => [
      ...state,
      {
        role: "user",
        content: `Given the time of the day is ${data.time} and the location is ${data.location} where the colors in an image are given as ${data.colors}. Give a suitable caption for this image`,
      },
    ]);
  };

  // Section for Effects
  useEffect(() => {
    (async () => {
      const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-4",
      });
      console.log(completion.choices[0]);
      setCaption(() => completion.choices[0].message.content);
      setIsCopied(false); // Reset Copy Status When New Caption Is Generated
    })();
  }, [messages]);

  const handleCopy = () => {
    navigator.clipboard.writeText(caption).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); //Reset After Two Seconds
    });
  };

  // Section for JSX Return
  return (
    <main className="flex items-center justify-center flex-col w-full h-screen gap-5 bg-gray-900 text-gray-50">
      {/*Sidebar with the new text*/}
      <div className="absolute left-0 top-0 w-1/4 h-full bg-grey-900 bg-opacity-75 p-6 flex items-top-left justify-center">
        <p className="text-lg italic text-yellow-300">
          Stuck in thoughts about what caption to give your photos? No worries,{" "}
          <span className="font-bold">PhotoCap</span> has got you covered.
        </p>
      </div>

      {/* Image on top of the title */}
      <span className="flex items-center gape-3">
        <img
          src="https://images.pexels.com/photos/5638701/pexels-photo-5638701.jpeg"
          alt="PhotoCap Logo"
          className="flex items-center gap-1 h-80 mb-35"
        />
      </span>

      <span className="flex items-center gap-3">
        <Sparkles strokeWidth={1.5} size={28} />
        <h1 className="text-3xl font-bold">PhotoCap</h1>
      </span>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-sm text-gray-600 grid grid-cols-4 gap-5 border bg-gradient-to-br from-gray-900 to-gray-800 border-gray-300 rounded-lg px-5 py-6"
      >
        {/* Location input */}
        <div className="flex flex-col gap-1 w-full col-span-4">
          <label className="text-gray-50">
            Enter the place where the photo was taken
          </label>
          <input
            placeholder="London... Newcastle"
            type="text"
            {...register("location", { required: true })}
            className="border border-gray-300 p-2"
          />
        </div>

        {/* Colors input */}
        <div className="flex flex-col gap-1 w-full col-span-2">
          <label className="text-gray-50">
            Enter the colors of your outfit
          </label>
          <input
            placeholder="Red... Green... Yellow"
            type="text"
            {...register("colors", { required: true })}
            className="border border-gray-300 p-2"
          />
        </div>

        {/* Time of day */}
        <div className="flex flex-col gap-1 w-full col-span-2">
          <label className="text-gray-50">Time of day</label>
          <select
            {...register("time", { required: true })}
            defaultValue="day"
            className="p-2"
          >
            <option value="day">Day</option>
            <option value="dawn">Dawn</option>
            <option value="sunset">Sunset</option>
            <option value="midnight">Midnight</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-violet-500 col-span-4 text-gray-50 py-2 px-6 rounded-md shadow transition-all duration-300 ease-out hover:shadow-lg hover:bg-violet-600"
        >
          Generate caption
        </button>
      </form>

      {/*New button for copying caption*/}
      <button
        onClick={handleCopy}
        className="bg-green-500 text-grey-50 py-2 px-6 rounded-md shadow transition-all duration-300 ease-out hover:shadow-l hover:bg-green-600 mt-4"
      >
        {isCopied ? "Copied!" : "Copy Caption"}
      </button>

      <p>{caption}</p>
    </main>
  );
}
