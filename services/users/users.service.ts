import API from "@/constants/api";

import {
  del,
  get,
  post,
  put,
} from "@/lib/request";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserFilters,
  UserListResponse,
} from "@/types/user";

const UsersService = {
  /*
  |--------------------------------------------------------------------------
  | List Users
  |--------------------------------------------------------------------------
  */

  index(filters?: UserFilters) {
    return get<UserListResponse>(
      API.USERS.INDEX,
      filters
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Show User
  |--------------------------------------------------------------------------
  */

  show(id: number | string) {
    return get<User>(
      API.USERS.SHOW(id)
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Create User
  |--------------------------------------------------------------------------
  */

  store(data: CreateUserRequest) {
    return post<User>(
      API.USERS.STORE,
      data
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Update User
  |--------------------------------------------------------------------------
  */

  update(
    id: number | string,
    data: UpdateUserRequest
  ) {
    return put<User>(
      API.USERS.UPDATE(id),
      data
    );
  },

  /*
  |--------------------------------------------------------------------------
  | Delete User
  |--------------------------------------------------------------------------
  */

  destroy(id: number | string) {
    return del<void>(
      API.USERS.DELETE(id)
    );
  },
};

export default UsersService;