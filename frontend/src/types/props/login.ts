import { ProviderType } from 'types/api/member';

export interface LoginItemProps {
  icon: React.ReactNode;
  provider: ProviderType;
}

export interface LoginListProps {
  loginItemList: LoginItemProps[];
}

export interface LoginModalProps {
  isVideo?: boolean;
  onCancel: () => void;
  onLogin: () => void;
}
