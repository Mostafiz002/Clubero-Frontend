import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import EventCardV2 from "../../../components/shared/EventCardV2";
import { PulseLoader } from "react-spinners";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const MyEvents = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["my-events-member", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/myEvents?email=${user.email}`);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4"
    >
      <div className="relative inline-block mt-6">
        <h2 className="heading">
          My <span className="text-accent">events</span>
        </h2>
        <motion.span 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="inline-block absolute -top-3 -right-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 32 32"
            fill="none"
            className="text-[#ff4a79]"
          >
            <title>threeExclamativeLines scribble</title>
            <path d="M12.1196 6.29618C12.173 6.07811 12.1606 5.84323 12.066 5.63555C11.9715 5.42792 11.8051 5.26549 11.5989 5.18219C11.3926 5.09889 11.1601 5.10017 10.9479 5.18395C10.7356 5.26767 10.5635 5.42802 10.4506 5.62207C10.348 5.79868 10.2492 5.97677 10.154 6.15635C9.90245 6.63107 9.6766 7.11618 9.47647 7.61168C8.6818 9.57915 8.05727 11.6153 7.2626 13.5828C6.89469 14.4937 6.52138 15.4024 6.14266 16.309C6.06474 16.4955 5.98658 16.682 5.90819 16.8683C5.81562 17.0884 5.81747 17.336 5.91104 17.5558C6.00464 17.7757 6.18269 17.9498 6.40564 18.0399C6.62858 18.1299 6.87766 18.1283 7.09768 18.0351C7.31767 17.9419 7.49098 17.7651 7.5772 17.5424C7.65022 17.3539 7.72348 17.1655 7.79696 16.9772C8.15407 16.0619 8.51659 15.1488 8.8845 14.2379C9.67916 12.2704 10.644 10.3717 11.4386 8.40419C11.6387 7.90869 11.8132 7.4028 11.9619 6.88653C12.0181 6.69123 12.0707 6.49445 12.1196 6.29618Z" fill="currentColor" />
            <path d="M26.2331 22.886C26.4338 22.8091 26.6082 22.6669 26.714 22.4762C26.8198 22.2857 26.8489 22.0643 26.794 21.8577C26.7391 21.651 26.6041 21.4732 26.4177 21.3603C26.2312 21.2472 26.0093 21.2102 25.7968 21.243C25.5908 21.2749 25.386 21.3113 25.1823 21.3521C24.9013 21.4085 24.6226 21.4734 24.3461 21.5468C23.2393 21.8407 22.1567 22.226 21.0573 22.5475L21.1043 22.5366C20.905 22.5821 20.7053 22.6256 20.505 22.6661C19.1472 22.9408 17.7518 23.03 16.394 23.3047C15.6973 23.4457 15.0061 23.6134 14.3202 23.8078C14.1201 23.8646 13.9206 23.9235 13.7214 23.9848C13.5154 24.0484 13.3321 24.1798 13.2146 24.364C13.0971 24.5481 13.0546 24.768 13.0972 24.9783C13.1397 25.1886 13.2643 25.3747 13.4442 25.4987C13.624 25.6228 13.844 25.6726 14.0585 25.6511C14.2658 25.6301 14.4726 25.6069 14.679 25.5814C15.3865 25.4939 16.0886 25.3797 16.7853 25.2387C18.1431 24.964 19.4634 24.5039 20.8212 24.2292C21.0215 24.1886 21.2224 24.1511 21.4237 24.1155L21.4707 24.1046C22.5849 23.8383 23.7159 23.6358 24.8227 23.3419C25.0992 23.2685 25.3734 23.1866 25.6454 23.0961C25.8425 23.0306 26.0384 22.9605 26.2331 22.886Z" fill="currentColor" />
            <path d="M16.9444 16.2526C17.1923 16.1047 17.3037 15.8412 17.2936 15.5581C17.2831 15.2746 17.1449 14.988 16.9165 14.768C16.688 14.548 16.3964 14.4207 16.1127 14.4209C15.8294 14.4215 15.5703 14.5428 15.4318 14.796C15.3742 14.9009 15.3135 15.0027 15.2496 15.1014C15.0868 15.353 14.9035 15.5846 14.6995 15.7964C13.6954 16.8391 12.6302 17.8228 11.5956 18.8361C11.3549 19.072 11.1142 19.3079 10.8736 19.5438C10.7911 19.6246 10.7086 19.7055 10.6261 19.7864C10.427 19.9813 10.3163 20.2454 10.3216 20.524C10.3268 20.8023 10.4476 21.0722 10.6541 21.271C10.8605 21.4699 11.1348 21.5804 11.4131 21.575C11.6917 21.5699 11.9514 21.4493 12.1387 21.243C12.2164 21.1575 12.2941 21.0721 12.3718 20.9866C12.5985 20.7372 12.8251 20.4878 13.0517 20.2384C14.0253 19.1664 14.9682 18.0648 15.9723 17.0221C16.1763 16.8103 16.4009 16.6183 16.6461 16.4462C16.7423 16.3786 16.8418 16.3141 16.9444 16.2526Z" fill="currentColor" />
          </svg>
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {events.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-center mt-10"
          >
            You have not joined any events yet.
          </motion.p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid mt-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {events.map((event) => (
              <motion.div key={event._id} variants={itemVariants}>
                <EventCardV2 event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyEvents;