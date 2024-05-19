import mongoose, { Document, Mongoose } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import mongoosePaginate from "mongoose-paginate-v2";

export interface UserDocument extends Document {
  username: string;
  password: string;
  name: string;
  role: string;
}

const { Schema } = mongoose;

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

userSchema.plugin(mongooseUniqueValidator, {
  message: "Username sudah digunakan",
});
userSchema.plugin(mongoosePaginate);

const User = mongoose.model<UserDocument, mongoose.PaginateModel<UserDocument>>(
  "users",
  userSchema
);

export default User;
