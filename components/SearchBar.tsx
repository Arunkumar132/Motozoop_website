"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  image?: { asset: { _ref: string; _type: string }; } | null;
  imageUrl?: string | null;
  price?: number | null;
  slug?: { _type: string; current: string } | null;
};

// Make sure your API returns products with `imageUrl` already resolved
// or use Next/Image remote pattern to load from Sanity

export default function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll when overlay open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
      setError(null);
      setLoading(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close overlay on click outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!isOpen) return;
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Debounced search fetch
  useEffect(() => {
    if (!isOpen) return;
    if (query.trim().length < 2) {
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
        const encoded = encodeURIComponent(query.trim());
        const res = await fetch(`/api/search?query=${encoded}`, { signal });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Search failed: ${res.status} ${text}`);
        }

        const payload = await res.json();
        setResults(payload.products || []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
          setError("Search failed. Try again.");
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  return (
    <div className="relative">
      {/* Search icon in the tab bar */}
      <button
        aria-label="Open search"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/50" />

          <div
            ref={overlayRef}
            className="relative z-10 max-w-3xl w-full mx-auto mt-12 bg-white rounded-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 p-4">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products (min 2 chars)..."
                className="flex-1 outline-none text-base p-2"
                aria-label="Search products"
              />
              <button
                aria-label="Close search"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search results */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {loading && <p className="text-sm text-gray-500">Searching...</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
              {!loading && !error && query.trim().length >= 2 && results.length === 0 && (
                <p className="text-sm text-gray-500">No products found.</p>
              )}

              <ul className="space-y-3">
                {results.map((p) => {
                  const href = p.slug?.current ? `/product/${p.slug.current}` : `/product/${p._id}`;

                  return (
                    <li key={p._id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <Link
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4"
                      >
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                            IMG
                          </div>
                        )}

                        <div>
                          <div className="font-medium">{p.name}</div>
                          {typeof p.price !== "undefined" && p.price !== null && (
                            <div className="text-sm text-gray-500">₹{p.price}</div>
                          )}
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
