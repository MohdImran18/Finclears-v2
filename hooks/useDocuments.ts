"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import * as DocumentService from "@/services/documents/document.service";

import type {
  DocumentFilters,
  UploadDocumentRequest,
} from "@/types/document";

/* ==========================================================
 | Query Keys
 * ========================================================= */

export const documentKeys = {
  all: ["documents"] as const,

  lists: () =>
    [...documentKeys.all, "list"] as const,

  list: (filters?: DocumentFilters) =>
    [...documentKeys.lists(), filters] as const,

  details: () =>
    [...documentKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...documentKeys.details(), id] as const,
};

/* ==========================================================
 | Documents
 * ========================================================= */

export function useDocuments(
  filters?: DocumentFilters
) {
  return useQuery({
    queryKey: documentKeys.list(filters),

    queryFn: () =>
      DocumentService.getDocuments(filters),
  });
}

/* ==========================================================
 | Single Document
 * ========================================================= */

export function useDocument(id: number) {
  return useQuery({
    enabled: !!id,

    queryKey: documentKeys.detail(id),

    queryFn: () =>
      DocumentService.getDocument(id),
  });
}

/* ==========================================================
 | Upload
 * ========================================================= */

export function useUploadDocument() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: UploadDocumentRequest
    ) =>
      DocumentService.uploadDocument(
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          documentKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Update
 * ========================================================= */

export function useUpdateDocument() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: FormData;
    }) =>
      DocumentService.updateDocument(
        id,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          documentKeys.detail(
            variables.id
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          documentKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Verify
 * ========================================================= */

export function useVerifyDocument() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      DocumentService.verifyDocument(
        id
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          documentKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Reject
 * ========================================================= */

export function useRejectDocument() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      remarks,
    }: {
      id: number;
      remarks: string;
    }) =>
      DocumentService.rejectDocument(
        id,
        remarks
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          documentKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Delete
 * ========================================================= */

export function useDeleteDocument() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      DocumentService.deleteDocument(
        id
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          documentKeys.lists(),
      });
    },
  });
}
