import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/user.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//to register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username, rollNum, firstName, lastName, branch } =
    req.body;

  //to check any fields are empty
  if (
    [email, password, username, rollNum, firstName, lastName, branch].some(
      (ele) => ele?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are necessary");
  }
  //checking for email
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "Email already in use");
  }
  //checking for username
  const existedUsername = await User.findOne({ username });
  if (existedUsername) {
    throw new ApiError(400, "Username already taken");
  }

  //uploading to DB
  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
    rollNum,
    firstName,
    lastName,
    branch:'AIML',
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registration");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get from req
  const { username, password } = req.body;
  if (!username) {
    throw new ApiError(400, "Username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  //finding user with email or password
  const user = await User.findOne({ username });

  //user unavailable
  if (!user) {
    throw new ApiError(400, "Invalid username");
  }
  //password check
  const passwordValid = await user.passwordCheck(password);
  if (!passwordValid) {
    throw new ApiError(400, "Wrong Password");
  }

  //generating tokens
  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  //getting user from DB
  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //set up cookie options
  //with these options only server can modify cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedIn,
          accessToken,
          refreshToken,
        },
        "Login Successful"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //here we just clear the cookies from user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      //new is used to return the latest updated user data
      new: true,
    }
  );
  //set up cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

//function to generate refresh and access tokens
const generateAccessRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    // Generate access token and refresh token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Ensure the tokens are returned from the methods
    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Failed to generate tokens");
    }

    // Assign refresh token to the user and save to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const createAccessToken = asyncHandler(async (req, res) => {
  try {
    const presentRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!presentRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      presentRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(400, "Invalid refresh token");
    }

    if (presentRefreshToken !== user?.refreshToken) {
      throw new ApiError("Refresh token is invalid or used");
    }
    //generating tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessRefreshToken(user._id);

    //getting user from DB
    const loggedIn = await User.findById(user._id).select("-password");

    //set up cookie options
    //with these options only server can modify cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedIn,
            accessToken,
            newRefreshToken,
          },
          "Token recreated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Something went wrong");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All fields are necessary");
  }
  const user = await User.findById(req.user?._id);

  //we check old password
  const oldPasswordCheck = await user.passwordCheck(oldPassword);

  if (!oldPasswordCheck) {
    throw new ApiError(400, "Wrong Old Password");
  }

  //update password in DB
  user.password = newPassword;
  user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Fetched Successfully"));
});

const updateDetails = asyncHandler(async (req, res) => {
  //supposing fullname and email can be edited at once
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "All fields are required");
  }

  //finding user and updating
  const user = await User.findByIdAndUpdate(
    req.user?._id, //as user is logged in the request consists user property
    {
      fullname: fullname,
      email: email,
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  createAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateDetails,
};
