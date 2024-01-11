type TMessage = {
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type TMessageGroup = {
  sender: TProfile;
  receiver: TProfile;
  messages: TMessage[];
  is_canceled: boolean;
  is_approved: boolean;
  oppositeUser?: TProfile;
};
