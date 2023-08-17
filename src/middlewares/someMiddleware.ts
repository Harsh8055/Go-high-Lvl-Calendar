

export const middleware = async (
req: any, res: any, next: any
) => {
  try {
  // middlewaare logix
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      err: "Error checking collection limit",
      data: {},
    });
  }
};


