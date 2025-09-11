import React from "react";
import Dialog from "../components/Dialog";

const MintConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  domain,
  tokenTicker,
  tokenSupply
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      {(closeDialog) => (
        <>
          <h3 className="text-2xl font-bold text-white mb-4">Confirm Mint</h3>
          <p className="text-stardust-grey mb-6">
            You are about to mint a new Genesis NFT and fractionalize it into ERC-20 tokens
            on the <span className="text-celestial-blue font-bold">Doma Protocol</span>.
          </p>

          <div className="text-left space-y-4 bg-void-black border border-gray-700 p-4 rounded-lg mb-8 font-data">
            <div className="flex justify-between">
              <span className="text-stardust-grey">Asset</span>
              <span className="font-bold text-white">{domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stardust-grey">Ticker</span>
              <span className="font-bold text-white">${tokenTicker}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stardust-grey">Supply</span>
              <span className="font-bold text-white">{tokenSupply.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-stardust-grey text-center mb-6">
            Once confirmed, this action is permanent. Your domain will become a liquid asset,
            represented as a Genesis NFT and backed by {tokenSupply.toLocaleString()} ERC-20 tokens.
          </p>

          <div className="flex gap-4">
            <button
              onClick={closeDialog}
              className="w-full h-12 bg-gray-700 text-white font-bold rounded-lg transition-colors hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full h-12 bg-celestial-blue text-void-black font-bold rounded-lg transition-opacity hover:opacity-90"
            >
              Confirm Mint
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
};

export default MintConfirmationDialog;
