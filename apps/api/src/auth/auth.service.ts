import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.model';
import { LoginDTO, SingupDTO } from './dto/auth.dto';
import { JwtService } from 'jwt/jwt.service';
import { HttpError } from 'http/error';

/**
 * Service responsible for authentication operations.
 */
@Injectable()
export class AuthService {
  /**
   * Constructor for AuthService.
   * @param userModel - The Mongoose model for the User entity.
   * @param jwtService - The JwtService for handling JWT operations.
   */
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Handles user signup.
   * @param signup - The SignupDTO containing user signup information.
   * @returns A JWT token upon successful signup.
   * @throws HttpError if signup fails or token generation fails.
   */
  async signup(signup: SingupDTO): Promise<string> {
    const newUser = new this.userModel(signup);
    await newUser.save();
    if (!newUser) {
      throw new HttpError(
        'Signup Failed',
        'User Creation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.jwtService.sign({ _id: newUser._id });

    if (!token) {
      throw new HttpError(
        'Token Error',
        'Token Generation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    return token;
  }

  /**
   * Handles user login.
   * @param login - The LoginDTO containing user login information.
   * @returns A JWT token upon successful login.
   * @throws HttpError if no account is found, or token generation fails.
   */
  async login(login: LoginDTO): Promise<string> {
    const user = await this.userModel.findOne({ ...login });
    if (!user) {
      throw new HttpError('No Account Found', login, HttpStatus.NOT_FOUND);
    }

    const token = await this.jwtService.sign({ _id: user._id });

    if (!token) {
      throw new HttpError(
        'Token Error',
        'Token Generation Failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    return token;
  }
}
