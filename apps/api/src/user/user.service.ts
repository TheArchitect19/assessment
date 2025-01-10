import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.model';
import { Model } from 'mongoose';
import { UpdateEmailEntryDto, UpdateUserDTO } from './dto/user.dto';
import { Document, Types } from 'mongoose';
/**
 * Service responsible for user-related operations.
 */
@Injectable()
export class UserService {
  /**
   * Constructor for UserService.
   * @param userModel - The Mongoose model for the User entity.
   */
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of User entities.
   */
  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel.find();
    return users;
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the User entity or null if not found.
   */
  async findOne(id: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(id);
    return user;
  }

  /**
   * Updates a user by their ID.
   * @param id - The ID of the user to update.
   * @param update - The data to update the user with.
   * @returns A promise that resolves to the updated User entity or null if not found.
   */
  async update(id: string, update: UpdateUserDTO): Promise<UserDocument | null> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
  

    else throw new Error("Email already exists!");
  
    return user;
  }
  
  /**
   * Removes a user by their ID.
   * @param id - The ID of the user to remove.
   * @returns A promise that resolves to the removed User entity or null if not found.
   */
  async remove(id: string): Promise<UserDocument | null> {
    const user = await this.userModel.findByIdAndDelete(id);
    return user;
  }

  async updateEmailEntry(
    userId: string,
    emailEntryId: string,
    updateData: UpdateEmailEntryDto,
  ): Promise<UserDocument | null> {
    try {
      const result = await this.userModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(userId) },
        },
        {
          $set: {
            emailList: {
              $map: {
                input: "$emailList",
                as: "entry",
                in: {
                  $cond: {
                    if: { $eq: ["$$entry._id", new Types.ObjectId(emailEntryId)] },
                    then: {
                      $mergeObjects: [
                        "$$entry",
                        {
                          email: updateData.email || "$$entry.email",
                          count: updateData.count || "$$entry.count",
                          name: updateData.name || "$$entry.name",
                          position: updateData.position || "$$entry.position",
                          signature: updateData.signature || "$$entry.signature",
                        },
                      ],
                    },
                    else: "$$entry",
                  },
                },
              },
            },
          },
        },
        {
          $project: { emailList: 1 },
        },
      ]);
      if (!result || result.length === 0) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: { emailList: result[0].emailList } },
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('Error updating email entry');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating email entry: ${error.message}`);
    }
  }

  

  async deleteEmailEntry(userId: string, emailEntryId: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(userId) },
        },
        {
          $project: {
            emailList: {
              $filter: {
                input: "$emailList",
                as: "entry",
                cond: { $ne: ["$$entry._id", new Types.ObjectId(emailEntryId)] }
              }
            }
          }
        }
      ]);
      console.log(user)
      if (!user || user.length === 0) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = user[0];
      if (updatedUser.emailList.length === 0) {
        throw new NotFoundException('Email entry not found');
      }
      await this.userModel.findByIdAndUpdate(userId, {
        $set: { emailList: updatedUser.emailList },
      });

      return await updatedUser;
    } catch (error) {
      throw new Error(`Error deleting email entry: ${error.message}`);
    }
  }
  
  

}
