"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

function Interview() {
  const {interviewId} = useParams();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-linear-to-br from-blue-50 via-white to-purple-100">

      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 md:p-10 transition-all duration-300 hover:shadow-2xl">

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Image */}
          <div className="flex justify-center group">
            <Image
              src="/Interview.png"
              alt="Interview"
              width={600}
              height={400}
              className="w-full max-w-md h-auto object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="space-y-5 text-center md:text-left">

            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Mock Interview
            </h2>

            <p className="text-gray-600">
              Practice smarter with AI. Get real-time feedback and improve your
              performance before your real interview.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link href={'/interview/' + interviewId + '/start'}>
              <Button className="group px-6 py-3 rounded-xl bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg flex items-center gap-2">
                Start Interview
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              </Link>

              <span className="text-sm text-gray-400">
                ⏱ Takes ~25 minutes
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />

        {/* Share Section */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">

          <h3 className="text-xl font-semibold text-center text-gray-800">
            Share Interview Link
          </h3>

          <p className="text-sm text-gray-500 text-center mt-1">
            Invite your friend to take this AI interview
          </p>

          <div className="mt-5 flex flex-col md:flex-row gap-3 max-w-xl mx-auto">

            {/* Input */}
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Button */}
            <Button className="group px-5 py-3 rounded-xl bg-purple-600 text-white transition-all duration-300 hover:bg-purple-700 hover:shadow-lg flex items-center justify-center gap-2">
              Send Link
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Interview;
