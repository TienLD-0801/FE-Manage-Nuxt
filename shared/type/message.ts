type TMessage = {
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type TMessageGroup = {
  group_id: string;
  last_message: TMessage;
  is_canceled: boolean;
  is_approved: boolean;
  admins?: TProfile[];
  members?: TProfile[]
  oppositeUser?: TProfile;
};
