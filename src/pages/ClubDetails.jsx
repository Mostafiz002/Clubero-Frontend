import React from "react";
import useAxios from "../hooks/useAxios";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MdCategory } from "react-icons/md";
import { FaMoneyBillWave, FaUsers } from "react-icons/fa";
import { AiFillCheckCircle } from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { PulseLoader } from "react-spinners";
import useRole from "../hooks/useRole";

const ClubDetails = () => {
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useRole()
  console.log(role)

  //single club data
  const { data: club = [], isLoading } = useQuery({
    queryKey: ["club"],
    queryFn: async () => {
      const res = await axios(`/clubs/${id}`);
      return res.data.data;
    },
  });

  //payment data
  const { data: payment = null, isLoading: paymentLoading } = useQuery({
    queryKey: ["single-payment", user?.email, club?._id],
    enabled: !!user?.email && !!club?._id,
    queryFn: async () => {
      const res = await axiosSecure(
        `/payments/email/club?email=${user.email}&clubId=${club._id}`
      );
      return res.data.data;
    },
  });
  const isJoined = !!payment;

  const handlePayment = () => {
    //check login
    if (!user) {
      navigate("/login", { state: location.pathname });
      return;
    }

    const paymentInfo = {
      membershipFee: club.membershipFee,
      clubId: club._id,
      clubName: club.clubName,
      email: user.email,
    };

    const membership = {
      clubId: club._id,
      clubName: club.clubName,
      email: user.email,
    };

    Swal.fire({
      title: "Proceed to Payment?",
      html: `
    <p class="text-sm text-gray-700">
      You are about to pay the membership fee for <b>${paymentInfo.clubName}</b>.
    </p>
    <p class="mt-1 text-accent font-semibold text-lg">
      Fee: ${paymentInfo.membershipFee} BDT
    </p>
  `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Continue",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      color: "#333",
      customClass: {
        popup: "rounded-2xl shadow-xl p-4",
        confirmButton:
          "bg-accent text-white px-5 py-2 rounded-lg shadow-md cursor-pointer mr-2",
        cancelButton:
          "bg-gray-200 text-gray-700 px-5 py-2 rounded-lg cursor-pointer",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (paymentInfo.membershipFee === 0) {
            axiosSecure.post("/membership", membership).then(() => {
              navigate("/dashboard/my-clubs");
            });
          } else {
            const res = await axiosSecure.post(
              "/payment-checkout-session",
              paymentInfo
            );
            window.location.assign(res.data.data.url);
          }
        } catch {
          Swal.fire({
            icon: "error",
            title: "Payment Error",
            text: "Something went wrong. Please try again.",
            confirmButtonColor: "#ff4a79",
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PulseLoader color="#7a66d3" margin={2} size={13} />
      </div>
    );
  }

  return (
    <div className="max-w-[1232px] mx-auto px-4 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-12">
      {/* left section */}
      <div className="lg:col-span-3 space-y-8">
        <h2 className="heading md:text-[44px]!  relative">{club.clubName}</h2>
        {/* Manager Card */}
        <div className="flex items-center gap-4">
          <figure className="relative">
            <img
              src={club?.managerImage}
              alt="manager"
              className="w-11 h-11 rounded-full object-cover border border-black/10"
            />
            <span className="inline-block absolute  -left-7 top-6 rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 32 32"
                fill="none"
                class="injected-svg text-accent __web-inspector-hide-shortcut__"
                data-src="https://secure.meetupstatic.com/next/images/scribbles/three-exclamative-lines.svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>threeExclamativeLines scribble</title>
                <path
                  d="M12.1196 6.29618C12.173 6.07811 12.1606 5.84323 12.066 5.63555C11.9715 5.42792 11.8051 5.26549 11.5989 5.18219C11.3926 5.09889 11.1601 5.10017 10.9479 5.18395C10.7356 5.26767 10.5635 5.42802 10.4506 5.62207C10.348 5.79868 10.2492 5.97677 10.154 6.15635C9.90245 6.63107 9.6766 7.11618 9.47647 7.61168C8.6818 9.57915 8.05727 11.6153 7.2626 13.5828C6.89469 14.4937 6.52138 15.4024 6.14266 16.309C6.06474 16.4955 5.98658 16.682 5.90819 16.8683C5.81562 17.0884 5.81747 17.336 5.91104 17.5558C6.00464 17.7757 6.18269 17.9498 6.40564 18.0399C6.62858 18.1299 6.87766 18.1283 7.09768 18.0351C7.31767 17.9419 7.49098 17.7651 7.5772 17.5424C7.65022 17.3539 7.72348 17.1655 7.79696 16.9772C8.15407 16.0619 8.51659 15.1488 8.8845 14.2379C9.67916 12.2704 10.644 10.3717 11.4386 8.40419C11.6387 7.90869 11.8132 7.4028 11.9619 6.88653C12.0181 6.69123 12.0707 6.49445 12.1196 6.29618Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M26.2331 22.886C26.4338 22.8091 26.6082 22.6669 26.714 22.4762C26.8198 22.2857 26.8489 22.0643 26.794 21.8577C26.7391 21.651 26.6041 21.4732 26.4177 21.3603C26.2312 21.2472 26.0093 21.2102 25.7968 21.243C25.5908 21.2749 25.386 21.3113 25.1823 21.3521C24.9013 21.4085 24.6226 21.4734 24.3461 21.5468C23.2393 21.8407 22.1567 22.226 21.0573 22.5475L21.1043 22.5366C20.905 22.5821 20.7053 22.6256 20.505 22.6661C19.1472 22.9408 17.7518 23.03 16.394 23.3047C15.6973 23.4457 15.0061 23.6134 14.3202 23.8078C14.1201 23.8646 13.9206 23.9235 13.7214 23.9848C13.5154 24.0484 13.3321 24.1798 13.2146 24.364C13.0971 24.5481 13.0546 24.768 13.0972 24.9783C13.1397 25.1886 13.2643 25.3747 13.4442 25.4987C13.624 25.6228 13.844 25.6726 14.0585 25.6511C14.2658 25.6301 14.4726 25.6069 14.679 25.5814C15.3865 25.4939 16.0886 25.3797 16.7853 25.2387C18.1431 24.964 19.4634 24.5039 20.8212 24.2292C21.0215 24.1886 21.2224 24.1511 21.4237 24.1155L21.4707 24.1046C22.5849 23.8383 23.7159 23.6358 24.8227 23.3419C25.0992 23.2685 25.3734 23.1866 25.6454 23.0961C25.8425 23.0306 26.0384 22.9605 26.2331 22.886Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M16.9444 16.2526C17.1923 16.1047 17.3037 15.8412 17.2936 15.5581C17.2831 15.2746 17.1449 14.988 16.9165 14.768C16.688 14.548 16.3964 14.4207 16.1127 14.4209C15.8294 14.4215 15.5703 14.5428 15.4318 14.796C15.3742 14.9009 15.3135 15.0027 15.2496 15.1014C15.0868 15.353 14.9035 15.5846 14.6995 15.7964C13.6954 16.8391 12.6302 17.8228 11.5956 18.8361C11.3549 19.072 11.1142 19.3079 10.8736 19.5438C10.7911 19.6246 10.7086 19.7055 10.6261 19.7864C10.427 19.9813 10.3163 20.2454 10.3216 20.524C10.3268 20.8023 10.4476 21.0722 10.6541 21.271C10.8605 21.4699 11.1348 21.5804 11.4131 21.575C11.6917 21.5699 11.9514 21.4493 12.1387 21.243C12.2164 21.1575 12.2941 21.0721 12.3718 20.9866C12.5985 20.7372 12.8251 20.4878 13.0517 20.2384C14.0253 19.1664 14.9682 18.0648 15.9723 17.0221C16.1763 16.8103 16.4009 16.6183 16.6461 16.4462C16.7423 16.3786 16.8418 16.3141 16.9444 16.2526Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </figure>
          <div>
            <p className="text-lg ">
              Created by{" "}
              <span className="font-[Neusans-medium]">{club?.managerName}</span>
            </p>
            <p className="text-xs font-[Neusans-medium] text-[#69696C]">
              Club Manager
            </p>
          </div>
        </div>
        {/* Description */}
        <div>
          <h2 className="text-xl font-[Neusans-medium] mb-2">Details:</h2>
          <p className="text-info">{club.description}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-transparent p-6 rounded-2xl border border-black/10">
            <p className="text-xs font-[Neusans-medium] text-[#69696C] flex items-center gap-2">
              <MdCategory className="text-base text-[#ff4a79]" />
              Category
            </p>
            <p className="font-[Neusans-medium]">{club.category}</p>
          </div>

          <div className="bg-transparent p-6 rounded-2xl border border-black/10">
            <p className="text-xs font-[Neusans-medium] text-[#69696C] flex items-center gap-2">
              <FaMoneyBillWave className="text-base text-green-600" />
              Membership Fee
            </p>
            <p className="font-[Neusans-medium]">{club.membershipFee} BDT</p>
          </div>

          <div className="bg-transparent p-6 rounded-2xl border border-black/10">
            <p className="text-xs font-[Neusans-medium] text-[#69696C] flex items-center gap-2">
              <AiFillCheckCircle className="text-base text-green-600" />
              Status
            </p>
            <p className="font-[Neusans-medium] capitalize">{club.status}</p>
          </div>

          <div className="bg-transparent p-6 rounded-2xl border border-black/10">
            <p className="text-xs font-[Neusans-medium] text-[#69696C] flex items-center gap-2">
              <BiCalendar className="text-base text-accent" />
              Created At
            </p>
            <p className="font-[Neusans-medium]">
              {new Date(club.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {/* join btn  */}
        <button
          disabled={isJoined || paymentLoading}
          onClick={handlePayment}
          className={`button_primary px-7! flex items-center gap-2 transition-all
    ${
      isJoined
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "hover:-translate-y-1"
    }
  `}
        >
          {paymentLoading ? (
            "Checking..."
          ) : isJoined ? (
            "Joined"
          ) : (
            <>
              <FaUsers className="text-base" />
              Join Club
            </>
          )}
        </button>
      </div>

      {/* right section */}
      <div className="space-y-6 lg:col-span-2">
        <figure className="bg-base-200 rounded-2xl overflow-hidden shadow-sm">
          <img
            src={club.bannerImage}
            alt={club.clubName}
            className="w-full h-70 object-cover"
          />
        </figure>
        <div className="bg-white p-6 rounded-2xl border border-black/10">
          <div className="flex items-center gap-3">
            <img
              src="https://img.icons8.com/scribby/50/marker.png"
              className="w-8"
            />
            <div>
              <p className="text-xs font-[Neusans-medium] text-[#69696C]">
                Location
              </p>
              <p className="font-[Neusans-medium]">{club.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
