import { useState } from 'react';
import type { GroupSelectorItem } from '@/api/group';
import type { InviteInfoResponse } from '@/api/invites';
import type { InviteExpiryOption, InviteMode, ModalStep, SelectorTarget } from './shareInviteHelpers';

interface ShareInviteModalState {
  step: ModalStep;
  mode: InviteMode;
  requiredChatId: string;
  selectedRequiredGroup: GroupSelectorItem | null;
  selectedDestinationGroup: GroupSelectorItem | null;
  expiryOption: InviteExpiryOption;
  submitting: boolean;
  draftInvite: InviteInfoResponse | null;
  groupSelectorOpen: boolean;
  selectorTarget: SelectorTarget;
  setStep: (step: ModalStep) => void;
  changeMode: (mode: InviteMode) => void;
  setSubmitting: (submitting: boolean) => void;
  changeExpiryOption: (option: InviteExpiryOption) => void;
  setDraftInvite: (invite: InviteInfoResponse | null) => void;
  openSelector: (target: SelectorTarget) => void;
  closeSelector: () => void;
  selectRequiredGroup: (group: GroupSelectorItem) => void;
  selectDestinationGroup: (group: GroupSelectorItem) => void;
}

export function useShareInviteModalState(): ShareInviteModalState {
  const [step, setStep] = useState<ModalStep>('configure');
  const [mode, setMode] = useState<InviteMode>('public');
  const [requiredChatId, setRequiredChatId] = useState('');
  const [selectedRequiredGroup, setSelectedRequiredGroup] = useState<GroupSelectorItem | null>(null);
  const [selectedDestinationGroup, setSelectedDestinationGroup] = useState<GroupSelectorItem | null>(null);
  const [expiryOption, setExpiryOption] = useState<InviteExpiryOption>('never');
  const [submitting, setSubmitting] = useState(false);
  const [draftInvite, setDraftInvite] = useState<InviteInfoResponse | null>(null);
  const [groupSelectorOpen, setGroupSelectorOpen] = useState(false);
  const [selectorTarget, setSelectorTarget] = useState<SelectorTarget>('required');

  return {
    step,
    mode,
    requiredChatId,
    selectedRequiredGroup,
    selectedDestinationGroup,
    expiryOption,
    submitting,
    draftInvite,
    groupSelectorOpen,
    selectorTarget,
    setStep,
    changeMode: (nextMode) => {
      setMode(nextMode);
      setSelectedDestinationGroup(null);
      setDraftInvite(null);
      if (nextMode !== 'membership' && selectorTarget === 'required') {
        setGroupSelectorOpen(false);
      }
    },
    setSubmitting,
    changeExpiryOption: (option) => {
      setExpiryOption(option);
      setDraftInvite(null);
    },
    setDraftInvite,
    openSelector: (target) => {
      setSelectorTarget(target);
      setGroupSelectorOpen(true);
    },
    closeSelector: () => setGroupSelectorOpen(false),
    selectRequiredGroup: (group) => {
      setSelectedRequiredGroup(group);
      setRequiredChatId(group.id);
      setGroupSelectorOpen(false);
    },
    selectDestinationGroup: (group) => {
      setSelectedDestinationGroup(group);
      setGroupSelectorOpen(false);
    },
  };
}
