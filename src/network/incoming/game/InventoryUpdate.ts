import L2Item from "../../../entities/L2Item";
import GameClientPacket from "./GameClientPacket";

export default class InventoryUpdate extends GameClientPacket {
  Items: L2Item[] = [];
  ItemsToRemove: L2Item[] = [];

  // @Override
  readImpl(): boolean {
    const _id = this.readC();

    const _size = this.readH();
    for (let i = 0; i < _size; i++) {
      const _updateType = this.readH(); // Update type : 01-add, 02-modify, 03-remove
      const item = this.readItem();
      if (_updateType === 3) {
        this.ItemsToRemove.push(item);
      } else {
        this.Items.push(item);
      }
    }

    return true;
  }
}
