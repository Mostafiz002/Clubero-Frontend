import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  HiOutlinePlusCircle,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineBadgeCheck,
  HiOutlineUserGroup,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import useRole from "../hooks/useRole";
import useAxiosSecure from "../hooks/useAxiosSecure";
// import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const ClubCreatorProgram = () => {
  const axiosSecure = useAxiosSecure();
  // const { user } = useAuth();
  const { role } = useRole();
  const isPrivileged = role === "admin" || role === "club-manager";

const handleBecomeCM = () => {
  axiosSecure
    .patch(`/become-club-manager`)
    .then((res) => {
      console.log(res);

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    })
    .catch(() => {
      toast.error("Failed to submit application.");
    });
};

  const features = [
    {
      icon: <HiOutlinePlusCircle className="text-3xl text-emerald-500" />,
      title: "Create Your Own Club",
      description:
        "Found a brand new community. You define the niche, the name, and the rules of engagement.",
    },
    {
      icon: <HiOutlineCalendar className="text-3xl text-blue-500" />,
      title: "Host Global Events",
      description:
        "Organize workshops, meetups, or seminars. Our platform handles the registrations for you.",
    },
    {
      icon: <HiOutlineChartBar className="text-3xl text-purple-500" />,
      title: "Advanced Management",
      description:
        "Review member requests, manage registrations, and track club growth with our pro dashboard.",
    },
    {
      icon: <HiOutlineBadgeCheck className="text-3xl text-amber-500" />,
      title: "Official Recognition",
      description:
        "Gain a 'Manager' badge on your profile to build trust and authority within the ecosystem.",
    },
  ];

  const comparison = [
    "Full authority to create and lead new clubs",
    "Post, edit, and manage event schedules",
    "View and export member registration data",
    "Priority placement in 'Featured Clubs' section",
    "Direct communication broadcast to club members",
  ];

  return (
    <div className="min-h-screen bg-transparent py-12 px-4">
      <div className="max-w-[1232px] mx-auto ">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
          <div className="text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6"
            >
              <HiOutlineShieldCheck className="text-lg" /> Promotion Opportunity
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-slate-800 leading-tight"
            >
              Elevate Your <span className="text-accent">Influence</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg mt-6"
            >
              Transition from a participant to a leader. Build your legacy by
              creating spaces where people connect and grow.
            </motion.p>
          </div>
          {/* btn  */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="shrink-0"
          >
            <button
              onClick={handleBecomeCM}
              disabled={isPrivileged}
              className={`group relative inline-flex flex-col items-center gap-2 px-10 py-8 rounded-[2.5rem] transition-all duration-300 shadow-2xl 
                ${
                  isPrivileged
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                    : "bg-slate-900 hover:bg-accent cursor-pointer text-white shadow-slate-200"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-black text-xl">Apply for Manager</span>
                <FiArrowRight className="text-2xl group-hover:translate-x-2 transition-transform" />
              </div>
              <span className="text-slate-400 group-hover:text-white/80 text-xs font-bold uppercase tracking-widest">
                Start Application Process
              </span>
            </button>
          </motion.div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-accent/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 bg-slate-50 rounded-[3rem] p-8 md:p-16 border border-slate-200/60">
          <div>
            <div className="flex items-center gap-3 mb-4 text-accent">
              <HiOutlineTrendingUp className="text-2xl" />
              <span className="font-black uppercase tracking-widest text-sm">
                Why Lead?
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-6">
              Manager-Only Privileges
            </h2>
            <p className="text-slate-600 mb-8 font-medium">
              As a Club Manager, you are the architect of community. You get the
              tools to foster engagement and the platform to showcase your
              expertise.
            </p>
            <ul className="space-y-4">
              {comparison.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 text-slate-700 font-bold text-sm"
                >
                  <div className="shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white">
                    <FiCheck />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="aspect-square bg-white rounded-3xl shadow-2xl p-8 flex flex-col justify-center border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-slate-100 rounded animate-pulse"></div>
                  <div className="w-24 h-3 bg-slate-50 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-full h-12 bg-accent/5 rounded-xl border border-dashed border-accent/30 flex items-center px-4 text-accent font-bold text-sm">
                  <HiOutlinePlusCircle className="mr-2" /> Create New Club...
                </div>
                <div className="w-full h-12 bg-blue-50 rounded-xl flex items-center px-4 text-blue-600 font-bold text-sm">
                  <HiOutlineCalendar className="mr-2" /> Schedule Event
                </div>
                <div className="w-full h-12 bg-slate-50 rounded-xl flex items-center px-4 text-slate-400 font-bold text-sm">
                  <HiOutlineUserGroup className="mr-2" /> Member Directory
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-accent text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">
                New Capability
              </p>
              <p className="text-lg font-black">Analytics Dashboard</p>
            </div>
          </div>
        </div>

        <footer className="text-center text-slate-400 text-sm font-medium italic">
          * Requests are reviewed by our community team within 48 hours.
        </footer>
      </div>
    </div>
  );
};

export default ClubCreatorProgram;
