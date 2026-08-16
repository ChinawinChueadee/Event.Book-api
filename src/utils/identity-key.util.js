export default function (identity) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let email = "";
  if (emailRegex.test(identity)) {
    email = "email";
  }
  return email;
}
