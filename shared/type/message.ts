type TMessage = {
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type TMessageGroup = {
  group_id: string;
  sender: TProfile;
  receiver: TProfile;
  last_message: TMessage;
  is_canceled: boolean;
  is_approved: boolean;
  oppositeUser?: TProfile;
};
