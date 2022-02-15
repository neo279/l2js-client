import IMMOClientMutator from "../../../mmocore/IMMOClientMutator";
import GameClient from "../../GameClient";
import RecipeBookItemList from "../../incoming/game/RecipeBookItemList";

export default class RecipeBookItemListMutator extends IMMOClientMutator<
  GameClient,
  RecipeBookItemList
> {
  update(packet: RecipeBookItemList): void {
    if (packet.IsDwarvenCraft) {
      this.Client.DwarfRecipeBook.clear();
    } else {
      this.Client.CommonRecipeBook.clear();
    }

    packet.Recipes.forEach((recipe) => {
      if (packet.IsDwarvenCraft) {
        this.Client.DwarfRecipeBook.add(recipe);
      } else {
        this.Client.CommonRecipeBook.add(recipe);
      }
    });

    this.emit("RecipeBook", {
      isDwarven: packet.IsDwarvenCraft,
    });
  }
}
