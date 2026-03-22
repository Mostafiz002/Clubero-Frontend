import React, { useState } from "react";
import { FaLocationDot, FaTrash, FaUsers } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router";
import { format } from "date-fns";
import { FaCalendarDays } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const EventCardManager = ({ event, clubs, refetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: event.title,
      clubId: event.clubId,
      description: event.description,
      eventDate: format(new Date(event.eventDate), "yyyy-MM-dd'T'HH:mm"),
      location: event.location,
      bannerImage: event.bannerImage,
      eventFee: event.eventFee,
    },
  });

  const handleUpdateEvent = (data) => {
    axiosSecure
      .patch(`/events/${event._id}`, data)
      .then((res) => {
        console.log(res)
        if (res.status == 200) {
          Swal.fire({
            title: "Event updated!",
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

  const handleDeleteEvent = () => {
    Swal.fire({
      title: "Delete this event?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete!",
    }).then((result) => {

      if (result.isConfirmed) {
        axiosSecure
          .delete(`/events/${event._id}`)
          .then((res) => {
            console.log(res)
            if (res.status == 200) {
              Swal.fire({
                title: "Event deleted!",
                icon: "success",
              });
              refetch();
            }
          })
          .catch(() => {
            toast.error("Error occurred while deleting the event");
          });
      }
    });
  };

  return (
    <div>
      <Link
        to={`/event-details/${event._id}`}
        onClick={() => window.scrollTo(0, 0)}
        className="relative group hover:scale-98! duration-200"
      >
        <div className="relative overflow-hidden rounded-3xl">
          <img
            className="h-40 w-full object-cover rounded-3xl group-hover:scale-105 duration-300"
            src={event.bannerImage}
            alt="Club Banner"
          />
          <p
            className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full z-10 ${
              event.isPaid
                ? "bg-blue-600 text-white"
                : "bg-green-100 text-green-700"
            }`}
          >
            {event.isPaid ? `Paid • ৳${event.eventFee}` : "Free Event"}
          </p>
          <div className="absolute inset-0 bg-white/16 opacity-0 group-hover:opacity-100 duration-300 rounded-3xl"></div>
        </div>
        <div className="flex items-center mt-4 gap-4">
          <p className="flex text-[12px] items-center gap-1 font-[Neusans-medium]  text-[#69696C]">
            <FaLocationDot /> {event.location}
          </p>
          <p className="flex text-[12px] items-center gap-1 font-[Neusans-medium] mt-1 text-[#69696C]">
            <FaCalendarDays className="-mt-0.5" />{" "}
            {format(new Date(event.eventDate), "dd MMM yyyy")}
          </p>
        </div>
        <h3 className="text-primary my-1.5 font-[Neusans-bold] text-lg/7">
          {event.title}
        </h3>
        <p className="text-[12px] line-clamp-1 items-center gap-1 font-[Neusans-medium] text-[#69696C]">
          {event.description}
        </p>
        <p className="flex items-center gap-1 text-[12px] mt-2 text-gray-500">
          <FaUsers />
          All club members can join
        </p>
      </Link>
      {/* actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-green-100 cursor-pointer text-green-600 text-sm font-medium hover:bg-green-200"
        >
          <FaEdit /> Update
        </button>

        <button
          onClick={handleDeleteEvent}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-100 cursor-pointer text-red-600 text-sm font-medium hover:bg-red-200"
        >
          <FaTrash /> Delete
        </button>
      </div>
      {isOpen && (
        <dialog className="modal modal-open ">
          <div className="modal-box max-w-xl">
            <h3 className="font-bold text-xl mb-6 text-primary">Create Club</h3>

            <form
              onSubmit={handleSubmit(handleUpdateEvent)}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Event Title</span>
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Event title is required",
                  })}
                  className="input input-bordered w-full"
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <ErrorMessage message={errors.title.message} />
                )}
              </div>

              {/* Select Club */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Select Club</span>
                </label>

                <select
                  {...register("clubId", {
                    required: "Please select a club",
                  })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your club</option>

                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.clubName}
                    </option>
                  ))}
                </select>

                {errors.clubId && (
                  <ErrorMessage message={errors.clubId.message} />
                )}
              </div>

              {/* Description */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  rows="4"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters",
                    },
                  })}
                  className="textarea textarea-bordered w-full"
                  placeholder="Event description"
                />
                {errors.description && (
                  <ErrorMessage message={errors.description.message} />
                )}
              </div>

              {/* Event Date */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Event Date</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("eventDate", {
                    required: "Event date is required",
                  })}
                  className="input input-bordered w-full"
                />
                {errors.eventDate && (
                  <ErrorMessage message={errors.eventDate.message} />
                )}
              </div>

              {/* Location */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="input input-bordered w-full"
                  placeholder="e.g. Dhaka"
                />
                {errors.location && (
                  <ErrorMessage message={errors.location.message} />
                )}
              </div>

              {/* Banner Image */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Banner Image URL
                  </span>
                </label>
                <input
                  type="url"
                  {...register("bannerImage", {
                    required: "Banner image is required",
                  })}
                  className="input input-bordered w-full"
                  placeholder="https://image-url.com/banner.jpg"
                />
                {errors.bannerImage && (
                  <ErrorMessage message={errors.bannerImage.message} />
                )}
              </div>

              {/* Event Fee */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Event Fee</span>
                </label>
                <input
                  type="number"
                  {...register("eventFee", {
                    required: "Event fee is required",
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                  className="input input-bordered w-full"
                  placeholder="0 for free"
                />
                {errors.eventFee && (
                  <ErrorMessage message={errors.eventFee.message} />
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
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default EventCardManager;
