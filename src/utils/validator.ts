export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
export const isEmpty = (value: string): boolean => {

  if (value == null || value == undefined) {
    return true;
  }
  if (typeof value === "string" && value.trim() === "") {
    return true;
  }
  return false;
};

export const isNumber = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num);
  // if (isNaN(num)) {
  //   return false;
  // }
  //  return true; 
}
