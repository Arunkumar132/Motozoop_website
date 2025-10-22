"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  _id: string;
  name: string;
  slug?: { current: string } | null;
};

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (!isOpen || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, { signal });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setResults(data.products || []);
      } catch (err: any) {
        if (err.name !== "AbortError") setError("Search failed.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Open search"
      >
        <Search className="w-5 h-5 text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div
                ref={overlayRef}
                className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products, categories, or brands"
                    className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-shop_dark_green/80"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded hover:bg-gray-200 transition"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  {loading && (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  {!loading && !error && results.length === 0 && query.length >= 2 && (
                    <p className="text-sm text-gray-500">No products found.</p>
                  )}

                  <ul className="divide-y divide-gray-200">
                    {results.map((p) => {
                      const href = p.slug?.current ? `/product/${p.slug.current}` : "#";
                      return (
                        <li key={p._id} className="hover:bg-gray-50 transition">
                          <Link
                            href={href}
                            className="flex items-center gap-4 p-4"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{p.name}</div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
