import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common"

import { AuthGuard } from "#models/auth/guard"

import { IUser } from "#interfaces/user"

import { CreateUserDto } from "./dto/create-user.dto"
import { FindUsersDto } from "./dto/find-users.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UserService } from "./service"

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("search")
  @UseGuards(AuthGuard)
  searchUsers(@Query() query: FindUsersDto) {
    return this.userService.searchUsers(query)
  }

  @Get(":userIdentifier")
  @UseGuards(AuthGuard)
  findUser(
    @Request()
    req: { userId: IUser["id"] },
    @Param("userIdentifier")
    userIdentifier: string
  ) {
    if (isNaN(parseInt(userIdentifier))) {
      return this.userService.findUser({ loggedInUserId: req.userId, username: userIdentifier })
    }
    return this.userService.findUser({ loggedInUserId: req.userId, id: parseInt(userIdentifier) })
  }

  @Post()
  create(
    @Body()
    createUserDto: CreateUserDto
  ) {
    return this.userService.create(createUserDto)
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(
    @Param("id")
    id: string,
    @Body()
    updateUserDto: UpdateUserDto,
    @Request()
    req: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    const userToBeUpdatedId = parseInt(id)
    if (req.userId !== userToBeUpdatedId) {
      throw new ForbiddenException({ message: "You are not allowed to update another user." })
    }
    return this.userService.update(userToBeUpdatedId, updateUserDto)
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  delete(
    @Param("id")
    id: string,
    @Request()
    req: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    const userToBeDeletedId = parseInt(id)
    if (req.userId !== userToBeDeletedId) {
      throw new ForbiddenException({ message: "You are not allowed to delete another user." })
    }
    return this.userService.delete(userToBeDeletedId)
  }
}
