import L2User from "../../../entities/L2User";
import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import UserInfo from "../../incoming/game/UserInfo";

export default class UserInfoMutator extends IMMOClientMutator<GameClient, UserInfo> {
  update(packet: UserInfo): void {
    const user = this.Client.ActiveChar;
    if (!user) {
      this.Client.ActiveChar = new L2User();
    }

    Object.assign(this.Client.ActiveChar, packet.User);

    if (
      this.Client.ActiveChar.ObjectId &&
      !this.Client.CreaturesList.getEntryByObjectId(this.Client.ActiveChar.ObjectId)
    ) {
      this.Client.CreaturesList.add(this.Client.ActiveChar);
    }
  }
}
