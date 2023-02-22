export interface Count {
  count: number;
}

export interface Amount {
  amount: number;
}

export interface Name {
  name: string;
}

export interface Message {
  message: string;
}

export interface Tier {
  tier: "prime" | "1000" | "2000" | "3000";
}

export interface NameAmount extends Amount, Name { }

export interface NameAmountMessage extends Name, Amount, Message { }

export interface NameAmountTierMessage extends Name, Amount, Tier, Message { }

export interface CreatedAt {
  createdAt: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ActivityCommon extends Name, CreatedAt { }

export interface FollowActivity extends ActivityCommon {
  type: "follow";
}

/// XXX: may be wrong
export interface SubscribeActivity extends ActivityCommon {
  type: "subscribe";
}

export interface HostActivity extends ActivityCommon, Amount {
  _id: string;
  type: "host";
}

export interface RaidActivity extends Amount, ActivityCommon {
  type: "raid";
}

// TODO: add fields
export interface CheerActivity extends ActivityCommon {
  type: "cheer";
}

// TODO: add fields
export interface TipActivity extends ActivityCommon {
  type: "tip";
}

// TODO: add fields
export interface MerchActivity extends ActivityCommon {
  type: "merch";
}

export type Activity =
  | FollowActivity
  | SubscribeActivity
  | HostActivity
  | RaidActivity
  | CheerActivity
  | TipActivity
  | MerchActivity;

export interface SessionData {
  "follower-latest": Name;
  "follower-week": Count;
  "subscriber-latest": NameAmountTierMessage;
  "tip-latest": NameAmount;
  "host-latest": NameAmount;
  "raid-latest": NameAmount;
  "cheer-latest": NameAmount;
  "follower-goal": Amount;
  "subscriber-goal": Amount;
  "subscriber-points": Amount;
  "cheer-goal": Amount;
  "tip-week": Amount;
  "tip-month": Amount;
  "tip-total": Amount;
  "tip-goal": Amount;
  "cheer-week": Amount;
  "cheer-month": Amount;
  "cheer-total": Amount;
  "follower-month": Count;
  "follower-total": Count;
  "subscriber-week": Count;
  "subscriber-month": Count;
  "subscriber-total": Count;
  "cheer-count": Count;
  "follower-recent": FollowActivity[];
  "subscriber-recent": SubscribeActivity[];
  "host-recent": HostActivity[];
  "raid-recent": RaidActivity[];
  "cheer-recent": CheerActivity[];
  "tip-recent": TipActivity[];
  "merch-recent": MerchActivity;
  "merch-goal-items": Amount;
  "merch-goal-orders": Amount;
  "merch-goal-total": Amount;
  "superchat-goal": Amount;
  "superchat-session": Amount;
  "superchat-total": Amount;
  "superchat-week": Amount;
  "cheer-session": Amount;
  "tip-session": Amount;
  "superchat-month": Amount;
  "merch-lastest": {
    amount: number;
    items: any[]; // TODO: idk
    name: string;
  }[];
  "subscriber-gifted-latest": {
    amount: number;
    message: string;
    name: string;
    sender: string;
    tier: string;
  };
  "subscriber-new-latest": NameAmountMessage;
  "subscriber-resub-latest": NameAmountMessage;
  "purchase-latest": {
    amount: number;
    avatar: string;
    items: any[]; // TODO: idk
    message: string;
    name: string;
  };
  "charityCampaignDonation-recent": any[]; // TODO: idk
  "cheerPurchase-recent": any[]; // TODO: idk
  "superchat-recent": any[]; // TODO: idk
  "superchat-count": Count;
  "follower-session": Count;
  "subscriber-gifted-session": Count;
  "subscriber-new-session": Count;
  "subscriber-resub-session": Count;
  "subscriber-session": Count;
  "tip-count": Count;
  "subscriber-alltime-gifter": NameAmount;
  "charityCampaignDonation-alltime-top-donation": NameAmount;
  "charityCampaignDonation-alltime-top-donator": NameAmount;
  "charityCampaignDonation-latest": NameAmount;
  "charityCampaignDonation-monthly-top-donation": NameAmount;
  "charityCampaignDonation-monthly-top-donator": NameAmount;
  "charityCampaignDonation-weekly-top-donation": NameAmount;
  "charityCampaignDonation-weekly-top-donator": NameAmount;
  "cheerPurchase-alltime-top-donation": NameAmount;
  "cheerPurchase-alltime-top-donator": NameAmount;
  "cheerPurchase-latest": NameAmount;
  "cheerPurchase-monthly-top-donation": NameAmount;
  "cheerPurchase-monthly-top-donator": NameAmount;
  "cheerPurchase-weekly-top-donation": NameAmount;
  "cheerPurchase-weekly-top-donator": NameAmount;
  "superchat-alltime-top-donation": NameAmount;
  "superchat-alltime-top-donator": NameAmount;
  "superchat-latest": NameAmount;
  "superchat-monthly-top-donation": NameAmount;
  "superchat-monthly-top-donator": NameAmount;
  "superchat-weekly-top-donation": NameAmount;
  "superchat-weekly-top-donator": NameAmount;
  "tip-alltime-top-donation": NameAmount;
  "tip-alltime-top-donator": NameAmount;
  "tip-monthly-top-donation": NameAmount;
  "tip-monthly-top-donator": NameAmount;
  "tip-weekly-top-donation": NameAmount;
  "tip-weekly-top-donator": NameAmount;
  "cheer-alltime-top-donation": NameAmount;
  "cheer-alltime-top-donator": NameAmount;
  "charityCampaignDonation-session-top-donation": NameAmount;
  "charityCampaignDonation-session-top-donator": NameAmount;
  "cheer-monthly-top-donation": NameAmount;
  "cheer-monthly-top-donator": NameAmount;
  "cheer-session-top-donation": NameAmount;
  "cheer-session-top-donator": NameAmount;
  "cheer-weekly-top-donation": NameAmount;
  "cheer-weekly-top-donator": NameAmount;
  "cheerPurchase-session-top-donation": NameAmount;
  "cheerPurchase-session-top-donator": NameAmount;
  "superchat-session-top-donation": NameAmount;
  "superchat-session-top-donator": NameAmount;
  "tip-session-top-donation": NameAmount;
  "tip-session-top-donator": NameAmount;
}

export interface Channel {
  apiToken: string;
  avatar: string;
  id: string;
  providerId: string;
  username: string;
}

export interface Session {
  data: SessionData;
  settings: {
    autoReset: boolean;
    calendar: boolean;
  };
}

export interface WidgetLoadData<T> {
  session: Session;
  recents: Activity[];
  currency: Currency;
  channel: Channel;
  fieldData: T;
  overlay: {
    isEditorMode: true;
    muted: false;
  };
}

export interface Item extends Name {
  price: number;
  quantity: number;
}

export type EventName =
  | "follower-latest"
  | "subscriber-latest"
  | "host-latest"
  | "cheer-latest"
  | "tip-latest"
  | "raid-latest"
  | "message"
  | "delete-message"
  | "delete-messages"
  | "event:skip"
  | "alertService:toggleSound"
  | "bot:counter"
  | "kvstore:update"
  | "widget-button";

export interface EventCommon extends Name {
  items: Item[];
  month: string;
  isTest: boolean;
  sessionTop: boolean;
  itemId?: string;
}

export interface FollowEvent extends EventCommon, Amount, Count, Tier {
  type: "follower";
  originalEventName: "follower-latest";
}

export interface SubscribeEvent
  extends EventCommon,
  Amount,
  Count,
  Tier,
  Message {
  type: "subscriber";
  gifted: boolean;
  bulkGifted: boolean;
  sender: string;
  subExtension: boolean;
  originalEventName: "subscriber-latest";
}

export interface HostEvent extends EventCommon, Amount, Count, Tier {
  type: "host";
  originalEventName: "host-latest";
}

export interface CheerEvent extends EventCommon, Amount, Count, Tier, Message {
  type: "cheer";
  tts: boolean;
  originalEventName: "cheer-latest";
}

export interface TipEvent extends EventCommon, Amount, Count, Tier, Message {
  type: "tip";
  originalEventName: "tip-latest";
}

export interface RaidEvent extends EventCommon, Amount, Count, Tier {
  type: "raid";
  originalEventName: "raid-latest";
}

// TODO: message, delete-message, delete-messages, event:skip, alertService:toggleSound, bot:counter, kvstore:update
//       widget-button

export type EventReceived =
  | {
    listener: "follower-latest";
    event: FollowEvent;
  }
  | {
    listener: "subscriber-latest";
    event: SubscribeEvent;
  }
  | {
    listener: "host-latest";
    event: HostEvent;
  }
  | {
    listener: "cheer-latest";
    event: CheerEvent;
  }
  | {
    listener: "tip-latest";
    event: TipEvent;
  }
  | {
    listener: "raid-latest";
    event: RaidEvent;
  }
  | {
    listener: EventName;
    event: { [key: string]: any };
  };
