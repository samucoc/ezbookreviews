import { Schema, model, Types } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

// Antes de guardar, encriptar la contraseña
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para verificar password
userSchema.methods.comparePassword = function(password: string) {
  return bcrypt.compare(password, this.password)
}

export default model('User', userSchema)
