import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // let token = req.header("Authorization");
  if (!token) {
    res.status(400).send("Please Login/Sign Up to continue");
  }
  // if (token.startsWith("Bearer ")) {
  //   token = token.slice(7, token.length).trimLeft();
  // }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      res.status(400).send("Unauthorized " + err);
    }
    req.user = user;
    next();
  });
};

// this is my user
// {
//     id: "5ff56cb76c2f12c744f16c7d", // Example MongoDB ObjectId
//     isAdmin: true // or false, depending on whether the user is an admin
//   }
