import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaEdit, FaEye } from "react-icons/fa";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import ErrorMessage from "../shared/ErrrorMessage";

const ManageCardManager = ({ club, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clubName: club.clubName,
      description: club.description,
      category: club.category,
      location: club.location,
      bannerImage: club.bannerImage,
      membershipFee: club.membershipFee,
    },
  });

  const handleUpdateClub = async (data) => {
    axiosSecure
      .patch(`/clubs/${club._id}`, data)
      .then((res) => {
        console.log(res)
        if (res.status == 200) {
          Swal.fire({
            title: "Club updated!",
            icon: "success",
          });
          reset();
          refetch();
          setIsOpen(false);
        }
      })
      .catch(() => {
        toast.error("Error occurred while updating the club");
      });
  };

  return (
    <>
      <div className="relative group hover:scale-98 duration-200 block">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            className="h-40 w-full object-cover rounded-3xl"
            src={club.bannerImage}
            alt="Club Banner"
          />
          <p className="absolute top-3 left-3 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
            {club.membershipFee === 0 ? "Free" : `৳${club.membershipFee}`}
          </p>
        </div>

        <p className="flex text-xs items-center gap-1 mt-4 text-gray-500">
          <FaLocationDot /> {club.location}
        </p>

        <h3 className="text-primary my-1.5 font-bold text-lg">
          {club.clubName}
        </h3>

        <p className="text-xs text-gray-500">{club.category} Club</p>

        {/* Actions */}
        <div className="flex gap-3 pt-3">
          <Link
            to={`/club-details/${club._id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-100 text-blue-600 text-sm"
          >
            <FaEye /> View
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="flex-1 flex items-center cursor-pointer justify-center gap-2 py-2 rounded-xl bg-green-100 text-green-600 text-sm"
          >
            <FaEdit /> Edit
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-xl mb-6 text-primary">Edit Club</h3>

            <form
              onSubmit={handleSubmit(handleUpdateClub)}
              className="space-y-4"
            >
              {/* Club Name */}
              <div>
                <input
                  {...register("clubName", {
                    required: "Club name is required",
                  })}
                  className="input input-bordered w-full"
                  placeholder="Club Name"
                />
                {errors.clubName && (
                  <ErrorMessage message={errors.clubName.message} />
                )}
              </div>

              {/* Description */}
              <div>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters",
                    },
                  })}
                  rows="3"
                  className="textarea textarea-bordered w-full"
                  placeholder="Description"
                />
                {errors.description && (
                  <ErrorMessage message={errors.description.message} />
                )}
              </div>

              {/* Category */}
              <div>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select category</option>
                  <option>Music</option>
                  <option>Pets & Animals</option>
                  <option>Parents & Family</option>
                  <option>Technology</option>
                  <option>Sports</option>
                </select>
                {errors.category && (
                  <ErrorMessage message={errors.category.message} />
                )}
              </div>

              {/* Location */}
              <div>
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="input input-bordered w-full"
                  placeholder="Location"
                />
                {errors.location && (
                  <ErrorMessage message={errors.location.message} />
                )}
              </div>

              {/* Banner Image */}
              <div>
                <input
                  {...register("bannerImage", {
                    required: "Banner image URL is required",
                  })}
                  className="input input-bordered w-full"
                  placeholder="Banner image URL"
                />
                {errors.bannerImage && (
                  <ErrorMessage message={errors.bannerImage.message} />
                )}
              </div>

              {/* Membership Fee */}
              <div>
                <input
                  type="number"
                  {...register("membershipFee", {
                    required: "Membership fee is required",
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                  className="input input-bordered w-full"
                  placeholder="Membership fee"
                />
                {errors.membershipFee && (
                  <ErrorMessage message={errors.membershipFee.message} />
                )}
              </div>

              {/* Actions */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
};

export default ManageCardManager;
