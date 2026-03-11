"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const ZALO_URL = "https://zalo.me/0961876281";
const ZALO_LOGO = "https://logowik.com/content/uploads/images/t_zalo-video-call-new-20219013.jpg";

export default function ChatSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest(".chat-support-widget")) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="chat-support-widget fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] transition-opacity duration-200">
          <a
            href={ZALO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <Image src={ZALO_LOGO} alt="Zalo" width={32} height={32} className="w-8 h-8 object-contain rounded" />
            <span className="text-sm font-medium text-dark">Liên hệ Zalo</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors"
        aria-label="Liên hệ hỗ trợ"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span className="font-medium text-sm">Liên hệ</span>
      </button>
    </div>
  );
}
