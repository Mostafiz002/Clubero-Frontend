import React, { useState } from "react";
import useAxios from "../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import EventCard from "../components/shared/EventCard";
import { PulseLoader } from "react-spinners";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Events = () => {
  const axios = useAxios();
  const [search, setSearch] = useState("");

  const { data: events = [] } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const res = await axios("/events");
      return res.data.data;
    },
  });

  const { data: searchResult = events, isLoading } = useQuery({
    queryKey: ["search-events", search],
    queryFn: async () => {
      const res = await axios(`/events?search=${search}`);
      return res.data.data;
    },
  });

  const resetFilters = () => {
    setSearch("");
  };

  const containerVars = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.08 } 
    }
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="max-w-[1232px] mx-auto px-4 pt-20 pb-30">
      <h2 className="heading relative">Discover All Events</h2>
      <div className="flex items-center justify-between mt-6">
        {/* search */}
        <form className="input rounded-full bg-transparent outline-none hover:border-black/40 focus:border-black/40">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            required
            placeholder="Search"
          />
        </form>
      </div>

      <div className="divider mb-6"></div>

      {isLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center pb-24 md:pb-44 pt-24"
        >
          <PulseLoader color="#7a66d3" margin={2} size={13} />
        </motion.div>
      ) : searchResult.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <p className="text-lg text-gray-600 font-medium mb-4">
            No events found.
          </p>
          <button
            onClick={resetFilters}
            className="btn rounded-lg border border-black/20 hover:bg-black hover:text-white transition-all"
          >
            Load All
          </button>
        </motion.div>
      ) : (
        <motion.div 
          layout // Enables smooth grid reorganization
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {searchResult.map((event) => (
              <motion.div
                key={event._id}
                layout
                variants={itemVars}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Events;