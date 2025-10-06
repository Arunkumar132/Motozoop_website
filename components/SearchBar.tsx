"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  imageUrl?: string | null;
  price?: number | null;
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

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Fetch results
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
      {/* Icon button */}
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-full hover:bg-gray-100">
        <Search className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/50" />
          <div
            ref={overlayRef}
            className="relative z-10 max-w-3xl w-full mx-auto mt-12 bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 outline-none p-2"
              />
              <button onClick={() => setIsOpen(false)} className="p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {loading && <p className="text-sm text-gray-500">Searching...</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {!loading && !error && results.length === 0 && query.length >= 2 && (
                <p className="text-sm text-gray-500">No products found.</p>
              )}

              <ul className="space-y-3">
                {results.map((p) => {
                  const href = p.slug?.current ? `/search/${p.slug.current}` : `/search/${p._id}`;
                  return (
                    <li key={p._id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <Link href={href} className="flex items-center gap-4" onClick={() => setIsOpen(false)}>
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                            IMG
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{p.name}</div>
                          {p.price && <div className="text-sm text-gray-500">₹{p.price}</div>}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
