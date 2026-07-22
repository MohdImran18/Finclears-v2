"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import UsersService from "@/services/users/users.service";

import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
} from "@/types/user";

/*
|--------------------------------------------------------------------------
| Query Keys
|--------------------------------------------------------------------------
*/

export const userKeys = {
  all: ["users"] as const,

  lists: () => [...userKeys.all, "list"] as const,

  list: (filters?: UserFilters) =>
    [...userKeys.lists(), filters] as const,

  details: () =>
    [...userKeys.all, "detail"] as const,

  detail: (id: number | string) =>
    [...userKeys.details(), id] as const,
};

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

export function useUsers(
  filters?: UserFilters
) {
  return useQuery({
    queryKey: userKeys.list(filters),

    queryFn: () =>
      UsersService.index(filters),

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 10,

    retry: 1,
  });
}

/*
|--------------------------------------------------------------------------
| Single User
|--------------------------------------------------------------------------
*/

export function useUser(
  id: number | string
) {
  return useQuery({
    queryKey: userKeys.detail(id),

    queryFn: () =>
      UsersService.show(id),

    enabled: !!id,

    retry: 1,
  });
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateUserRequest
    ) => UsersService.store(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateUserRequest;
    }) =>
      UsersService.update(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: userKeys.detail(
          variables.id
        ),
      });
    },
  });
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: number | string
    ) => UsersService.destroy(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}
