import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        token: String,
        expiryDate: Date,
        user: {type: mongoose.Schema.Types.ObjectId, ref: "Admin"},
        
    },
    { timestamps: true }
)

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;