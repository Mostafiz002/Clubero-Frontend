import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxios from "../hooks/useAxios";
import ClubCard from "../components/shared/ClubCard";
import ballImg from "../assets/ball.webp";
import pcImg from "../assets/computer.webp";
import catImg from "../assets/cat.webp";
import musicImg from "../assets/music.webp";
import babyImg from "../assets/child.webp";
import starImg from "../assets/sparkle.webp";
import { PulseLoader } from "react-spinners";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Clubs = () => {
  const axios = useAxios();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [sort, setSort] = useState("");

  const { data: clubs = [] } = useQuery({
    queryKey: ["all-clubs", sort],
    queryFn: async () => {
      const res = await axios(`/clubs?sort=${sort}`);
      return res.data.data;
    },
  });

  const { data: searchResult = [clubs], isLoading } = useQuery({
    queryKey: ["search-clubs", search, sort],
    queryFn: async () => {
      const res = await axios(`/clubs?search=${search}&sort=${sort}`);
      return res.data.data;
    },
  });

  const filteredClubs = activeCategory
    ? searchResult.filter((club) => club.category === activeCategory)
    : searchResult;

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("");
  };

  const categories = [
    { category: "Sports", icon: ballImg },
    { category: "Technology", icon: pcImg },
    { category: "Parents & Family", icon: babyImg },
    { category: "Pets & Animals", icon: catImg },
    { category: "Music", icon: musicImg },
  ];

  const containerVars = {
    animate: { transition: { staggerChildren: 0.05 } },
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <div className="max-w-[1232px] mx-auto px-4 pt-20 pb-30">
      <div className="flex flex-col gap-5 md:flex-row justify-between items-center">
        <h2 className="heading relative">Discover All Clubs</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="select border-none shadow-none outline-none bg-accent text-white rounded-full w-fit pl-5"
        >
          <option value="">Sort</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="fee_low">Fee: Low to High</option>
          <option value="fee_high">Fee: High to Low</option>
        </select>
      </div>

      <div className="flex flex-col gap-5 md:flex-row items-center justify-between mt-6">
        <div className="flex flex-wrap gap-3 md:gap-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            className={`group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center`}
          >
            <img
              className="w-8 duration-200 group-hover:-translate-y-1"
              src={starImg}
              alt="icon"
            />
            <p
              className={`text-[12px] font-[Neusans-medium] mt-2 text-[#69696C]`}
            >
              All Clubs
            </p>
          </motion.button>

          {categories.map((cat) => (
            <motion.div
              key={cat.category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.category)}
              className={`group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                activeCategory === cat.category ? "scale-110" : ""
              }`}
            >
              <img
                className="w-8 duration-200 group-hover:-translate-y-1"
                src={cat.icon}
                alt="icon"
              />
              <p
                className={`text-[12px] font-[Neusans-medium] mt-2 ${
                  activeCategory === cat.category
                    ? "text-black"
                    : "text-[#69696C]"
                }`}
              >
                {cat.category}
              </p>
            </motion.div>
          ))}
        </div>

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
      ) : filteredClubs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <p className="text-lg text-gray-600 font-medium mb-4">
            No clubs found.
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
          layout // This makes the grid reorganize smoothly
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredClubs.map((club) => (
              <motion.div
                key={club._id}
                layout
                variants={itemVars}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ClubCard club={club} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Clubs;
