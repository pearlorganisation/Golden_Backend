export const asyncHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => {
      //console.log("error: ", error);
      return next(error);
    });
  };
};
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};
