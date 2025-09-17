// src/store/modalStore.ts
import { create } from "zustand";
import { BlockType } from "../types/blocks";

interface ModalState {
  isOpen: boolean;
  blockType: BlockType | null;
  blockId: string | null;
}

interface ModalStore extends ModalState {
  openModal: (blockType: BlockType, blockId: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  // Initial state
  isOpen: false,
  blockType: null,
  blockId: null,

  // Actions
  openModal: (blockType: BlockType, blockId: string) => {
    set({
      isOpen: true,
      blockType,
      blockId,
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      blockType: null,
      blockId: null,
    });
  },
}));
