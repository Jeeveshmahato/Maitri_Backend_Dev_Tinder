const validator = require("validator");

const validatetoupdate = (req) => {
  const { _id, ...data } = req.body;
  const AllowedChnges = ["gender", "skills", "password"];
  const CheckAllowed = Object.keys(data).every((k) =>
    AllowedChnges.includes(k)
  );
  if (!CheckAllowed) {
    throw new Error("Not allowed");
  }
  if (data?.skills?.length > 4) {
    throw new Error("Password should be at least 10 characters long");
  }

  // if(!validator.isNumeric(data?.age)){
  //   throw new Error("Invalid number");
  // }
};
const validatetoSignup = (req)=>{
    
}
module.exports = validatetoupdate ;
