import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { PulseLoader } from "react-spinners";
import { 
  HiOutlineUsers, 
  HiOutlineCalendar, 
  HiOutlineLibrary, 
  HiOutlineCurrencyDollar 
} from "react-icons/hi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
};

const ManagerOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data: overview = {}, isLoading } = useQuery({
    queryKey: ["manager-overview"],
    queryFn: async () => {
      const res = await axiosSecure("/dashboard/overview/manager");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PulseLoader color="#7a66d3" margin={2} size={13} />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Clubs",
      value: overview.totalClubs || 0,
      icon: <HiOutlineLibrary size={28} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Members",
      value: overview.totalMembers || 0,
      icon: <HiOutlineUsers size={28} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Events",
      value: overview.totalEvents || 0,
      icon: <HiOutlineCalendar size={28} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: overview.totalRevenue ? `$${overview.totalRevenue}` : "$0",
      icon: <HiOutlineCurrencyDollar size={28} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const hasChartData = overview.chartData && overview.chartData.length > 0;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 p-2"
    >
      <motion.div variants={cardVariants} className="relative">
        <h2 className="heading text-3xl font-bold">
          Manager <span className="text-accent">Dashboard</span>
          <span className="inline-block absolute -top-4 ml-2">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="text-[#ff4a79]">
              <path d="M12.1196 6.29618C12.173 6.07811 12.1606 5.84323 12.066 5.63555C11.9715 5.42792 11.8051 5.26549 11.5989 5.18219C11.3926 5.09889 11.1601 5.10017 10.9479 5.18395C10.7356 5.26767 10.5635 5.42802 10.4506 5.62207C10.348 5.79868 10.2492 5.97677 10.154 6.15635C9.90245 6.63107 9.6766 7.11618 9.47647 7.61168C8.6818 9.57915 8.05727 11.6153 7.2626 13.5828C6.89469 14.4937 6.52138 15.4024 6.14266 16.309C6.06474 16.4955 5.98658 16.682 5.90819 16.8683C5.81562 17.0884 5.81747 17.336 5.91104 17.5558C6.00464 17.7757 6.18269 17.9498 6.40564 18.0399C6.62858 18.1299 6.87766 18.1283 7.09768 18.0351C7.31767 17.9419 7.49098 17.7651 7.5772 17.5424C7.65022 17.3539 7.72348 17.1655 7.79696 16.9772C8.15407 16.0619 8.51659 15.1488 8.8845 14.2379C9.67916 12.2704 10.644 10.3717 11.4386 8.40419C11.6387 7.90869 11.8132 7.4028 11.9619 6.88653C12.0181 6.69123 12.0707 6.49445 12.1196 6.29618Z" fill="currentColor"/>
              <path d="M26.2331 22.886C26.4338 22.8091 26.6082 22.6669 26.714 22.4762C26.8198 22.2857 26.8489 22.0643 26.794 21.8577C26.7391 21.651 26.6041 21.4732 26.4177 21.3603C26.2312 21.2472 26.0093 21.2102 25.7968 21.243C25.5908 21.2749 25.386 21.3113 25.1823 21.3521C24.9013 21.4085 24.6226 21.4734 24.3461 21.5468C23.2393 21.8407 22.1567 22.226 21.0573 22.5475L21.1043 22.5366C20.905 22.5821 20.7053 22.6256 20.505 22.6661C19.1472 22.9408 17.7518 23.03 16.394 23.3047C15.6973 23.4457 15.0061 23.6134 14.3202 23.8078C14.1201 23.8646 13.9206 23.9235 13.7214 23.9848C13.5154 24.0484 13.3321 24.1798 13.2146 24.364C13.0971 24.5481 13.0546 24.768 13.0972 24.9783C13.1397 25.1886 13.2643 25.3747 13.4442 25.4987C13.624 25.6228 13.844 25.6726 14.0585 25.6511C14.2658 25.6301 14.4726 25.6069 14.679 25.5814C15.3865 25.4939 16.0886 25.3797 16.7853 25.2387C18.1431 24.964 19.4634 24.5039 20.8212 24.2292C21.0215 24.1886 21.2224 24.1511 21.4237 24.1155L21.4707 24.1046C22.5849 23.8383 23.7159 23.6358 24.8227 23.3419C25.0992 23.2685 25.3734 23.1866 25.6454 23.0961C25.8425 23.0306 26.0384 22.9605 26.2331 22.886Z" fill="currentColor"/>
            </svg>
          </span>
        </h2>
        <p className="text-gray-500 mt-2">Platform-wide performance and engagement metrics.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center gap-5"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 tracking-tight">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={cardVariants} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Revenue Analytics</h3>
          <div className="h-[300px] w-full">
            {hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7a66d3" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#7a66d3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#7a66d3" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                No revenue data available to display
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Member Growth</h3>
          <div className="h-[300px] w-full">
            {hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="members" radius={[6, 6, 0, 0]}>
                    {overview.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7a66d3' : '#ff4a79'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                No membership data available to display
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ManagerOverview;