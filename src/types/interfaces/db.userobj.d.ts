interface UserObj {
  id: number;
  username: string;
  password: string;
  created_at: Date;
  last_login: Date;
  current_bits_balance: number;
  total_bits_earned: number;
  xcash: number;
  banned: boolean;
  moderator: boolean;
  inventory: string;
}