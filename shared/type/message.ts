type TMessage = {
  message_id: String;
  user_id: String;
  content: String;
  created_at: String;
};

type TMessageGroup = {
  sender: TProfile;
  receiver: TProfile;
  messages: TMessage[];
  is_canceled: boolean;
  is_approved: boolean;
};
