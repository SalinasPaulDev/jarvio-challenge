import { create } from "zustand";

interface ConfirmationModalState {
  isOpen: boolean;
  modalPromiseResolve: ((value: boolean) => void) | null;
  showConfirmationModal: () => Promise<boolean>;
  handleModalResponse: (shouldContinue: boolean) => void;
}

export const useConfirmationModalStore = create<ConfirmationModalState>(
  (set, get) => ({
    isOpen: false,
    modalPromiseResolve: null,

    showConfirmationModal: (): Promise<boolean> => {
      return new Promise((resolve) => {
        set({
          isOpen: true,
          modalPromiseResolve: resolve,
        });
      });
    },

    handleModalResponse: (shouldContinue: boolean) => {
      const { modalPromiseResolve } = get();

      if (modalPromiseResolve) {
        modalPromiseResolve(shouldContinue);
      }

      set({
        isOpen: false,
        modalPromiseResolve: null,
      });
    },
  })
);
