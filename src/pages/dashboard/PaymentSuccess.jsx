import React from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { AiFillCheckCircle } from "react-icons/ai";
import { PulseLoader } from "react-spinners";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: paymentInfo = {}, isLoading } = useQuery({
    queryKey: ["payment-success", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const res = await axiosSecure.patch(
        `/payment-success?session_id=${sessionId}`
      );
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

  return (
    <div className="min-h-[94vh] flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body items-center justify-center text-center space-y-3">
          <AiFillCheckCircle className="text-6xl text-success" />

          <h2 className="text-2xl font-semibold">
            Payment Successful 🎉
          </h2>

          <p className="text-sm text-gray-500">
            You have successfully joined the club.
          </p>

          {paymentInfo?.transactionId && (
            <div className="bg-base-200 px-4 py-2 rounded-lg text-sm">
              <span className="font-medium">Transaction ID:</span>{" "}
              <span className="font-mono">
                {paymentInfo.transactionId}
              </span>
            </div>
          )}
            <button
              onClick={() => navigate("/dashboard/my-clubs")}
              className="button_primary "
            >
              My Clubs
            </button>
        
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
