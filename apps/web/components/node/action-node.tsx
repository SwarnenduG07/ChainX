import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { useAvailableActionsAndTriggers } from "@/hooks/useaction-trigger";
import { ZapCell } from "../zapcell";
import { Input } from "../input";

interface ActionMetadata {
  email?: {
    email: string;
    body: string;
  };
  solana?: {
    amount: string;
    address: string;
  };
}

interface Action {
  index: number;
  availableActionId: string;
  availableActionName: string;
  metadata?: ActionMetadata;
}

interface AvailableAction {
  id: string;
  name: string;
  image: string;
}

interface ActionNodeProps {
  data: {
    selectedActions: Action[];
    setSelectedActions: React.Dispatch<React.SetStateAction<Action[]>>;
  };
}

interface ModalProps {
  index: number;
  onSelect: (props: null | { name: string; id: string; metadata?: ActionMetadata }) => void;
  availableItems: AvailableAction[];
}

interface MetadataSelectorProps {
  setMetadata: (params: any) => void;
}

const ActionNode: React.FC<ActionNodeProps> = ({ data }) => {
  const { availableActions } = useAvailableActionsAndTriggers();
  const { selectedActions, setSelectedActions } = data;
  const [selectedModelIndex, setSelectedModalIndex] = useState<number | null>(null);

  return (
    <div className="bg-[#1f2d00] border border-dotted border-[#b8e600] rounded-lg p-4 shadow-lg text-white w-80 relative">
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="rounded-full border border-emerald-600 py-1 px-1"
      />

      <div className="flex items-center space-x-2 mb-2">
        <span className="flex justify-center items-center w-6 h-6 rounded-full bg-green-500">⚙️</span>
        <div className="w-full pt-2 pb-2">
          {selectedActions.map((action) => (
            <div key={action.index} className="pt-2 flex justify-center">
              <ZapCell
                onClick={() => setSelectedModalIndex(action.index)}
                name={action.availableActionName || "Action"}
                index={action.index}
              />
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          className="bg-gray-700 hover:bg-gray-600"
          onClick={() => setSelectedModalIndex(selectedActions.length + 1)}
        >
          Select Action
        </Button>
      </div>

      <p className="text-sm">
        <strong>2.</strong> Choose the action to be performed.
      </p>

      {selectedModelIndex !== null && (
        <ActionModal
          availableItems={availableActions.map(action => ({
            id: action.id.toString(),
            name: action.name,
            image: action.image
          }))}
          onSelect={(props) => {
            if (!props) {
              setSelectedModalIndex(null);
              return;
            }
            
            const newAction: Action = {
              index: selectedModelIndex,
              availableActionId: props.id,
              availableActionName: props.name,
              metadata: props.metadata,
            };
            
            setSelectedActions(prevActions => {
              const newActions = [...prevActions];
              newActions[selectedModelIndex - 1] = newAction;
              return newActions;
            });
            setSelectedModalIndex(null);
          }}
          index={selectedModelIndex}
        />
      )}
    </div>
  );
};

const ActionModal: React.FC<ModalProps> = ({ index, onSelect, availableItems }) => {
  const [step, setStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    name: string;
  }>();

  const handleClose = () => onSelect(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 bg-opacity-70">
      <div className="relative w-full max-w-2xl p-4">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h2 className="text-xl font-semibold">
              Select {index === 1 ? "Trigger" : "Action"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900"
            >
              <span className="sr-only">Close modal</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </Button>
          </div>
          
          <div className="p-4 md:p-5 space-y-4">
            {step === 1 && selectedAction?.id === "email" && (
              <EmailSelector 
                setMetadata={(metadata) => {
                  onSelect({
                    ...selectedAction,
                    metadata: { email: metadata }
                  });
                }} 
              />
            )}

            {step === 1 && selectedAction?.id === "send-sol" && (
              <SolanaSelector 
                setMetadata={(metadata) => {
                  onSelect({
                    ...selectedAction,
                    metadata: { solana: metadata }
                  });
                }} 
              />
            )}

            {step === 0 && (
              <div className="space-y-2">
                {availableItems.map(({ id, name, image }) => (
                  <div
                    key={id}
                    onClick={() => {
                      setStep(1);
                      setSelectedAction({ id, name });
                    }}
                    className="flex items-center p-4 border border-red-800 rounded-lg cursor-pointer hover:bg-slate-100"
                  >
                    <img src={image} alt={name} width={35} className="rounded-full" />
                    <span className="ml-3 text-black">{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailSelector: React.FC<MetadataSelectorProps> = ({ setMetadata }) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="space-y-4">
      <Input
        label="To"
        type="email"
        placeholder="Enter email address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Body"
        type="text"
        placeholder="Enter email body"
        onChange={(e) => setBody(e.target.value)}
      />
      <Button 
        onClick={() => setMetadata({ email, body })}
        className="w-full"
      >
        Submit
      </Button>
    </div>
  );
};

const SolanaSelector: React.FC<MetadataSelectorProps> = ({ setMetadata }) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="space-y-4">
      <Input
        label="To"
        type="text"
        placeholder="Enter Solana address"
        onChange={(e) => setAddress(e.target.value)}
      />
      <Input
        label="Amount"
        type="text"
        placeholder="Enter amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button 
        onClick={() => setMetadata({ amount, address })}
        className="w-full"
      >
        Submit
      </Button>
    </div>
  );
};

export default ActionNode;