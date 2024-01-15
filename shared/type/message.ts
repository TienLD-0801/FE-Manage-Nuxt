type TMessage = {
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type TMessageGroup = {
  group_id: string;
  group_type: 'private' | 'group';
  admin_refs: any;
  member_refs: any;
  last_message: TMessage;
  is_canceled: boolean;
  is_approved: boolean;
  oppositeUser?: TProfile;
};
