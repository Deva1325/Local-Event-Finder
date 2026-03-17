export const successResponse = ( res: any,message: string,data: any = null,statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: any,message: string,statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};


// http://localhost:3000/api-docs

// http://192.168.1.103:3000/api-docs