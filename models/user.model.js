const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,default:"user"},
    avatar: {
        public_id: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          default:"https://icones.pro/wp-content/uploads/2021/02/icone-utilisateur.png",
          required: false,
        },
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
},{
    versionKey:false,
    timestamps:true
});

//incrept password
userSchema.pre("save", function (next) {
    const hash = bcrypt.hashSync(this.password, 10);
    this.password = hash;
    next();
  });
  
  // Compare password
  userSchema.methods.comparePassword = async function (password) {
    try {
      return await bcrypt.compareSync(password, this.password);
    } catch (error) {
      console.log("error",error)
    }
  };
const User = new mongoose.model("user",userSchema);
module.exports=User;