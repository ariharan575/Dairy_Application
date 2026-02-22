import Swal from "sweetalert2";

//  Success Alert
export const showSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: message,
    timer: 1500,
    showConfirmButton: false,
    background: "#f9fafb",
    color: "#111827"
  });
};

//  Error Alert
export const showError = (message) => {
  Swal.fire({
    icon: "error",
    title: message,
    confirmButtonColor: "#dc2626"
  });
};

//  Confirm Delete Alert
export const showConfirm = async (message) => {
  const result = await Swal.fire({
    icon: "warning",
    title: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626"
  });

  return result.isConfirmed;
};