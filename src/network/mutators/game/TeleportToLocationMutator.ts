import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import TeleportToLocation from "../../incoming/game/TeleportToLocation";
import Appearing from "../../outgoing/game/Appearing";
import ValidatePosition from "../../outgoing/game/ValidatePosition";

export default class TeleportToLocationMutator extends IMMOClientMutator<GameClient, TeleportToLocation> {
  update(packet: TeleportToLocation): void {
    const creature = this.Client.CreaturesList.getEntryByObjectId(packet.ObjectId);
    if (creature) {
      const [_x, _y, _z] = packet.Location;
      creature.setLocation(_x, _y, _z);
    }

    if (packet.ObjectId === this.Client.ActiveChar.ObjectId) {
      this.Client.CreaturesList.clear();
      this.Client.DroppedItems.clear();

      this.Client.sendPacket(new Appearing());
      this.Client.sendPacket(
        new ValidatePosition(
          this.Client.ActiveChar.X,
          this.Client.ActiveChar.Y,
          this.Client.ActiveChar.Z,
          this.Client.ActiveChar.Heading,
          0
        )
      );
    }
  }
}
