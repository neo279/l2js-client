import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import InventoryUpdate from "../../incoming/game/InventoryUpdate";

export default class InventoryUpdateMutator extends IMMOClientMutator<GameClient, InventoryUpdate> {
  update(packet: InventoryUpdate): void {
    packet.Items.forEach((item) => {
      const currentItem = this.Client.InventoryItems.getEntryByObjectId(item.ObjectId);
      if (currentItem) {
        this.Client.InventoryItems.delete(currentItem);
      }

      this.Client.InventoryItems.add(item);
    });

    for (const item of packet.ItemsToRemove) {
      this.Client.InventoryItems.removeByObjectId(item.ObjectId);
    }
  }
}
