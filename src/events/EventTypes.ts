import L2Creature from "../entities/L2Creature";
import ReceivablePacket from "../mmocore/ReceivablePacket";
import MMOClient from "../mmocore/MMOClient";
import SendablePacket from "../mmocore/SendablePacket";
import L2PartyMember from "../entities/L2PartyMember";
import LoginClient from "../network/LoginClient";
import GameClient from "../network/GameClient";
import { ConfirmDlgType } from "../enums/ConfirmDlgType";

export declare type ELoggedIn = {
  login: LoginClient;
  game: GameClient;
};
export declare type EPacketReceived = {
  packet: ReceivablePacket;
};
export declare type EPacketSent = {
  packet: SendablePacket;
};
export declare type EPartyRequest = {
  requestorName: string;
  partyDistributionType: number;
};
export declare type EDie = {
  creature: L2Creature;
  isSpoiled: boolean;
};
export declare type ETargetSelected = {
  objectId: number;
  targetObjectId: number;
  targetLocation: number[];
};
export declare type EMyTargetSelected = {
  objectId: number;
};
export declare type EAttacked = {
  object: number;
  subjects: number[];
};
export declare type ERequestedDuel = {
  requestorName: string;
};
export declare type EStartMoving = {
  creature: L2Creature;
};
export declare type EStopMoving = {
  creature: L2Creature;
};
export declare type ECraftResult = {
  recipeId: number;
  success: boolean;
};
export declare type ERecipeBook = {
  isDwarven: boolean;
};
export declare type EPartySmallWindow = {
  member: L2PartyMember;
  action: "add" | "add-all" | "delete" | "delete-all" | "update";
};
export declare type EPartyMemberPosition = {
  member: L2PartyMember;
};
export declare type ECharInfo = {
  creature: L2Creature;
};
export declare type ERevive = {
  creature: L2Creature;
};
export declare type EConfirmDlg = {
  messageId: number;
  type: ConfirmDlgType;
  isResurrect: boolean;
  params: [];
  time: number;
  requesterId: number;
};
export declare type ESystemMessage = {
  messageId: number;
  params: [];
};
export declare type ECreatureSay = {
  objectId: number;
  type: number;
  charName: string;
  npcStringId: number;
  messages: string[];
};
export declare type ENpcHtmlMessage = {
  npcObjectId: number;
  html: string;
  itemId: number;
};
export declare type ENpcQuestHtmlMessage = {
  npcObjectId: number;
  html: string;
  questId: number;
};
export declare type EPartySpelled = {
  creature: L2Creature;
};

// Events
export declare type OnLoggedIn = ["LoggedIn", (e: ELoggedIn) => void];
export declare type OnPlayOk = ["PlayOk", () => void];
export declare type OnLoggedInEvent = ["LoggedIn", () => void];
export declare type OnPacketReceivedEvent = ["PacketReceived", string, (e: EPacketReceived) => void];
export declare type OnPacketSentEvent = ["PacketSent", string, (e: EPacketSent) => void];
export declare type OnPartyRequestEvent = ["PartyRequest", (e: EPartyRequest) => void];
export declare type OnDieEvent = ["Die", (e: EDie) => void];
export declare type OnTargetSelectedEvent = ["TargetSelected", (e: ETargetSelected) => void];
export declare type OnMyTargetSelectedEvent = ["MyTargetSelected", (e: EMyTargetSelected) => void];
export declare type OnAttackedEvent = ["Attacked", (e: EAttacked) => void];
export declare type OnRequestedDuelEvent = ["RequestedDuel", (e: ERequestedDuel) => void];
export declare type OnStartMovingEvent = ["StartMoving", (e: EStartMoving) => void];
export declare type OnStopMovingEvent = ["StopMoving", (e: EStopMoving) => void];
export declare type OnCraftResultEvent = ["CraftResult", (e: ECraftResult) => void];
export declare type OnRecipeBookEvent = ["RecipeBook", (e: ERecipeBook) => void];
export declare type OnPartySmallWindow = ["PartySmallWindow", (e: EPartySmallWindow) => void];
export declare type OnPartyMemberPosition = ["PartyMemberPosition", (e: EPartyMemberPosition) => void];
export declare type OnCharInfo = ["CharInfo", (e: ECharInfo) => void];
export declare type OnRevive = ["Revive", (e: ERevive) => void];
export declare type OnConfirmDlg = ["ConfirmDlg", (e: EConfirmDlg) => void];
export declare type OnSystemMessage = ["SystemMessage", (e: ESystemMessage) => void];
export declare type OnCreatureSay = ["CreatureSay", (e: ECreatureSay) => void];
export declare type OnNpcHtmlMessage = ["NpcHtmlMessage", (e: ENpcHtmlMessage) => void];
export declare type OnNpcQuestHtmlMessage = ["NpcQuestHtmlMessage", (e: ENpcQuestHtmlMessage) => void];
export declare type OnPartySpelled = ["PartySpelled", (e: EPartySpelled) => void];

// prettier-ignore
export declare type EventHandlerType =
  OnLoggedIn
  | OnLoggedInEvent
  | OnPacketReceivedEvent
  | OnPacketSentEvent
  | OnPartyRequestEvent
  | OnDieEvent
  | OnTargetSelectedEvent
  | OnMyTargetSelectedEvent
  | OnAttackedEvent
  | OnRequestedDuelEvent
  | OnStartMovingEvent
  | OnStopMovingEvent
  | OnCraftResultEvent
  | OnPartySmallWindow
  | OnPartyMemberPosition
  | OnCharInfo
  | OnRevive
  | OnConfirmDlg
  | OnSystemMessage
  | OnCreatureSay
  | OnRecipeBookEvent
  | OnNpcHtmlMessage
  | OnNpcQuestHtmlMessage
  | OnPartySpelled;
