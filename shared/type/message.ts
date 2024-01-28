type TMessage = {
  message_id: string;
  user_id: string;
  user_ref: any; // DocumentReference type
  content: string;
  datetime: string;
  created_at: number;
};

type TMessageGroup = {
  group_id: string;
  group_name?: string;
  description: string;
  avatar?: string;
  group_type: 'private' | 'group';
  admin_refs: any; // DocumentReference type
  member_refs: any; // DocumentReference type
  last_message: TMessage;
  is_canceled: boolean;
  is_approved: boolean;
  oppositeUser?: TProfile;
};
