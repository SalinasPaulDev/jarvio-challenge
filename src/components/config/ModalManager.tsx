import AmazonConfig from "./AmazonConfig";
import AIConfig from "./AIConfig";
import GmailConfig from "./GmailConfig";
import SlackConfig from "./SlackConfig";
import ConfigModal from "../common/ConfigModal/ConfigModal";
import { BlockType } from "../../types/blocks";
import { BLOCK_METADATA } from "../../utils/blocks";

interface ModalManagerProps {
  isOpen: {
    blockType: BlockType;
    blockId: string;
  } | null;
  onOpenChange: (
    isOpen: { blockType: BlockType; blockId: string } | null
  ) => void;
}

export default function ModalManager({
  isOpen,
  onOpenChange,
}: ModalManagerProps) {
  const handleSave = () => {
    onOpenChange(null);
  };

  const handleCancel = () => {
    onOpenChange(null);
  };

  const handleConfig = (): React.ReactNode => {
    if (!isOpen) return null;

    const { blockType, blockId } = isOpen;

    switch (blockType) {
      case BlockType.AMAZON_SALES:
        return (
          <AmazonConfig
            blockId={blockId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case BlockType.AI_AGENT:
        return (
          <AIConfig
            blockId={blockId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case BlockType.GMAIL:
        return (
          <GmailConfig
            blockId={blockId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case BlockType.SLACK:
        return (
          <SlackConfig
            blockId={blockId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      default:
        return null;
    }
  };

  const getModalTitle = (): string => {
    if (!isOpen) return "";
    return `Configure ${BLOCK_METADATA[isOpen.blockType].label}`;
  };

  return (
    <ConfigModal
      isOpen={isOpen !== null}
      onOpenChange={(open) => onOpenChange(open ? isOpen : null)}
      title={getModalTitle()}
    >
      {handleConfig()}
    </ConfigModal>
  );
}
