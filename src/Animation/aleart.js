import Swal from "sweetalert2";

//  Success Alert
export const showSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: message,
    timer: 2000,
    confirmButtonColor: "#0bc21d",
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